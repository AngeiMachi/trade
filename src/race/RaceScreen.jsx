import NotificationsActiveOutlinedIcon from '@mui/icons-material/NotificationsActiveOutlined';
import FlagOutlinedIcon from '@mui/icons-material/FlagOutlined';
import CloudOffOutlinedIcon from '@mui/icons-material/CloudOffOutlined';
import HourglassEmptyOutlinedIcon from '@mui/icons-material/HourglassEmptyOutlined';
import FilterListOffOutlinedIcon from '@mui/icons-material/FilterListOffOutlined';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import KeyboardDoubleArrowUpRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import AutoGraphRoundedIcon from '@mui/icons-material/AutoGraphRounded';
import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
import { useState } from 'react';
import useRace from './useRace';
import useMarketWatch from './useMarketWatch';
import AlertsTab, { AlertToasts } from './AlertsTab';
import useDismissed from './useDismissed';
import useWatchlist from './useWatchlist';
import RaceHeader from './RaceHeader';
import TimingTower from './TimingTower';
import SidePanel from './SidePanel';
import './race.css';

const isClean = (entry) => entry.status === 'racing' && entry.smaTouches === 0;

// One-of-several filters (segmented switches). `word` names the choice in the podium title, e.g. "Top 3 clean".
const holdFilters = {
  all: { label: 'All', word: '', matches: () => true },
  clean: { label: 'Clean', word: 'clean', matches: isClean },
  touched: { label: 'Touched', word: 'touched', matches: (entry) => !isClean(entry) },
};

const trendFilters = {
  all: { label: 'All trends', word: '', matches: () => true },
  strong: {
    label: 'Strong uptrend',
    word: 'strong uptrend',
    Icon: KeyboardDoubleArrowUpRoundedIcon,
    title: 'Price above the daily 10 SMA and 20 SMA, and the 10 SMA above the 20 SMA',
    matches: (entry) => entry.dailyTrend?.isStrongUptrend === true,
  },
  uptrend: {
    label: 'Uptrend',
    word: 'uptrend',
    Icon: TrendingUpRoundedIcon,
    title: 'Price above the daily 10 SMA and 20 SMA (strong uptrends included)',
    matches: (entry) => entry.dailyTrend?.isUptrend === true,
  },
  downtrend: {
    label: 'Downtrend',
    word: 'downtrend',
    Icon: TrendingDownRoundedIcon,
    title: 'Price below the daily 10 SMA and 20 SMA',
    matches: (entry) => entry.dailyTrend?.isDowntrend === true,
  },
};

const useStoredChoice = (storageKey, choices) => {
  const [value, setValue] = useState(() => {
    const stored = window.localStorage.getItem(storageKey);
    return choices[stored] ? stored : 'all';
  });
  const update = (next) => {
    window.localStorage.setItem(storageKey, next);
    setValue(next);
  };
  return [value, update];
};

const hasHighlight = (id) => (entry) => entry.highlights?.some((highlight) => highlight.id === id);

// On/off filters next to the search. When several are on, a stock must match all of them.
const toggleFilters = [
  {
    key: 'trendingVolume',
    label: 'Trending volume',
    Icon: BarChartRoundedIcon,
    title: 'Show only stocks with the Trending volume badge: pre-market volume well above an average morning up to the same time',
    matches: hasHighlight('trending-volume'),
    tone: 'volume',
  },
  {
    key: 'maReclaimed',
    label: 'MA reclaimed',
    Icon: AutoGraphRoundedIcon,
    title: 'Show only stocks with the MA reclaimed badge: yesterday opened below the hourly 200 SMA; today it opens above it',
    matches: hasHighlight('ma-reclaimed'),
    tone: 'highlight',
  },
  {
    key: 'aboveBollinger',
    label: 'Above upper BB',
    Icon: OpenInFullRoundedIcon,
    title:
      'Show only stocks above the daily upper Bollinger band (the open, after the bell). They stay on the board even when they fail the 20 SMA rules, and the market watch alerts when they come back down to the band',
    matches: hasHighlight('above-bollinger'),
    tone: 'bollinger',
  },
];

const TOGGLES_STORAGE_KEY = 'race.toggleFilters';

