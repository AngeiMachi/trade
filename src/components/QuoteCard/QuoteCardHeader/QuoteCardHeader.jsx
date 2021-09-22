import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Box from '@material-ui/core/Box';
import MovingAverage from '../MovingAverage/MovingAverage';
import Button from '@material-ui/core/Button';
import useSignals from '../../../users/useSignals';


export const  QuoteCardHeader = ({quote,hideQuote}) => {

    const  lastestInterval   =  0 
    const quoteLastInterval = quote.signalsHistory[quote.signalsHistory.length-1].interval;
    return (
      <CssBaseline>
        <Box display="flex" p={1} bgcolor="background.paper">
          <Box p={1} flexGrow={1} bgcolor={quoteLastInterval===lastestInterval?"success.main":"grey.300"} display="flex">
            <Button variant="contained" color="primary" onClick={hideQuote}>
              {quote.quoteName}
            </Button>
          </Box>
          {quote.sma.map((sma)=>(
            <Box p={1} bgcolor={quoteLastInterval===lastestInterval?"success.main":"grey.300"} key={sma.type+quote.quoteName}>
              <MovingAverage type={sma.type} isAbove={sma.isAbove} isTrendingUp={sma.isTrendingUp} quoteName={quote.quoteName}/>
            </Box>
          ))}
        </Box>
      </CssBaseline> 
    )
}
export default QuoteCardHeader;