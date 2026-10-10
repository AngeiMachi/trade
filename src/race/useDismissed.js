import { useEffect, useState } from 'react';

const storageKey = (tradeDate) => `race.dismissed.${tradeDate}`;

const readStored = (tradeDate) => {
  try {
    const stored = JSON.parse(window.localStorage.getItem(storageKey(tradeDate)));
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
};

// Dismissals are a per-day decision, so they are stored under the trade date and start empty on a new day.
const useDismissed = (tradeDate) => {
  const [dismissed, setDismissed] = useState(() => readStored(tradeDate));

  useEffect(() => {
    setDismissed(readStored(tradeDate));
  }, [tradeDate]);

  const save = (next) => {
    window.localStorage.setItem(storageKey(tradeDate), JSON.stringify(next));
    setDismissed(next);
  };

  return {
    dismissed,
    dismiss: (quote) => save(dismissed.includes(quote) ? dismissed : [...dismissed, quote]),
    restore: (quote) => save(dismissed.filter((dismissedQuote) => dismissedQuote !== quote)),
    restoreAll: () => save([]),
  };
};

export default useDismissed;