const useToggleFilters = () => {
  const [value, setValue] = useState(() => {
    try {
      return JSON.parse(window.localStorage.getItem(TOGGLES_STORAGE_KEY)) || {};
    } catch {
      return {};
    }
  });
  const save = (next) => {
    window.localStorage.setItem(TOGGLES_STORAGE_KEY, JSON.stringify(next));
    setValue(next);
  };
  const toggle = (key) => save({ ...value, [key]: !value[key] });
  const clear = () => save({});
  return [value, toggle, clear];
};

const ToggleFilters = ({ standings, value, onToggle }) =>
  toggleFilters.map(({ key, label, Icon, title, matches, tone }) => (
    <button
      key={key}
      type="button"
      className={tone ? `toggle-button toggle-button--${tone}` : 'toggle-button'}
      aria-pressed={!!value[key]}
      onClick={() => onToggle(key)}
      title={title}
    >
      <Icon fontSize="small" />
      {label}
      <span className="segmented__count">
        {standings.filter(matches).length} of {standings.length}
      </span>
    </button>
  ));

const Segmented = ({ label, options, standings, value, onChange }) => (
  <div className="segmented" role="group" aria-label={label}>
    {Object.entries(options).map(([key, option]) => (
      <button
        key={key}
        type="button"
        className={`segmented__option segmented__option--${key}`}
        aria-pressed={value === key}
        onClick={() => onChange(key)}
        title={option.title}
      >
        {option.Icon && <option.Icon fontSize="small" />}
        {option.label}
        <span className="segmented__count">{standings.filter(option.matches).length}</span>
      </button>
    ))}
  </div>
);

const PhaseBanner = ({ race }) => {
  if (race.phase === 'decision') {
    const candlesLeft = Math.max(0, race.totalLaps - race.lap);
    return (
      <div className="banner banner--decision" role="status">
        <NotificationsActiveOutlinedIcon fontSize="small" />
        <span>
          <strong>Decision window.</strong>{' '}
          {candlesLeft === 0 ? 'This is the last candle before the bell.' : `${candlesLeft} ${candlesLeft === 1 ? 'candle' : 'candles'} left before the bell.`}{' '}
          {race.candleForming ? 'The board updates while the candle forms — watch for late movers.' : 'Choose from the top of the board.'}
        </span>
      </div>
    );
  }
  if (race.phase === 'final') {
    return (
      <div className="banner banner--final" role="status">
        <FlagOutlinedIcon fontSize="small" />
        <span>
          <strong>The bell has rung.</strong> These are the final standings, judged on the open. Stocks that opened below yesterday's high are out, unless they opened within noise of it ("Near high") or reclaimed the hourly 200 SMA ("Opened below high"). Stocks that opened above the daily upper Bollinger band stay whatever the rules say. During the session the market watch alerts on the Alerts tab.
        </span>
      </div>
    );
  }
  return null;
};

const EmptyState = ({ icon, title, children }) => (
  <div className="empty">
    <div className="empty__icon">{icon}</div>
    <h2 className="empty__title">{title}</h2>
    <p className="empty__text">{children}</p>
  </div>
);

const ruleKinds = [
  { kind: 'keep', title: 'Always on the board' },
  { kind: 'elimination', title: 'Out for the day' },
  { kind: 'qualification', title: 'To be in the race' },
  { kind: 'scoring', title: 'Score (0–100) = 100 × each factor below, multiplied' },
  { kind: 'warning', title: 'Warnings' },
  { kind: 'highlight', title: 'Highlights' },
  { kind: 'watch', title: 'Market watch (during the session)' },
];

const RuleBook = ({ ruleBook = [] }) => (
  <details className="rule-book">
    <summary>How the race is ranked</summary>
    <div className="rule-book__groups">
      {ruleKinds.map(({ kind, title }) => (
        <section key={kind} className="rule-book__group">
          <h3>{title}</h3>
          <dl>
            {ruleBook
              .filter((rule) => rule.kind === kind)
              .map((rule) => (
                <div key={rule.title} className="rule-book__rule">
                  <dt>{rule.title}</dt>
                  <dd>{rule.description}</dd>
                </div>
              ))}
          </dl>
        </section>
      ))}
    </div>
  </details>
);

