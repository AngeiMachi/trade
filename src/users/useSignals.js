//import * as _ from 'lodash';
import { useEffect, useRef } from "react";
import socketIOClient from "socket.io-client";
import axios from 'axios';
import { useDispatch} from 'react-redux';

const GET_SIGNALS = "updateQuote";
const SOCKET_SERVER_URL = "https://signalsserver.loca.lt";

const useSignals = () => {
  const dispatch = useDispatch();
  //const lastestInterval2 =  useSelector(state => state.quoteList.lastestInterval);
  
  //const [quotes, setQuotes] = useState([]);
  const socketRef = useRef();
  //const [lastestInterval,setLastestInterval] =useState(0);

  useEffect(() => {
    socketRef.current = socketIOClient(SOCKET_SERVER_URL);
    socketRef.current.on(GET_SIGNALS, (quote) => {
         dispatch({type: 'UPDATE_QUOTE', payload: quote});
    });

    // const updateQuote = ((quotes,updatedQuote)=>{
    //   const quoteLastestInterval = updatedQuote.signalsHistory[updatedQuote.signalsHistory.length-1].interval;
    //   let newQuotes = _.filter(quotes, quote => quote.quoteName!==updatedQuote.quoteName);
    //   if (quoteLastestInterval>lastestInterval) {
    //     setLastestInterval(quoteLastestInterval);
    //   }
    //   newQuotes.unshift(updatedQuote);   
    //   return [...newQuotes];
    // });
    
    return () => {
      socketRef.current.disconnect();
    };

  });

  useEffect(() => {
    const fetchMyAPI= async () => {
      const response = await axios.get(SOCKET_SERVER_URL+"/getAllQuotes");
      const quoteList = response.data;
      dispatch({type: 'UPDATE_QUOTE_LIST', payload: quoteList});
    }
    fetchMyAPI();
  },[dispatch])
  

  return {  };
};

export default useSignals;

