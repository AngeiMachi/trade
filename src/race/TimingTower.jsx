import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import ArrowUpwardRoundedIcon from '@mui/icons-material/ArrowUpwardRounded';
import ArrowDownwardRoundedIcon from '@mui/icons-material/ArrowDownwardRounded';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import StarBorderRoundedIcon from '@mui/icons-material/StarBorderRounded';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CloseIcon from '@mui/icons-material/Close';
import VisibilityRoundedIcon from '@mui/icons-material/VisibilityRounded';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import AutoGraphRoundedIcon from '@mui/icons-material/AutoGraphRounded';
import BarChartRoundedIcon from '@mui/icons-material/BarChartRounded';
import OpenInFullRoundedIcon from '@mui/icons-material/OpenInFullRounded';
import VerticalAlignTopRoundedIcon from '@mui/icons-material/VerticalAlignTopRounded';
import SouthRoundedIcon from '@mui/icons-material/SouthRounded';
import CheckCircleRoundedIcon from '@mui/icons-material/CheckCircleRounded';
import AdjustRoundedIcon from '@mui/icons-material/AdjustRounded';
import VerticalAlignBottomRoundedIcon from '@mui/icons-material/VerticalAlignBottomRounded';
import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import TrendingDownRoundedIcon from '@mui/icons-material/TrendingDownRounded';
import KeyboardDoubleArrowUpRoundedIcon from '@mui/icons-material/KeyboardDoubleArrowUpRounded';
import Badge from './Badge';
import { formatDollars, formatPct, formatPrice } from './format';

const PODIUM_SIZE = 3;
const CUSHION_SCALE_PCT = 3;

const Movement = ({ rank, previousRank }) => {
  if (previousRank === null || previousRank === undefined) {
    return <span className="move move--new">New</span>;
  }
  const gained = previousRank - rank;
  if (gained > 0) {
    return (
      <span className="move move--up" aria-label={`Up ${gained}`}>
        <ArrowDropUpIcon fontSize="small" />
        {gained}
      </span>
    );
  }
  if (gained < 0) {
    return (
      <span className="move move--down" aria-label={`Down ${-gained}`}>
        <ArrowDropDownIcon fontSize="small" />
        {-gained}
      </span>
    );
  }
  return <span className="move move--same">–</span>;
};

const HoldTag = ({ touches }) =>
  touches === 0 ? (
    <Badge id="clean" label="Clean" Icon={CheckCircleRoundedIcon} />
  ) : (
    <Badge
      id="touched"
      label={`Touched ${touches}×`}
      Icon={AdjustRoundedIcon}
      detail={`${touches} pre-market hourly ${touches === 1 ? 'candle' : 'candles'} wicked below the 20 SMA and closed back above it.`}
    />
  );

export const SmaTag = ({ entry }) => {
  if (entry.status !== 'at-risk') {
    return <HoldTag touches={entry.smaTouches} />;
  }
  const warning = entry.warnings?.find((item) => item.id === 'trading-through-sma');
  return <Badge id="trading-through-sma" label={warning?.label || 'Under 20 SMA'} detail={warning?.message} Icon={VerticalAlignBottomRoundedIcon} />;
};

const TREND_BADGES = [
  { id: 'strong-uptrend', label: 'Strong uptrend', Icon: KeyboardDoubleArrowUpRoundedIcon, matches: (trend) => trend.isStrongUptrend },
  { id: 'uptrend', label: 'Uptrend', Icon: TrendingUpRoundedIcon, matches: (trend) => trend.isUptrend },
  { id: 'downtrend', label: 'Downtrend', Icon: TrendingDownRoundedIcon, matches: (trend) => trend.isDowntrend },
];

export const TrendTag = ({ trend }) => {
  const badge = trend && TREND_BADGES.find((item) => item.matches(trend));
  if (!badge) {
    return null;
  }
  return (
    <Badge
      id={badge.id}
      label={badge.label}
      Icon={badge.Icon}
      detail={`Daily 10 SMA ${formatPrice(trend.fastSma)} · daily 20 SMA ${formatPrice(trend.slowSma)}`}
    />
  );
};

const GapBar = ({ gapPct, maxGap, status }) => (
  <div className="gap">
    <div className="gap__track">
      <div className={`gap__bar gap__bar--${status}`} style={{ transform: `scaleX(${Math.max(0.02, gapPct / maxGap)})` }} />
    </div>
    <span className="gap__value">{formatPct(gapPct)}</span>
  </div>
);

const stretchWarning = (entry) => entry.warnings?.find((warning) => warning.id === 'stretched-from-sma');

const WARNING_ICONS = { 'near-previous-extreme': VerticalAlignTopRoundedIcon, 'below-previous-extreme': SouthRoundedIcon };

