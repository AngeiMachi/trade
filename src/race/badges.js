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
    explanation:
      'Volume well above normal up to the same time of day (1.5× or more): pre-market on the race board, the day so far on the Alerts tab (live, with the arrow of the last 30 minutes: ↑ rising, → steady, ↓ fading). Real interest behind the move.',
  },
  'above-bollinger': {
    explanation:
      'Above the daily upper Bollinger band (20 days, 2σ). Unusual strength — the stock is set to open outside its normal range. It stays on the board whatever the other rules say, and the market watch alerts when it comes back down to the band.',
  },
  'kept-outside-bollinger': {
    explanation:
      'A rule would have taken this stock off the board (the 20 SMA, yesterday’s range or volume), but it is above the daily upper Bollinger band, so it stays. Its score and warnings still show how healthy it is.',
  },
  watch: {
    explanation: 'On your watchlist. Watched stocks are listed in the Watching panel every day, whatever the rules say.',
  },

  // Decision badges on the Alerts tab: facts beside the score, to help decide on a setup.
  'on-board': {
    explanation: "The stock is in the race's final standings at the bell, not only healthy pre-market.",
  },
  'quiet-volume': {
    explanation:
      'The dim form of Trending volume: volume so far today is under 0.7× a normal day up to the same time. Few buyers behind the move, it can fade.',
  },
  volume: {
    explanation:
      'Live volume, between quiet and busy: the day so far against a normal day. The arrow is the last 30 minutes against normal for those minutes, compared with the 30 before: ↑ rising, → steady (the normal fade after the open is steady), ↓ fading.',
  },
  'steep-sma': {
    explanation:
      'The hourly 20 SMA rises 0.3 ATR or more over 10 hours, where the race score gives its angle full marks: a strong trend under the price.',
  },
  'deep-test': {
    explanation:
      'The strong form of Touched: the hourly candle went 0.3 ATR or more under the 20 SMA and buyers took it all back. A real test that held.',
  },
  'tight-stop': {
    explanation: 'The level where the setup is wrong is close (0.25 ATR or less under the buy): little risk per share.',
  },
  'wide-stop': {
    explanation: 'The level where the setup is wrong is far (0.6 ATR or more under the buy): take a smaller position for the same risk.',
  },
  'room-to-high': {
    explanation: "Today's high is at least 0.5 ATR above the buy: room to run before it meets the morning's sellers, a natural first target.",
  },
};
