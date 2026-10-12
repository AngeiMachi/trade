import PauseRoundedIcon from '@mui/icons-material/PauseRounded';
import PlayArrowRoundedIcon from '@mui/icons-material/PlayArrowRounded';
import { addMinutes, formatTime, formatTradeDate } from './format';

const NEW_YORK = 'America/New_York';
const ISRAEL = 'Asia/Jerusalem';

const connectionLabel = {
  connecting: 'Connecting',
  live: 'Connected',
  offline: 'Engine offline',
};

const LapTrack = ({ lap, totalLaps, decisionLaps, forming }) => {
  const laps = Array.from({ length: totalLaps }, (_, index) => index + 1);
  return (
    <div className="lap-track" aria-label={`Candle ${lap} of ${totalLaps} before the bell`}>
      <div className="lap-track__ticks">
        {laps.map((number) => {
          const isDecision = number > totalLaps - decisionLaps;
          const state = number < lap ? 'done' : number === lap ? 'current' : 'todo';
          return <span key={number} className={`lap-tick lap-tick--${state}${isDecision ? ' lap-tick--decision' : ''}`} />;
        })}
        <span className="lap-track__bell">Bell</span>
      </div>
      <div className="lap-track__label">
        {lap > 0 ? (
          <>
            Candle <strong>{Math.min(lap, totalLaps)}</strong> of {totalLaps}
            {forming && (
              <span className="forming" title="The board updates while this 5-minute candle is still forming">
                <span className="forming__dot" />
                Live candle
              </span>
            )}
          </>
        ) : (
          'Waiting for the first candle'
        )}
      </div>
    </div>
  );
};

const sinceBell = (minutes) => (minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, '0')}m`);

const RaceHeader = ({ race, connection, replayPaused, onReplayPaused }) => {
  const isFinal = race?.phase === 'final';
  const candleEndIso = isFinal ? race.clockIso || race.bellIso : race?.clockIso || addMinutes(race?.raceTimeIso, 5);
  const minutesToBell = race?.raceTimeIso ? Math.max(0, Math.round((new Date(race.bellIso) - new Date(candleEndIso)) / 60000)) : null;
  const minutesSinceBell = isFinal ? Math.max(0, Math.round((new Date(candleEndIso) - new Date(race.bellIso)) / 60000)) : null;

  return (
    <header className="race-header">
      <div className="race-header__brand">
        <h1 className="brand">Opening Bell Race</h1>
        <div className="race-header__meta">
          <span>{race ? formatTradeDate(race.tradeDate) : 'Pre-market'}</span>
          {race && <span className="tag tag--neutral">{race.direction === 'long' ? 'Long' : 'Short'}</span>}
          {race?.isMock && <span className="tag tag--sim">Simulation</span>}
        </div>
      </div>

      {race && <LapTrack lap={race.lap} totalLaps={race.totalLaps} decisionLaps={race.decisionLaps} forming={race.candleForming} />}

      <div className="race-header__clock">
        {race?.isMock && (
          <button
            type="button"
            className={`replay-control${replayPaused ? ' replay-control--paused' : ''}`}
            onClick={() => onReplayPaused(!replayPaused)}
            aria-label={replayPaused ? 'Play the replay' : 'Stop the replay'}
            title={replayPaused ? 'Play the replay' : 'Stop the replay clock'}
          >
            {replayPaused ? <PlayArrowRoundedIcon fontSize="small" /> : <PauseRoundedIcon fontSize="small" />}
            {replayPaused ? 'Play' : 'Stop'}
          </button>
        )}
        <div className="clock">
          <span className="clock__time">{formatTime(candleEndIso, NEW_YORK)}</span>
          <span className="clock__zone">New York</span>
        </div>
        <div className="clock clock--secondary">
          <span className="clock__time">{formatTime(candleEndIso, ISRAEL)}</span>
          <span className="clock__zone">Israel</span>
        </div>
        <div className="countdown">
          <span className="countdown__value">{isFinal ? sinceBell(minutesSinceBell) : minutesToBell === null ? '–' : `${minutesToBell} min`}</span>
          <span className="clock__zone">{isFinal ? 'Since the bell' : 'To the bell'}</span>
        </div>
        <span className={`connection connection--${connection}`}>
          <span className="connection__dot" />
          {connectionLabel[connection]}
        </span>
      </div>
    </header>
  );
};

export default RaceHeader;
