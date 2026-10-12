import { useEffect, useMemo, useState } from 'react';
import NorthEastRoundedIcon from '@mui/icons-material/NorthEastRounded';
import SouthEastRoundedIcon from '@mui/icons-material/SouthEastRounded';
import AccessAlarmRoundedIcon from '@mui/icons-material/AccessAlarmRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CloseIcon from '@mui/icons-material/Close';
import VolumeUpRoundedIcon from '@mui/icons-material/VolumeUpRounded';
import VolumeOffRoundedIcon from '@mui/icons-material/VolumeOffRounded';
import DesktopWindowsOutlinedIcon from '@mui/icons-material/DesktopWindowsOutlined';
import SearchIcon from '@mui/icons-material/Search';
import FlagRoundedIcon from '@mui/icons-material/FlagRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import AdjustRoundedIcon from '@mui/icons-material/AdjustRounded';
import LockRoundedIcon from '@mui/icons-material/LockRounded';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import VerticalAlignTopRoundedIcon from '@mui/icons-material/VerticalAlignTopRounded';
import Badge from './Badge';
import { formatPrice, formatTime } from './format';
import { actionOf, ALERT_ACTIONS } from './alertActions';

// The race board's icons where the meaning is the same: volume's bar chart, Touched's target for a test of the
// 20 SMA, yesterday's-high arrow for today's high, the warning triangle for a caution.
const BADGE_ICONS = {
  'on-board': FlagRoundedIcon,
  'trending-volume': BarChartRoundedIcon,
  volume: BarChartRoundedIcon,
  'quiet-volume': BarChartRoundedIcon,
  'steep-sma': TrendingUpRoundedIcon,
  'deep-test': AdjustRoundedIcon,
  'tight-stop': LockRoundedIcon,
  'wide-stop': WarningAmberRoundedIcon,
  'room-to-high': VerticalAlignTopRoundedIcon,
};
// The live volume badge replaces the one an older alert was stamped with.
const VOLUME_BADGES = ['trending-volume', 'volume', 'quiet-volume'];

// The Alerts tab: one section per alert group (signal), each ranking its stocks by score like the race, so a strong
// setup that came early stays on top. An event's stages (a band touch and its hold; a 20 SMA reclaim forming and
// closing) form one row; its call is the latest stage. A stock's score adds its live setups (both reclaim hours).

const NEW_YORK = 'America/New_York';
const ISRAEL = 'Asia/Jerusalem';
// Buy setups stay until closed; the rest fade after this long.
const FADE_SECONDS = 12;

const TONE_ICONS = { opportunity: NorthEastRoundedIcon, prepare: AccessAlarmRoundedIcon, caution: SouthEastRoundedIcon, info: InfoOutlinedIcon };

const AlertTime = ({ iso }) => (
  <span className="alert__time" title={`${formatTime(iso, ISRAEL)} Israel`}>
    {formatTime(iso, NEW_YORK)} NY
  </span>
);

const ActionPill = ({ alert }) => {
  const Icon = TONE_ICONS[alert.tone] || InfoOutlinedIcon;
  return (
    <span className={`action-pill action-pill--${alert.tone}`}>
      <Icon fontSize="inherit" />
      {actionOf(alert).label}
    </span>
  );
};

// One event: its stages oldest first, judged by the latest.
const toEvents = (alerts) => {
  const byEvent = {};
  alerts.forEach((alert) => {
    const key = alert.eventId || alert.id;
    (byEvent[key] = byEvent[key] || []).push(alert);
  });
  return Object.entries(byEvent).map(([id, stages]) => {
    const ordered = [...stages].sort((a, b) => a.timeIso.localeCompare(b.timeIso));
    const latest = ordered[ordered.length - 1];
    return { id, quote: latest.quote, signal: latest.signal, stages: ordered, latest };
  });
};

// An event is a live setup while its latest stage is a buy setup or a "Get ready"; its score counts toward the stock's.
const isLiveSetup = (event) => ['opportunity', 'prepare'].includes(event.latest.tone);
const eventScore = (event) => event.latest.score ?? 0;