const WarningTag = ({ warning }) => (
  <Badge
    id={warning.id}
    label={warning.label}
    detail={warning.message}
    level={warning.level}
    Icon={WARNING_ICONS[warning.id] || WarningAmberRoundedIcon}
  />
);

const HIGHLIGHT_ICONS = { 'trending-volume': BarChartRoundedIcon, 'above-bollinger': OpenInFullRoundedIcon };

export const HighlightTags = ({ highlights = [] }) =>
  highlights.map((highlight) => (
    <Badge
      key={highlight.id}
      id={highlight.id}
      label={highlight.label}
      detail={highlight.message}
      Icon={HIGHLIGHT_ICONS[highlight.id] || AutoGraphRoundedIcon}
    />
  ));

const RelativeVolume = ({ entry }) => {
  if (entry.relativeVolume === null || entry.relativeVolume === undefined) {
    return <span className="muted">–</span>;
  }
  const trending = entry.highlights?.find((highlight) => highlight.id === 'trending-volume');
  return (
    <span className={trending ? 'rvol rvol--trending' : 'rvol'} title={trending?.message || 'Pre-market volume so far vs an average morning up to the same time'}>
      {entry.relativeVolume.toFixed(1)}×
    </span>
  );
};

const WarningTags = ({ warnings = [] }) =>
  warnings.filter((warning) => warning.id !== 'trading-through-sma').map((warning) => <WarningTag key={warning.id} warning={warning} />);

export const scoreExplanation = (entry) =>
  entry.scoreBreakdown?.length
    ? [
        ...entry.scoreBreakdown.map((line) => `${line.rule}  ×${line.factor.toFixed(2)}  (${line.note})`),
        `Score = 100 × ${entry.scoreBreakdown.map((line) => line.factor.toFixed(2)).join(' × ')} = ${Math.round(entry.score)}`,
      ].join('\n')
    : undefined;

const Cushion = ({ cushionPct, stretchAtr, status, warning }) => (
  <div
    className={`cushion ${warning ? `cushion--${warning.level}` : ''}`}
    title={warning ? warning.message : stretchAtr === null ? undefined : `${stretchAtr.toFixed(2)} daily ATRs from the 20 SMA`}
  >
    <span className={`cushion__value cushion__value--${status}`}>{formatPct(cushionPct)}</span>
    {warning ? (
      <span className="cushion__atr">{stretchAtr.toFixed(1)} ATR</span>
    ) : (
      <div className="cushion__meter" aria-hidden="true">
        <div className="cushion__fill" style={{ transform: `scaleX(${Math.min(1, Math.max(0, cushionPct / CUSHION_SCALE_PCT))})` }} />
      </div>
    )}
  </div>
);

const useFlipAnimation = (rowsRef, standings) => {
  const positions = useRef(new Map());

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nextPositions = new Map();

    rowsRef.current.forEach((row, quote) => {
      if (!row) {
        return;
      }
      const top = row.offsetTop;
      const previousTop = positions.current.get(quote);
      nextPositions.set(quote, top);

      if (reduceMotion) {
        return;
      }
      if (previousTop === undefined) {
        row.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 300, easing: 'ease-out' });
      } else if (previousTop !== top) {
        row.animate([{ transform: `translateY(${previousTop - top}px)` }, { transform: 'translateY(0)' }], {
          duration: 550,
          easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
        });
        if (previousTop > top) {
          row.animate([{ backgroundColor: 'var(--pace-wash)' }, { backgroundColor: 'transparent' }], { duration: 1600, easing: 'ease-out' });
        }
      }
    });

    positions.current = nextPositions;
  }, [rowsRef, standings]);
};

// Sortable columns, in table order. `firstDirection` is the order a first click gives.
const columns = [
  { key: 'rank', label: 'Pos', value: (entry) => entry.rank, firstDirection: 'asc' },
  {
    key: 'movement',
    label: '±',
    title: 'Places gained since the previous candle',
    value: (entry) => (entry.previousRank === null || entry.previousRank === undefined ? null : entry.previousRank - entry.rank),
  },
  { key: 'quote', label: 'Ticker', value: (entry) => entry.quote, firstDirection: 'asc' },
  { key: 'gapPct', label: "Gap from yesterday's close", value: (entry) => entry.gapPct },
  { key: 'price', label: 'Last', title: 'Latest pre-market price; after the bell, the opening price', value: (entry) => entry.price, numeric: true },
  { key: 'score', label: 'Score', value: (entry) => entry.score, numeric: true },
  { key: 'sma', label: '20 SMA 1h', value: (entry) => entry.sma, numeric: true },
  { key: 'smaCushionPct', label: 'Above 20 SMA', value: (entry) => entry.smaCushionPct },
  { key: 'premarketDollarVolume', label: 'Pre-mkt $ vol', value: (entry) => entry.premarketDollarVolume, numeric: true },
  {
    key: 'relativeVolume',
    label: 'RVOL',
    title: 'Relative volume: pre-market volume so far vs an average morning up to the same time',
    value: (entry) => entry.relativeVolume,
    numeric: true,
  },
  { key: 'lapsInTopThree', label: 'Top-3 laps', value: (entry) => entry.lapsInTopThree, numeric: true },
];

