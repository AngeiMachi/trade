// What each kind of market-watch alert means for the trader, in one place. Keys are the engine's alert tones.
// `popup`: shown bottom-right when it arrives live. Buy setups pop with a chime and stay; "Get ready" pops quietly a few
// minutes before a buy setup may complete. "Avoid" and "Wait" only go to the Alerts tab.
export const ALERT_ACTIONS = {
  opportunity: { label: 'Buy setup', filterLabel: 'Buy setups', popup: true, stays: true },
  prepare: { label: 'Get ready', filterLabel: 'Get ready', popup: true, stays: false },
  caution: { label: 'Avoid', filterLabel: 'Avoid', popup: false, stays: false },
  info: { label: 'Wait', filterLabel: 'Wait', popup: false, stays: false },
};

export const actionOf = (alert) => ALERT_ACTIONS[alert.tone] || ALERT_ACTIONS.info;
