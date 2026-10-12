import { useCallback, useEffect, useRef, useState } from 'react';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
import { SOCKET_SERVER_URL } from '../users/useSignals';
import { actionOf } from './alertActions';

// The market watch: the engine's alerts during the session (the Alerts tab), the stocks it is watching,
// and the popups for alerts that arrive live. Read marks and the two switches are saved in localStorage.

const SETTINGS_KEY = 'marketWatch.settings';
// Alerts of one engine update arrive together; collect them this long, then pick the popups.
const BATCH_MS = 800;
// Many stocks reclaim the 20 SMA at the same hour close: only the best scores pop up, the rest are on the tab.
const MAX_RECLAIM_POPUPS = 3;
const RECLAIM = 'sma-reclaim';

// One popup per event (its latest stage), and at most MAX_RECLAIM_POPUPS reclaims, the highest scores.
const pickToasts = (toasts) => {
  const latestByEvent = {};
  toasts.forEach((toast) => {
    latestByEvent[toast.eventId || toast.id] = toast;
  });
  const unique = Object.values(latestByEvent);
  const keptReclaims = new Set(
    unique
      .filter((toast) => toast.signal === RECLAIM)
      .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
      .slice(0, MAX_RECLAIM_POPUPS)
      .map((toast) => toast.id)
  );
  return unique.filter((toast) => toast.signal !== RECLAIM || keptReclaims.has(toast.id));
};
const readKey = (tradeDate) => `marketWatch.read.${tradeDate}`;
// Stocks the user took out of an alert group's list today: { [signal]: [quote, ...] }. No popups from them there.
const dismissedKey = (tradeDate) => `marketWatch.dismissed.${tradeDate}`;
const DEFAULT_SETTINGS = { desktop: false, sound: true };

const loadJson = (key, fallback) => {
  try {
    return JSON.parse(window.localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

// Two short rising tones: noticeable without being alarming.
const playChime = () => {
  try {
    const context = new (window.AudioContext || window.webkitAudioContext)();
    [660, 990].forEach((frequency, index) => {
      const oscillator = context.createOscillator();
      const gain = context.createGain();
      const start = context.currentTime + index * 0.16;
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0.0001, start);
      gain.gain.exponentialRampToValueAtTime(0.18, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.3);
      oscillator.connect(gain).connect(context.destination);
      oscillator.start(start);
      oscillator.stop(start + 0.32);
    });
  } catch {
    // no audio available
  }
};

const showDesktopNotification = (alert) => {
  if (!('Notification' in window) || Notification.permission !== 'granted') {
    return;
  }
  const notification = new Notification(`${actionOf(alert).label.toUpperCase()} · ${alert.quote} at ${alert.price.toFixed(2)}`, {
    body: `${alert.title}. ${alert.summary}`,
    tag: alert.id,
  });
  notification.onclick = () => window.focus();
};

const useMarketWatch = () => {
  const [watch, setWatch] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [readIds, setReadIds] = useState([]);
  const [dismissed, setDismissed] = useState({});
  const dismissedRef = useRef(dismissed);
  dismissedRef.current = dismissed;
  const [settings, setSettings] = useState(() => ({ ...DEFAULT_SETTINGS, ...loadJson(SETTINGS_KEY, {}) }));
  const settingsRef = useRef(settings);
  settingsRef.current = settings;
  const toastsRef = useRef(toasts);
  toastsRef.current = toasts;
  const pendingRef = useRef([]);
  const batchTimerRef = useRef(null);
  const tradeDate = watch?.tradeDate;

  useEffect(() => {
    if (tradeDate) {
      setReadIds(loadJson(readKey(tradeDate), []));
      setDismissed(loadJson(dismissedKey(tradeDate), {}));
    }
  }, [tradeDate]);

  useEffect(() => {
    const socket = socketIOClient(SOCKET_SERVER_URL);
    socket.on('connect', () =>
      axios
        .get(`${SOCKET_SERVER_URL}/market-watch`)
        .then((response) => response.data && setWatch(response.data))
        .catch(() => {})
    );
    socket.on('marketWatchUpdate', setWatch);
    const showBatch = () => {
      const batch = pendingRef.current.filter((alert) => !(dismissedRef.current[alert.signal] || []).includes(alert.quote));
      pendingRef.current = [];
      const batchIds = new Set(batch.map((alert) => alert.id));
      const next = pickToasts([...toastsRef.current.filter((toast) => !batchIds.has(toast.id)), ...batch]);
      const shown = next.filter((toast) => batchIds.has(toast.id));
      toastsRef.current = next;
      setToasts(next);
      if (settingsRef.current.desktop) {
        shown.forEach(showDesktopNotification);
      }
      if (settingsRef.current.sound && shown.some((alert) => alert.tone === 'opportunity')) {
        playChime();
      }
    };
    socket.on('marketAlert', ({ alert, live }) => {
      if (!live || !actionOf(alert).popup) {
        return;
      }
      pendingRef.current.push(alert);
      clearTimeout(batchTimerRef.current);
      batchTimerRef.current = setTimeout(showBatch, BATCH_MS);
    });
    return () => {
      clearTimeout(batchTimerRef.current);
      socket.disconnect();
    };
  }, []);

  const saveRead = useCallback(
    (next) => {
      setReadIds(next);
      if (tradeDate) {
        window.localStorage.setItem(readKey(tradeDate), JSON.stringify(next));
      }
    },
    [tradeDate]
  );

  const alerts = watch?.alerts || [];
  const isDismissed = (alert) => (dismissed[alert.signal] || []).includes(alert.quote);
  const activeAlerts = alerts.filter((alert) => !isDismissed(alert));
  const unread = activeAlerts.filter((alert) => !readIds.includes(alert.id));
  const markAllRead = () => saveRead(alerts.map((alert) => alert.id));
  const markRead = (id) => !readIds.includes(id) && saveRead([...readIds, id]);
  const dismissToast = useCallback((id) => setToasts((current) => current.filter((toast) => toast.id !== id)), []);

  const saveDismissed = (next) => {
    setDismissed(next);
    if (tradeDate) {
      window.localStorage.setItem(dismissedKey(tradeDate), JSON.stringify(next));
    }
  };
  const dismissStock = (signal, quote) => {
    saveDismissed({ ...dismissed, [signal]: [...new Set([...(dismissed[signal] || []), quote])] });
    setToasts((current) => current.filter((toast) => !(toast.signal === signal && toast.quote === quote)));
  };
  const restoreStock = (signal, quote) => saveDismissed({ ...dismissed, [signal]: (dismissed[signal] || []).filter((item) => item !== quote) });

  const updateSettings = (change) => {
    const next = { ...settings, ...change };
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(next));
    setSettings(next);
  };
  // The browser only shows desktop notifications after the user allows them once.
  const toggleDesktop = async () => {
    if (settings.desktop) {
      updateSettings({ desktop: false });
      return;
    }
    if (!('Notification' in window)) {
      return;
    }
    const permission = Notification.permission === 'default' ? await Notification.requestPermission() : Notification.permission;
    updateSettings({ desktop: permission === 'granted' });
  };
  const desktopBlocked = 'Notification' in window ? Notification.permission === 'denied' : true;

  return {
    watch,
    alerts,
    activeAlerts, // without the dismissed stocks
    unreadCount: unread.length,
    isRead: (id) => readIds.includes(id),
    markRead,
    markAllRead,
    toasts,
    dismissToast,
    dismissed,
    dismissStock,
    restoreStock,
    settings,
    toggleDesktop,
    desktopBlocked,
    toggleSound: () => updateSettings({ sound: !settings.sound }),
  };
};

export default useMarketWatch;
