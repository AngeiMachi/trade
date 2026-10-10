const timeFormatters = {};

export const formatTime = (iso, timeZone) => {
  if (!iso) {
    return '--:--';
  }
  if (!timeFormatters[timeZone]) {
    timeFormatters[timeZone] = new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit' });
  }
  return timeFormatters[timeZone].format(new Date(iso));
};

export const formatTradeDate = (tradeDate) =>
  new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(`${tradeDate}T12:00:00Z`)
  );

export const formatPct = (value, digits = 2) => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return '–';
  }
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  return `${sign}${Math.abs(value).toFixed(digits)}%`;
};

export const formatPrice = (value) => (value === null || value === undefined ? '–' : value.toFixed(2));

const compactDollars = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 1 });

export const formatDollars = (value) => (value ? compactDollars.format(value) : '$0');

export const addMinutes = (iso, minutes) => (iso ? new Date(new Date(iso).getTime() + minutes * 60000).toISOString() : null);