// The stocks of one group, all rated: live setups first (their scores added), then the rest by their best rating.
const rankStocks = (events) =>
  Object.values(
    events.reduce((byQuote, event) => {
      (byQuote[event.quote] = byQuote[event.quote] || { quote: event.quote, events: [] }).events.push(event);
      return byQuote;
    }, {})
  )
    .map((stock) => {
      const ordered = stock.events.sort((a, b) => b.latest.timeIso.localeCompare(a.latest.timeIso));
      const live = ordered.filter(isLiveSetup);
      const score = live.length > 0 ? live.reduce((sum, event) => sum + eventScore(event), 0) : Math.max(0, ...ordered.map(eventScore));
      return { ...stock, events: ordered, score, setups: live.length };
    })
    .sort(
      (a, b) =>
        Number(b.setups > 0) - Number(a.setups > 0) || b.score - a.score || b.events[0].latest.timeIso.localeCompare(a.events[0].latest.timeIso)
    );

const ScoreChip = ({ score, title }) => (
  <span className="alert-score" title={title}>
    {Math.round(score)}
  </span>
);

const eventText = (event) => [event.quote, ...event.stages.flatMap((stage) => [stage.title, stage.summary, stage.message, stage.stage, actionOf(stage).label])];
const matchesSearch = (event, query) => !query || eventText(event).some((text) => text && text.toUpperCase().includes(query));

const StageTrail = ({ stages }) => (
  <span className="stage-trail">
    {stages.map((stage, index) => (
      <span key={stage.id} className="stage-trail__step">
        {index > 0 && <span className="stage-trail__arrow">→</span>}
        <span className={`stage-chip stage-chip--${stage.tone}`}>
          {stage.stage} {formatTime(stage.timeIso, NEW_YORK)}
        </span>
      </span>
    ))}
  </span>
);

