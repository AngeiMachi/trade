// Every badge on the board, in one place: its color (the `badge--<key>` class in race.css) and the plain-language
// explanation shown in its tooltip. Each badge has its own color so no two can be mistaken for each other.
// Keys are the rule ids sent by the engine; `stretched-from-sma` has a stronger look at the alert level.

export const BADGES = {
  'strong-uptrend': {
    explanation: 'Daily strong uptrend: the price is above the daily 10 SMA and the daily 20 SMA, and the 10 SMA is above the 20 SMA.',
  },
  uptrend: {
    explanation: 'Daily uptrend: the price is above the daily 10 SMA and the daily 20 SMA, but the 10 SMA is not above the 20 SMA yet.',
  },
  downtrend: {
    explanation: 'Daily downtrend: the price is below the daily 10 SMA and the daily 20 SMA. A gap up here runs against the daily trend.',
  },
  clean: {
    explanation: 'No pre-market hourly candle dipped below the 20 SMA. The cleanest way to hold it.',
  },
  touched: {
    explanation: 'Some pre-market hourly candles wicked below the 20 SMA but closed back above it. Still holding, less cleanly.',
  },
  'trading-through-sma': {
    explanation:
      'The price is under the hourly 20 SMA inside a candle that has not closed yet. The score is halved; if the hourly candle closes there before the bell, the stock is out.',
  },
  'stretched-from-sma': {
    explanation: 'Far above the hourly 20 SMA for this stock, measured in daily ATRs. Strong, but prone to pulling back toward the SMA.',
  },
  'near-previous-extreme': {
    explanation:
      "A hair under yesterday's high — less than one 5-minute candle's normal move (0.1 daily ATR). Kept in the race because it holds the 20 SMA and shows conviction (a solid gap or unusual volume).",
  },
  'below-previous-extreme': {
    explanation:
      "Below yesterday's high, which normally means out. In the race only because it reclaimed the hourly 200 SMA on the open (see the MA reclaimed badge).",
  },
  'ma-reclaimed': {
    explanation: 'Yesterday it opened below the hourly 200 SMA; today it opens above it. A trend-change setup.',
  },
  'trending-volume': {
    explanation: 'Pre-market volume well above an average morning up to the same time (1.5× or more), on a stock passing the gap.',
  },
  'above-bollinger': {
    explanation: 'Above the daily upper Bollinger band (20 days, 2σ). Unusual strength — the stock is set to open outside its normal range.',
  },
  watch: {
    explanation: 'On your watchlist. Watched stocks are listed in the Watching panel every day, whatever the rules say.',
  },
};
