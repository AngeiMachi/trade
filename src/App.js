import './App.css';
import useSignals from './users/useSignals';
import {QuoteCard} from './components/QuoteCard/QuoteCard';
import Grid from '@material-ui/core/Grid';


function App() {
  

  const { quotes  } = useSignals()

  return (
    <div className="App">
      <div>Quotes</div>
      <Grid direction='row' container spacing={1}>
        <Grid container item xs={12} lg={4}>
          {quotes.map((quote, i) => (
              i % 3 === 0 && <QuoteCard quote={quote} key={i}/>
          ))}
           
        </Grid>
        <Grid container item xs={12} lg={4}>
          {quotes.map((quote, i) => (
              i % 3 === 1 && <QuoteCard quote={quote} key={i}/>
          ))}
        </Grid>
        <Grid container item xs={12} lg={4}>
          {quotes.map((quote, i) => (
              i % 3 === 2 && <QuoteCard quote={quote} key={i}/>
          ))}
        </Grid>
      </Grid>
    </div>
  );
}

export default App;