const FAVORITES_STORAGE_KEY = 'race.favorites';
// Long enough for one trading day (pre-market to the close), short enough to be gone by the next morning.
const FAVORITE_LIFETIME_MS = 13 * 60 * 60 * 1000;

const readFavorites = () => {
  try {
    const stored = JSON.parse(window.localStorage.getItem(FAVORITES_STORAGE_KEY));
    const starredAt = stored && !Array.isArray(stored) ? stored : {};
    return Object.fromEntries(Object.entries(starredAt).filter(([, time]) => Date.now() - time < FAVORITE_LIFETIME_MS));
  } catch {
    return {};
  }
};

// Starred stocks are pinned to the top of the table for the day. The side panel ignores them.
const useFavorites = () => {
  const [starredAt, setStarredAt] = useState(readFavorites);
  const favorites = Object.keys(starredAt);
  useEffect(() => {
    const timer = setInterval(() => setStarredAt(readFavorites()), 60 * 1000);
    return () => clearInterval(timer);
  }, []);
  const toggle = (quote) => {
    const { [quote]: removed, ...rest } = readFavorites();
    const next = removed ? rest : { ...rest, [quote]: Date.now() };
    window.localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(next));
    setStarredAt(next);
  };
  return [favorites, toggle];
};

const DEFAULT_SORT = { key: 'rank', direction: 'asc' };
const SORT_STORAGE_KEY = 'race.tableSort';

const useTableSort = () => {
  const [sort, setSort] = useState(() => {
    try {
      const stored = JSON.parse(window.localStorage.getItem(SORT_STORAGE_KEY));
      return columns.some((column) => column.key === stored?.key) ? stored : DEFAULT_SORT;
    } catch {
      return DEFAULT_SORT;
    }
  });
  const sortBy = (column) => {
    const direction = sort.key === column.key ? (sort.direction === 'asc' ? 'desc' : 'asc') : column.firstDirection || 'desc';
    const next = { key: column.key, direction };
    window.localStorage.setItem(SORT_STORAGE_KEY, JSON.stringify(next));
    setSort(next);
  };
  return [sort, sortBy];
};

// Missing values always go last, whichever the direction.
const sortStandings = (standings, sort) => {
  const column = columns.find((candidate) => candidate.key === sort.key);
  const sign = sort.direction === 'asc' ? 1 : -1;
  return [...standings].sort((a, b) => {
    const left = column.value(a);
    const right = column.value(b);
    if (left === null || left === undefined) return right === null || right === undefined ? a.rank - b.rank : 1;
    if (right === null || right === undefined) return -1;
    const compared = typeof left === 'string' ? left.localeCompare(right) : left - right;
    return compared === 0 ? a.rank - b.rank : sign * compared;
  });
};

const SortHeader = ({ column, sort, onSort }) => {
  const active = sort.key === column.key;
  const Arrow = sort.direction === 'asc' ? ArrowUpwardRoundedIcon : ArrowDownwardRoundedIcon;
  return (
    <span role="columnheader" className={column.numeric ? 'num' : undefined} aria-sort={active ? (sort.direction === 'asc' ? 'ascending' : 'descending') : 'none'}>
      <button type="button" className={active ? 'sort-button sort-button--active' : 'sort-button'} onClick={() => onSort(column)} title={column.title}>
        {column.label}
        {active && <Arrow fontSize="inherit" />}
      </button>
    </span>
  );
};

export const WatchButton = ({ quote, watched, onToggle }) => (
  <button
    type="button"
    className="icon-button watch-button"
    aria-pressed={watched}
    aria-label={`${watched ? 'Stop watching' : 'Watch'} ${quote}`}
    title={watched ? 'Stop watching' : 'Keep an eye on it: shows below the top 3 every day until you stop watching'}
    onClick={() => onToggle(quote)}
  >
    {watched ? <VisibilityRoundedIcon fontSize="small" /> : <VisibilityOutlinedIcon fontSize="small" />}
  </button>
);

export const WatchTag = () => <Badge id="watch" label="Watch" Icon={VisibilityRoundedIcon} />;

