import { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
import { SOCKET_SERVER_URL } from '../users/useSignals';

// The watchlist lives on the server so it survives across days and browsers; every open board gets changes live.
const useWatchlist = () => {
  const [watched, setWatched] = useState([]);

  useEffect(() => {
    const socket = socketIOClient(SOCKET_SERVER_URL);
    const load = () =>
      axios
        .get(`${SOCKET_SERVER_URL}/watchlist`)
        .then((response) => setWatched(response.data.map((item) => item.quote)))
        .catch(() => {});

    socket.on('connect', load);
    socket.on('watchlistUpdate', (list) => setWatched(list.map((item) => item.quote)));
    return () => socket.disconnect();
  }, []);

  const save = (request) => request.then((response) => setWatched(response.data.map((item) => item.quote)));

  // Resolves to an error message, or null when the symbol was added.
  const addWatch = (quote) =>
    save(axios.post(`${SOCKET_SERVER_URL}/watchlist`, { quote }))
      .then(() => null)
      .catch((err) => err.response?.data?.error || "Couldn't reach the engine");

  const removeWatch = (quote) => save(axios.delete(`${SOCKET_SERVER_URL}/watchlist/${encodeURIComponent(quote)}`)).catch(() => {});

  const toggleWatch = (quote) => (watched.includes(quote) ? removeWatch(quote) : addWatch(quote));

  return { watched, toggleWatch, addWatch, removeWatch };
};

export default useWatchlist;
