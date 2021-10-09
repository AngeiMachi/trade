import React, { useState } from 'react';
import Card from '@material-ui/core/Card';
import QuoteCardHeader from './QuoteCardHeader/QuoteCardHeader';
import QuoteCardBody from './QuoteBody/QuoteBody';
import CssBaseline from '@material-ui/core/CssBaseline';


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