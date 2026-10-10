import Tooltip from '@mui/material/Tooltip';
import { BADGES } from './badges';

const tooltipSx = {
  maxWidth: 320,
  padding: '10px 12px',
  background: '#1f2835',
  border: '1px solid #2e3a4d',
  borderRadius: '8px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.45)',
  color: '#e8edf4',
  fontFamily: 'Barlow, system-ui, sans-serif',
  fontSize: '0.8125rem',
  lineHeight: 1.45,
};
const arrowSx = { color: '#1f2835', '&::before': { border: '1px solid #2e3a4d' } };

// A colored badge with an explanation tooltip above it: what the badge means in general, then this stock's numbers.
const Badge = ({ id, label, detail, Icon, level }) => (
  <Tooltip
    arrow
    placement="top"
    enterDelay={150}
    componentsProps={{ tooltip: { sx: tooltipSx }, arrow: { sx: arrowSx } }}
    title={
      <span className="badge-tooltip">
        <strong className="badge-tooltip__title">{label}</strong>
        {BADGES[id] && <span className="badge-tooltip__text">{BADGES[id].explanation}</span>}
        {detail && <span className="badge-tooltip__detail">{detail}</span>}
      </span>
    }
  >
    <span className={`tag badge badge--${id}${level ? ` badge--${level}` : ''}`} tabIndex={0}>
      {Icon && <Icon fontSize="inherit" />}
      {label}
    </span>
  </Tooltip>
);

export default Badge;