const Board = ({ race, connection }) => {
  if (!race) {
    return connection === 'offline' ? (
      <EmptyState icon={<CloudOffOutlinedIcon />} title="Can't reach the race engine">
        Start the engine (live server or <code>npx ts-node scripts/mock-run.ts</code>). This page reconnects on its own.
      </EmptyState>
    ) : (
      <EmptyState icon={<HourglassEmptyOutlinedIcon />} title="Loading the watchlist">
        The engine is pulling history for every stock. The board fills in once the first stocks are ready.
      </EmptyState>
    );
  }

  if (race.phase === 'waiting') {
    return (
      <EmptyState icon={<HourglassEmptyOutlinedIcon />} title="Waiting for the first pre-market candle">
        The race starts at {race.rules.premarketStart} New York. Standings appear after the first 5-minute candle closes.
      </EmptyState>
    );
  }

  return <Standings race={race} />;
};

// Dismissed stocks leave the user's race, so the rest move up; previous ranks shift the same way to keep movement arrows honest.
const rerankWithoutDismissed = (standings, dismissed) => {
  const dismissedPreviousRanks = standings
    .filter((entry) => dismissed.includes(entry.quote) && entry.previousRank !== null)
    .map((entry) => entry.previousRank);

  return standings
    .filter((entry) => !dismissed.includes(entry.quote))
    .map((entry, index) => ({
      ...entry,
      rank: index + 1,
      previousRank:
        entry.previousRank === null ? null : entry.previousRank - dismissedPreviousRanks.filter((rank) => rank < entry.previousRank).length,
    }));
};

const TableSearch = ({ value, onChange }) => (
  <label className="search search--toolbar">
    <SearchIcon fontSize="small" className="search__icon" />
    <input
      type="search"
      className="search__input"
      placeholder="Search ticker"
      aria-label="Search standings"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onKeyDown={(event) => event.key === 'Escape' && onChange('')}
    />
  </label>
);

const Standings = ({ race }) => {
  const { watched, toggleWatch, addWatch } = useWatchlist();
  const [holdFilter, setHoldFilter] = useStoredChoice('race.holdFilter', holdFilters);
  const [trendFilter, setTrendFilter] = useStoredChoice('race.trendFilter', trendFilters);
  const [toggles, toggleFilter, clearToggles] = useToggleFilters();
  const [search, setSearch] = useState('');
  const { dismissed, dismiss, restore, restoreAll } = useDismissed(race.tradeDate);
  const activeStandings = rerankWithoutDismissed(race.standings, dismissed);
  const activeToggles = toggleFilters.filter((filter) => toggles[filter.key]);
  const toggledStandings = activeStandings.filter((entry) => activeToggles.every((filter) => filter.matches(entry)));
  const visibleStandings = toggledStandings.filter(
    (entry) => trendFilters[trendFilter].matches(entry) && holdFilters[holdFilter].matches(entry)
  );
  const segmentWords = [holdFilters[holdFilter].word, trendFilters[trendFilter].word].filter(Boolean).join(' ');
  const showAllSegments = () => {
    setHoldFilter('all');
    setTrendFilter('all');
  };
  const query = search.trim().toUpperCase();
  const tableStandings = query ? visibleStandings.filter((entry) => entry.quote.includes(query)) : visibleStandings;
  let emptyState = null;
  if (activeStandings.length === 0) {
    emptyState = (
      <EmptyState icon={<HourglassEmptyOutlinedIcon />} title="No stock qualifies right now">
        {race.standings.length > 0
          ? 'You dismissed every stock still in the race. Return one from the Dismissed list on the right.'
          : "Every stock is below yesterday's close, too thin, or out. The lists on the right show why."}
      </EmptyState>
    );
  } else if (toggledStandings.length === 0) {
    emptyState = (
      <EmptyState icon={<FilterListOffOutlinedIcon />} title={`No stock matches ${activeToggles.map((filter) => filter.label).join(' + ')}`}>
        None of the {activeStandings.length} stocks in the race {activeToggles.length > 1 ? 'matches all of them' : 'matches'}.{' '}
        <button type="button" className="link-button" onClick={clearToggles}>
          Turn off {activeToggles.length > 1 ? 'these filters' : activeToggles[0].label}
        </button>
      </EmptyState>
    );
  } else if (visibleStandings.length === 0) {
    emptyState = (
      <EmptyState icon={<FilterListOffOutlinedIcon />} title={`No ${segmentWords} stocks right now`}>
        {toggledStandings.length} {toggledStandings.length === 1 ? 'stock is' : 'stocks are'} in the race under the other filters.{' '}
        <button type="button" className="link-button" onClick={showAllSegments}>
          Show all
        </button>
      </EmptyState>
    );
  } else if (tableStandings.length === 0) {
    emptyState = (
      <EmptyState icon={<SearchOffOutlinedIcon />} title={`No ticker matches “${search.trim()}”`}>
        It may be dismissed, out, or not qualifying — check the lists on the right.{' '}
        <button type="button" className="link-button" onClick={() => setSearch('')}>
          Clear search
        </button>
      </EmptyState>
    );
  }

  return (
    <div className="board">
      <section className="board__main">
        <div className="toolbar">
          <h2 className="toolbar__title">
            Standings{' '}
            <span className="panel__count">
              {tableStandings.length === activeStandings.length ? activeStandings.length : `${tableStandings.length} of ${activeStandings.length}`}
            </span>
          </h2>
          <div className="toolbar__controls">
            <TableSearch value={search} onChange={setSearch} />
            <ToggleFilters standings={activeStandings} value={toggles} onToggle={toggleFilter} />
            <Segmented
              label="Filter by daily trend"
              options={trendFilters}
              standings={toggledStandings}
              value={trendFilter}
              onChange={setTrendFilter}
            />
            <Segmented
              label="Filter by how the stock held the 20 SMA"
              options={holdFilters}
              standings={toggledStandings}
              value={holdFilter}
              onChange={setHoldFilter}
            />
          </div>
        </div>
        {emptyState || <TimingTower standings={tableStandings} onDismiss={dismiss} watched={watched} onToggleWatch={toggleWatch} />}
        <RuleBook ruleBook={race.ruleBook} />
      </section>
      <SidePanel
        race={race}
        standings={visibleStandings}
        podiumTitle={segmentWords ? `Top 3 ${segmentWords}` : 'Top 3'}
        dismissed={dismissed}
        onRestore={restore}
        onRestoreAll={restoreAll}
        watched={watched}
        onToggleWatch={toggleWatch}
        onAddWatch={addWatch}
      />
    </div>
  );
};

