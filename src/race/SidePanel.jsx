import { useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import UndoIcon from '@mui/icons-material/Undo';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import CloseIcon from '@mui/icons-material/Close';
import { formatDollars, formatPct, formatPrice } from './format';
import { SmaTag, TrendTag, scoreExplanation, WatchButton } from './TimingTower';

const placeName = { 1: 'First', 2: 'Second', 3: 'Third' };

const Podium = ({ standings, phase, title }) => {
  const podium = standings.slice(0, 3);
  return (
    <section className="panel">
      <h2 className="panel__title">{phase === 'final' ? `Final ${title.toLowerCase()}` : `${title} right now`}</h2>
      {podium.length === 0 ? (
        <p className="panel__empty">Nobody qualifies yet.</p>
      ) : (
        <ol className="podium">
          {podium.map((entry) => (
            <li key={entry.quote} className={`podium__item podium__item--p${entry.rank}`}>
              <span className="podium__pos" aria-label={placeName[entry.rank] || `Position ${entry.rank}`}>
                {entry.rank}
              </span>
              <div className="podium__body">
                <div className="podium__line">
                  <span className="podium__ticker">{entry.quote}</span>
                  <span className="podium__gap">{formatPct(entry.gapPct)}</span>
                </div>
                <div className="podium__tags">
                  <TrendTag trend={entry.dailyTrend} />
                  <SmaTag entry={entry} />
                </div>
                <div className="podium__facts">
                  <span title={scoreExplanation(entry)}>Score {Math.round(entry.score)}</span>
                  <span>{formatPct(entry.smaCushionPct)} over the 20 SMA</span>
                  <span>{formatDollars(entry.premarketDollarVolume)} traded</span>
                  <span>
                    {entry.lapsInTopThree} {entry.lapsInTopThree === 1 ? 'lap' : 'laps'} in top 3
                  </span>
                </div>
                {entry.warnings?.map((warning) => (
                  <p key={warning.id} className={`podium__warning podium__warning--${warning.level}`}>
                    {warning.message}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
};

const EntryList = ({ title, entries, emptyText, renderDetail, variant, watched, onToggleWatch }) => {
  const [search, setSearch] = useState('');
  const query = search.trim().toUpperCase();
  const visibleEntries = query ? entries.filter((entry) => entry.quote.includes(query)) : entries;

  return (
    <section className="panel panel--list">
      <h2 className="panel__title">
        {title} <span className="panel__count">{query ? `${visibleEntries.length} of ${entries.length}` : entries.length}</span>
      </h2>
      {entries.length > 0 && (
        <label className="search">
          <SearchIcon fontSize="small" className="search__icon" />
          <input
            type="search"
            className="search__input"
            placeholder="Search ticker"
            aria-label={`Search ${title.toLowerCase()}`}
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            onKeyDown={(event) => event.key === 'Escape' && setSearch('')}
          />
        </label>
      )}
      {entries.length === 0 ? (
        <p className="panel__empty">{emptyText}</p>
      ) : visibleEntries.length === 0 ? (
        <p className="panel__empty">No ticker matches “{search.trim()}”.</p>
      ) : (
        <ul className="entry-list">
          {visibleEntries.map((entry) => (
            <li key={entry.quote} className={`entry entry--${variant}`}>
              <span className="entry__ticker">{entry.quote}</span>
              <span className="entry__reason">{entry.reason}</span>
              <span className="entry__detail">{renderDetail(entry)}</span>
              <WatchButton quote={entry.quote} watched={watched.includes(entry.quote)} onToggle={onToggleWatch} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
};

const statusLabel = {
  racing: 'In the race',
  'at-risk': 'In the race, under the SMA',
  waiting: 'Not qualifying',
  out: 'Out',
};

const DismissedList = ({ race, dismissed, onRestore, onRestoreAll }) => {
  const entriesByQuote = Object.fromEntries([...race.standings, ...race.waiting, ...race.out].map((entry) => [entry.quote, entry]));

  return (
    <section className="panel">
      <h2 className="panel__title">
        Dismissed by you <span className="panel__count">{dismissed.length}</span>
        {dismissed.length > 1 && (
          <button type="button" className="link-button panel__action" onClick={onRestoreAll}>
            Return all
          </button>
        )}
      </h2>
      {dismissed.length === 0 ? (
        <p className="panel__empty">Use the × on a row to set a stock aside for today.</p>
      ) : (
        <ul className="entry-list">
          {dismissed.map((quote) => {
            const entry = entriesByQuote[quote];
            return (
              <li key={quote} className="entry entry--dismissed">
                <span className="entry__ticker">{quote}</span>
                <span className="entry__reason">
                  {entry ? statusLabel[entry.status] : 'No data'}
                  {entry?.gapPct !== null && entry?.gapPct !== undefined && ` · ${formatPct(entry.gapPct)}`}
                </span>
                <button type="button" className="return-button" onClick={() => onRestore(quote)} aria-label={`Return ${quote} to the race`}>
                  <UndoIcon fontSize="inherit" />
                  Return
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

const watchStatus = (entry) => {
  if (entry.status === 'racing' || entry.status === 'at-risk') {
    return `#${entry.rank} in the race${entry.status === 'at-risk' ? ', under the SMA' : ''}`;
  }
  if (entry.status === 'out') return `Out · ${entry.reason}`;
  if (entry.status === 'waiting') return `Not qualifying · ${entry.reason}`;
  if (entry.status === 'loading') return 'Loading…';
  return entry.reason;
};

const AddWatch = ({ onAdd }) => {
  const [symbol, setSymbol] = useState('');
  const [error, setError] = useState(null);

  const submit = async (event) => {
    event.preventDefault();
    if (!symbol.trim()) return;
    const message = await onAdd(symbol.trim().toUpperCase());
    setError(message);
    if (!message) setSymbol('');
  };

  return (
    <form className="watch-add" onSubmit={submit}>
      <input
        className="search__input watch-add__input"
        placeholder="Add a symbol, e.g. MRNA"
        aria-label="Symbol to watch"
        value={symbol}
        onChange={(event) => {
          setSymbol(event.target.value);
          setError(null);
        }}
      />
      <button type="submit" className="return-button" disabled={!symbol.trim()}>
        <AddRoundedIcon fontSize="inherit" />
        Watch
      </button>
      {error && <p className="watch-add__error">{error}</p>}
    </form>
  );
};

// Watched stocks show here whatever the rules say: in the race, out, not qualifying, or never taken into the race.
const WatchList = ({ race, watched, onRemove, onAdd }) => {
  const entriesByQuote = Object.fromEntries((race.watched || []).map((entry) => [entry.quote, entry]));
  return (
    <section className="panel panel--watch">
      <h2 className="panel__title">
        Watching <span className="panel__count">{watched.length}</span>
      </h2>
      <AddWatch onAdd={onAdd} />
      {watched.length === 0 ? (
        <p className="panel__empty">Type a symbol or use the eye on any row. Watched stocks stay here every day.</p>
      ) : (
        <ul className="entry-list">
          {watched.map((quote) => {
            const entry = entriesByQuote[quote] || { quote, status: 'loading', gapPct: null, price: null };
            return (
              <li key={quote} className={`entry entry--watch entry--watch-${entry.status}`}>
                <span className="entry__ticker">{quote}</span>
                <span className="entry__reason">{watchStatus(entry)}</span>
                <span className="entry__detail">
                  {formatPct(entry.gapPct)}
                  {entry.price !== null && entry.price !== undefined && <span className="muted"> · {formatPrice(entry.price)}</span>}
                </span>
                <button type="button" className="icon-button" aria-label={`Stop watching ${quote}`} title="Stop watching" onClick={() => onRemove(quote)}>
                  <CloseIcon fontSize="small" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
};

const SidePanel = ({ race, standings, podiumTitle, dismissed, onRestore, onRestoreAll, watched, onToggleWatch, onAddWatch }) => (
  <aside className="side">
    <Podium standings={standings} phase={race.phase} title={podiumTitle} />
    <WatchList race={race} watched={watched} onRemove={onToggleWatch} onAdd={onAddWatch} />
    <DismissedList race={race} dismissed={dismissed} onRestore={onRestore} onRestoreAll={onRestoreAll} />
    <EntryList
      title="Out for today"
      variant="out"
      entries={race.out.filter((entry) => !dismissed.includes(entry.quote))}
      emptyText="Every stock is above yesterday's high and holding the 20 SMA."
      renderDetail={(entry) => (entry.eliminatedAt ? `${entry.eliminatedAt} candle` : 'Until it breaks the high')}
      watched={watched}
      onToggleWatch={onToggleWatch}
    />
    <EntryList
      title="Not qualifying"
      variant="waiting"
      entries={race.waiting.filter((entry) => !dismissed.includes(entry.quote))}
      emptyText="Every stock is in the race."
      renderDetail={(entry) => formatPct(entry.gapPct)}
      watched={watched}
      onToggleWatch={onToggleWatch}
    />
  </aside>
);

export default SidePanel;
