
import {QuoteCard} from '../QuoteCard/QuoteCard';
import Grid from '@mui/material/Grid';
import { useSelector } from 'react-redux';

const QuoteList = () => {
    const quoteListView = useSelector(state => state.quoteList.quotesView);
    
    return (
        <Grid direction='row' container spacing={1}>
        <Grid container item xs={12} lg={4}>
          {quoteListView.map((quote, i) => (
               <QuoteCard quote={quote} key={i}/>
          ))}
           
        </Grid>
        
        
      </Grid>
    )
}

export default QuoteList;