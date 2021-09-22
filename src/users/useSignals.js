import * as _ from 'lodash';
import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import axios from 'axios';

const GET_SIGNALS = "updateQuote";
const SOCKET_SERVER_URL = "http://192.168.0.149:55555";

const useSignals = () => {
  const [quotes, setQuotes] = useState([]);
  const socketRef = useRef();
  const [lastestInterval,setLastestInterval] =useState(0);

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL);
    socketRef.current.on(GET_SIGNALS, (quote) => {
      const updatedQuotes = updateQuote(quotes,quote);
      setQuotes(updatedQuotes);
    });

    const updateQuote = ((quotes,updatedQuote)=>{
      const quoteLastestInterval = updatedQuote.signalsHistory[updatedQuote.signalsHistory.length-1].interval;
      let newQuotes = _.filter(quotes, quote => quote.quoteName!==updatedQuote.quoteName);
      if (quoteLastestInterval>lastestInterval) {
        setLastestInterval(quoteLastestInterval);
      }
      newQuotes.unshift(updatedQuote);   
      return [...newQuotes];
    });
    
    return () => {
      socketRef.current.disconnect();
    };

  });

  useEffect(() => {
    const fetchMyAPI= async () => {
      const response = await axios.get(SOCKET_SERVER_URL+"/getAllQuotes");
      const quotesData = response.data
      setQuotes(quotesData);
    }
    fetchMyAPI();
  },[])
  

  return { quotes , lastestInterval};
};

export default useSignals;