const EventRow = ({ event, unread, expanded, onClick }) => {
  const { latest } = event;
  return (
    <li className={`alert alert--${latest.tone}${unread ? ' alert--unread' : ''}`}>
      <button type="button" className="alert__toggle" aria-expanded={expanded} onClick={onClick}>
        <div className="alert__head">
          <ActionPill alert={latest} />
          {latest.score != null && <ScoreChip score={latest.score} title="This setup's score (100 × its factors)" />}
          <span className="alert__price">at {formatPrice(latest.price)}</span>
          {event.stages.length > 1 && <StageTrail stages={event.stages} />}
          <AlertTime iso={latest.timeIso} />
        </div>
        <p className="alert__summary">
          <span className="alert__title">{latest.title}.</span> {latest.summary}
        </p>
        {expanded && (
          <div className="alert__more">
            {event.stages.map((stage) => (
              <div key={stage.id} className="stage-detail">
                <div className="stage-detail__head">
                  <span className={`stage-chip stage-chip--${stage.tone}`}>{stage.stage}</span>
                  <AlertTime iso={stage.timeIso} />
                </div>
                <p className="alert__message">{stage.message}</p>
                {stage.scoreParts && (
                  <ul className="alert__score-parts">
                    {stage.scoreParts.map((part) => (
                      <li key={part.label}>
                        <span>{part.label}</span>
                        <span className="muted">{part.note}</span>
                        <strong>× {part.factor.toFixed(2)}</strong>
                      </li>
                    ))}
                    <li className="alert__score-total">
                      <span>Score</span>
                      <strong>{stage.score}</strong>
                    </li>
                  </ul>
                )}
                <ul className="alert__details">
                  {stage.details.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </button>
    </li>
  );
};

// One stock in its group's rated list; its color follows its latest call.
const SetupCard = ({ stock, volumeBadge, rank, isEventUnread, expandedId, onToggle, onDismiss }) => {
  const { quote, events, score, setups } = stock;
  const latest = events[0].latest;
  const setupBadges = (events.find((event) => event.latest.badges)?.latest.badges || []).filter((badge) => !VOLUME_BADGES.includes(badge.id));
  const badges = volumeBadge ? [volumeBadge, ...setupBadges] : setupBadges;
  return (
    <article className={`setup-card setup-card--${latest.tone}`}>
      <header className="setup-card__head">
        <span className="setup-card__rank">{rank}</span>
        <strong className="setup-card__quote">{quote}</strong>
        {setups > 1 && <span className="setup-card__repeat">{setups}× setup</span>}
        <span className="setup-card__score" title={setups > 1 ? `${setups} setups added together` : 'Rating: 100 × its factors (open the alert to see them)'}>
          {score > 0 ? Math.round(score) : '–'}
        </span>
        <button type="button" className="icon-button setup-card__dismiss" aria-label={`Dismiss ${quote} from this list`} title="Dismiss from this list" onClick={onDismiss}>
          <CloseIcon fontSize="small" />
        </button>
      </header>
      {badges.length > 0 && (
        <div className="setup-card__badges">
          {badges.map((badge) => (
            <Badge key={badge.id} id={badge.id} label={badge.label} detail={badge.detail} Icon={BADGE_ICONS[badge.id]} />
          ))}
        </div>
      )}
      <ul className="alert-list">
        {events.map((event) => (
          <EventRow key={event.id} event={event} unread={isEventUnread(event)} expanded={expandedId === event.id} onClick={() => onToggle(event)} />
        ))}
      </ul>
    </article>
  );
};

const AlertColumn = ({ signal, events, statuses, volume, sessionOpen, isEventUnread, expandedId, onToggle, dismissedQuotes, onDismiss, onRestore }) => {
  const stocks = rankStocks(events.filter((event) => !dismissedQuotes.includes(event.quote)));
  const hidden = dismissedQuotes.filter((quote) => events.some((event) => event.quote === quote));
  const buyCount = stocks.filter((stock) => stock.events[0].latest.tone === 'opportunity').length;
  return (
    <section className={`alert-col alert-col--${signal.id}`}>
      <header className="alert-col__head">
        <h3>{signal.title}</h3>
        <div className="alert-col__counts">
          <span className="alert-col__buys">{buyCount === 1 ? '1 buy setup' : `${buyCount} buy setups`}</span>
          <span>{stocks.length === 1 ? '1 stock' : `${stocks.length} stocks`}</span>
        </div>
      </header>
      {stocks.length === 0 ? (
        <p className="alert-col__empty">No alerts yet.</p>
      ) : (
        <div className="setup-list">
          {stocks.map((stock, index) => (
            <SetupCard
              key={stock.quote}
              stock={stock}
              volumeBadge={volume[stock.quote]}
              rank={index + 1}
              isEventUnread={isEventUnread}
              expandedId={expandedId}
              onToggle={onToggle}
              onDismiss={() => onDismiss(signal.id, stock.quote)}
            />
          ))}
        </div>
      )}
      {hidden.length > 0 && (
        <details className="alert-col__fold">
          <summary>
            Dismissed <span className="panel__count">{hidden.length}</span>
            <span className="muted">no popups from them in this list</span>
          </summary>
          <ul className="dismissed-list">
            {hidden.map((quote) => (
              <li key={quote}>
                <strong>{quote}</strong>
                <button type="button" className="link-button" onClick={() => onRestore(signal.id, quote)}>
                  Bring back
                </button>
              </li>
            ))}
          </ul>
        </details>
      )}
      <details className="alert-col__fold">
        <summary>
          Watching <span className="panel__count">{statuses.length}</span>
          <span className="muted">and how it works</span>
        </summary>
        <p className="alert-col__rule">{signal.description}</p>
        {statuses.length === 0 ? (
          <p className="muted">{sessionOpen ? 'No stock fits today.' : 'Starts at the bell.'}</p>
        ) : (
          <ul className="watching-list">
            {statuses.map((status) => (
              <li key={status.quote} className="watching">
                <strong>{status.quote}</strong>
                <span className="watching__state">{status.state}</span>
                <span className="watching__note">{status.note}</span>
              </li>
            ))}
          </ul>
        )}
      </details>
    </section>
  );
};

const Choices = ({ label, choices, value, onChange }) => (
  <div className="segmented" role="group" aria-label={label}>
    {choices.map(({ key, label: text, count }) => (
      <button
        key={key}
        type="button"
        className={`segmented__option alert-filter alert-filter--${key}`}
        aria-pressed={value === key}
        onClick={() => onChange(key)}
      >
        {text}
        <span className="segmented__count">{count}</span>
      </button>
    ))}
  </div>
);

const AlertsTab = ({ marketWatch }) => {
  const { watch, alerts, isRead, markRead, markAllRead, settings, toggleDesktop, desktopBlocked, toggleSound, unreadCount, dismissed, dismissStock, restoreStock } =
    marketWatch;
  const signals = watch?.signals || [];
  const [search, setSearch] = useState('');
  const [action, setAction] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const query = search.trim().toUpperCase();

  const events = useMemo(() => toEvents(alerts), [alerts]);
  const searched = events.filter((event) => matchesSearch(event, query));
  const visible = action === 'all' ? searched : searched.filter((event) => event.latest.tone === action);
  const stockCount = new Set(visible.map((event) => event.quote)).size;

  const isEventUnread = (event) => event.stages.some((stage) => !isRead(stage.id));
  const toggleEvent = (event) => {
    event.stages.forEach((stage) => markRead(stage.id));
    setExpandedId(expandedId === event.id ? null : event.id);
  };
  const actionChoices = [
    { key: 'all', label: 'All', count: searched.length },
    ...Object.entries(ALERT_ACTIONS).map(([tone, item]) => ({
      key: tone,
      label: item.filterLabel,
      count: searched.filter((event) => event.latest.tone === tone).length,
    })),
  ];

  return (
    <div className="alerts-page">
      <section className="board__main">
        <div className="toolbar">
          <h2 className="toolbar__title">
            Alerts <span className="panel__count">{stockCount === 1 ? '1 stock' : `${stockCount} stocks`}</span>
          </h2>
          <div className="toolbar__controls">
            <label className="search search--toolbar">
              <SearchIcon fontSize="small" className="search__icon" />
              <input
                type="search"
                className="search__input"
                placeholder="Search ticker or words"
                aria-label="Search alerts"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                onKeyDown={(event) => event.key === 'Escape' && setSearch('')}
              />
            </label>
            <button
              type="button"
              className="toggle-button"
              aria-pressed={settings.desktop}
              onClick={toggleDesktop}
              disabled={desktopBlocked && !settings.desktop}
              title={desktopBlocked ? 'Desktop notifications are blocked for this site in the browser settings' : 'Also show popups as desktop notifications'}
            >
              <DesktopWindowsOutlinedIcon fontSize="small" />
              Desktop
            </button>
            <button type="button" className="toggle-button" aria-pressed={settings.sound} onClick={toggleSound} title="Chime on buy setups">
              {settings.sound ? <VolumeUpRoundedIcon fontSize="small" /> : <VolumeOffRoundedIcon fontSize="small" />}
              Sound
            </button>
            {unreadCount > 0 && (
              <button type="button" className="link-button" onClick={markAllRead}>
                Mark all read
              </button>
            )}
          </div>
        </div>
        <div className="alerts-filters">
          <Choices label="Filter by call" choices={actionChoices} value={action} onChange={setAction} />
        </div>
        {alerts.length === 0 && <p className="alerts-empty muted">No alerts yet today. They arrive here during the session.</p>}
        <div className="alert-columns">
          {signals.map((signal) => (
            <AlertColumn
              key={signal.id}
              signal={signal}
              events={visible.filter((event) => event.signal === signal.id)}
              statuses={(watch?.watching || []).filter((status) => status.signal === signal.id)}
              volume={watch?.volume || {}}
              sessionOpen={watch?.sessionOpen}
              isEventUnread={isEventUnread}
              expandedId={expandedId}
              onToggle={toggleEvent}
              dismissedQuotes={dismissed[signal.id] || []}
              onDismiss={dismissStock}
              onRestore={restoreStock}
            />
          ))}
        </div>
      </section>
    </div>
  );
};

export default AlertsTab;

const Toast = ({ alert, onClose, onOpen }) => {
  useEffect(() => {
    if (actionOf(alert).stays) {
      return undefined;
    }
    const timer = setTimeout(() => onClose(alert.id), FADE_SECONDS * 1000);
    return () => clearTimeout(timer);
  }, [alert, onClose]);

  return (
    <div className={`toast toast--${alert.tone}`} role={alert.tone === 'opportunity' ? 'alert' : 'status'}>
      <button type="button" className="toast__body" onClick={() => onOpen(alert)} title="Open in the Alerts tab">
        <div className="alert__head">
          <ActionPill alert={alert} />
          <strong className="alert__quote">{alert.quote}</strong>
          {alert.score != null && <ScoreChip score={alert.score} title="This setup's score (100 × its factors)" />}
          <span className="alert__price">at {formatPrice(alert.price)}</span>
          <AlertTime iso={alert.timeIso} />
        </div>
        <p className="alert__summary">
          <span className="alert__title">{alert.title}.</span> {alert.summary}
        </p>
      </button>
      <button type="button" className="icon-button" aria-label="Close" onClick={() => onClose(alert.id)}>
        <CloseIcon fontSize="small" />
      </button>
    </div>
  );
};

export const AlertToasts = ({ toasts, onClose, onOpen }) => (
  <div className="toasts" aria-live="polite">
    {toasts.slice(-5).map((alert) => (
      <Toast key={alert.id} alert={alert} onClose={onClose} onOpen={onOpen} />
    ))}
  </div>
);