const TimingTower = ({ standings, onDismiss, watched, onToggleWatch }) => {
  const rowsRef = useRef(new Map());
  const [sort, sortBy] = useTableSort();
  const [favorites, toggleFavorite] = useFavorites();
  const sorted = sortStandings(standings, sort);
  const pinned = sorted.filter((entry) => favorites.includes(entry.quote));
  const sortedStandings = [...pinned, ...sorted.filter((entry) => !favorites.includes(entry.quote))];
  const isRankOrder = sort.key === 'rank' && sort.direction === 'asc';
  useFlipAnimation(rowsRef, sortedStandings);

  const maxGap = Math.max(...standings.map((entry) => entry.gapPct), 0.01);

  return (
    <div className="tower" role="table" aria-label="Pre-market standings">
      <div className="tower__row tower__row--head" role="row">
        <span role="columnheader" className="favorite-head" title="Starred stocks stay pinned at the top of the table">
          <StarRoundedIcon fontSize="inherit" />
          <span className="sr-only">Favorite</span>
        </span>
        <span role="columnheader" className="favorite-head" title="Watched stocks are saved on the server and show below the top 3 every day">
          <VisibilityRoundedIcon fontSize="inherit" />
          <span className="sr-only">Watch</span>
        </span>
        {columns.map((column) => (
          <SortHeader key={column.key} column={column} sort={sort} onSort={sortBy} />
        ))}
        <span role="columnheader">
          <span className="sr-only">Dismiss</span>
        </span>
      </div>

      {sortedStandings.map((entry, index) => (
        <div
          key={entry.quote}
          ref={(row) => rowsRef.current.set(entry.quote, row)}
          role="row"
          className={[
            'tower__row',
            entry.rank <= PODIUM_SIZE ? `tower__row--podium tower__row--p${entry.rank}` : '',
            isRankOrder && pinned.length === 0 && index === PODIUM_SIZE - 1 && standings.length > PODIUM_SIZE ? 'tower__row--cut' : '',
            index === pinned.length - 1 && sortedStandings.length > pinned.length ? 'tower__row--cut' : '',
            favorites.includes(entry.quote) ? 'tower__row--pinned' : '',
            entry.status === 'at-risk' ? 'tower__row--at-risk' : '',
            stretchWarning(entry)?.level === 'alert' ? 'tower__row--alert' : '',
          ].join(' ')}
          title={entry.reason || undefined}
        >
          <span role="cell">
            <button
              type="button"
              className="icon-button favorite-button"
              aria-pressed={favorites.includes(entry.quote)}
              aria-label={`${favorites.includes(entry.quote) ? 'Unpin' : 'Pin'} ${entry.quote}`}
              title={favorites.includes(entry.quote) ? 'Unpin from the top' : 'Pin to the top of the table'}
              onClick={() => toggleFavorite(entry.quote)}
            >
              {favorites.includes(entry.quote) ? <StarRoundedIcon fontSize="small" /> : <StarBorderRoundedIcon fontSize="small" />}
            </button>
          </span>
          <span role="cell">
            <WatchButton quote={entry.quote} watched={watched.includes(entry.quote)} onToggle={onToggleWatch} />
          </span>
          <span role="cell" className="pos">
            {entry.rank}
          </span>
          <span role="cell">
            <Movement rank={entry.rank} previousRank={entry.previousRank} />
          </span>
          <span role="cell" className="ticker">
            {entry.quote}
            {watched.includes(entry.quote) && <WatchTag />}
            <TrendTag trend={entry.dailyTrend} />
            <SmaTag entry={entry} />
            <HighlightTags highlights={entry.highlights} />
            <WarningTags warnings={entry.warnings} />
          </span>
          <span role="cell">
            <GapBar gapPct={entry.gapPct} maxGap={maxGap} status={entry.status} />
          </span>
          <span role="cell" className="num">
            {formatPrice(entry.price)}
          </span>
          <span role="cell" className="num">
            <span className="score" title={scoreExplanation(entry)}>
              {entry.score === null ? '–' : Math.round(entry.score)}
            </span>
          </span>
          <span role="cell" className="num muted">
            {formatPrice(entry.sma)}
          </span>
          <span role="cell">
            <Cushion cushionPct={entry.smaCushionPct} stretchAtr={entry.smaStretchAtr} status={entry.status} warning={stretchWarning(entry)} />
          </span>
          <span role="cell" className="num">
            {formatDollars(entry.premarketDollarVolume)}
          </span>
          <span role="cell" className="num">
            <RelativeVolume entry={entry} />
          </span>
          <span role="cell" className="num muted">
            {entry.lapsInTopThree || '–'}
          </span>
          <span role="cell">
            <button
              type="button"
              className="icon-button dismiss-button"
              aria-label={`Dismiss ${entry.quote} for today`}
              title="Dismiss for today"
              onClick={() => onDismiss(entry.quote)}
            >
              <CloseIcon fontSize="small" />
            </button>
          </span>
        </div>
      ))}
    </div>
  );
};

export default TimingTower;
