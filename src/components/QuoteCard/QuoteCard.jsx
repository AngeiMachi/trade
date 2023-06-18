import React, { useState } from 'react';
import Card from '@mui/material/Card';
import QuoteCardHeader from './QuoteCardHeader/QuoteCardHeader';
import QuoteCardBody from './QuoteBody/QuoteBody';
import CssBaseline from '@mui/material/CssBaseline';


export const QuoteCard = ({quote}) => {
    const [isVisible,HideQuoteCard] = useState(true);
    

    function handleHideQuote() {
      HideQuoteCard(false);
    }

    return (
      <>
      {isVisible &&
      <CssBaseline>
        <Card style={{  width: '100%' }}>
            <QuoteCardHeader quote={quote} hideQuote={handleHideQuote}/>
            <QuoteCardBody signals={quote?.signalsHistory} prevDayPrice={quote.metadata.prevPrice}/>
        </Card>
      </CssBaseline> }
      </> 
    )
}