import { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
import { SOCKET_SERVER_URL } from '../users/useSignals';

const useRace = () => {
  const [race, setRace] = useState(null);
  const [connection, setConnection] = useState('connecting');

  useEffect(() => {
    const socket = socketIOClient(SOCKET_SERVER_URL);

    socket.on('connect', () => {
      setConnection('live');
      axios
        .get(`${SOCKET_SERVER_URL}/race`)
        .then((response) => response.data && setRace(response.data))
        .catch(() => {});
    });
    socket.on('disconnect', () => setConnection('offline'));
    socket.on('connect_error', () => setConnection('offline'));
    socket.on('raceUpdate', setRace);

    return () => socket.disconnect();
  }, []);

  return { race, connection };
};

export default useRace;
