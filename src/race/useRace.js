import { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
import { SOCKET_SERVER_URL } from '../users/useSignals';

const useRace = () => {
  const [race, setRace] = useState(null);
  const [connection, setConnection] = useState('connecting');
  const [replayPaused, setReplayPaused] = useState(false);

  useEffect(() => {
    const socket = socketIOClient(SOCKET_SERVER_URL);

    socket.on('connect', () => {
      setConnection('live');
      axios
        .get(`${SOCKET_SERVER_URL}/race`)
        .then((response) => response.data && setRace(response.data))
        .catch(() => {});
      axios
        .get(`${SOCKET_SERVER_URL}/mock`)
        .then((response) => setReplayPaused(!!response.data?.paused))
        .catch(() => {});
    });
    socket.on('disconnect', () => setConnection('offline'));
    socket.on('connect_error', () => setConnection('offline'));
    socket.on('raceUpdate', setRace);
    socket.on('mockUpdate', (mock) => setReplayPaused(!!mock?.paused));

    return () => socket.disconnect();
  }, []);

  // Replay only: stop or play the mock clock.
  const setPaused = (paused) => {
    setReplayPaused(paused);
    axios
      .post(`${SOCKET_SERVER_URL}/mock`, { paused })
      .then((response) => setReplayPaused(!!response.data?.paused))
      .catch(() => setReplayPaused(!paused));
  };

  return { race, connection, replayPaused, setReplayPaused: setPaused };
};

export default useRace;