const TAB_KEY = 'race.tab';

const Tabs = ({ tab, onChange, unreadCount, buySetups }) => (
  <nav className="tabs" role="tablist" aria-label="Board views">
    <button type="button" role="tab" className="tab" aria-selected={tab === 'race'} onClick={() => onChange('race')}>
      Race
    </button>
    <button type="button" role="tab" className="tab" aria-selected={tab === 'alerts'} onClick={() => onChange('alerts')}>
      Alerts
      {buySetups > 0 && <span className="tab__count tab__count--opportunity" title="Buy setups today">{buySetups}</span>}
      {unreadCount > 0 && <span className="tab__count" title="Unread alerts">{unreadCount}</span>}
    </button>
  </nav>
);

const RaceScreen = () => {
  const { race, connection, replayPaused, setReplayPaused } = useRace();
  const marketWatch = useMarketWatch();
  const [tab, setTab] = useState(() => window.localStorage.getItem(TAB_KEY) || 'race');
  const changeTab = (next) => {
    window.localStorage.setItem(TAB_KEY, next);
    setTab(next);
  };
  const buySetups = marketWatch.activeAlerts.filter((alert) => alert.tone === 'opportunity').length;

  return (
    <div className="race-app">
      <RaceHeader race={race} connection={connection} replayPaused={replayPaused} onReplayPaused={setReplayPaused} />
      <AlertToasts toasts={marketWatch.toasts} onClose={marketWatch.dismissToast} onOpen={() => changeTab('alerts')} />
      {race && <PhaseBanner race={race} />}
      {race && connection === 'offline' && (
        <div className="banner banner--offline" role="alert">
          <CloudOffOutlinedIcon fontSize="small" />
          <span>Lost connection to the engine. Showing the last standings received; reconnecting…</span>
        </div>
      )}
      <main className="race-main">
        <Tabs tab={tab} onChange={changeTab} unreadCount={marketWatch.unreadCount} buySetups={buySetups} />
        {tab === 'alerts' ? <AlertsTab marketWatch={marketWatch} /> : <Board race={race} connection={connection} />}
      </main>
    </div>
  );
};

export default RaceScreen;
