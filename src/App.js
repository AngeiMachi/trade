import './App.css';
import useSignals from './users/useSignals';
import SignalsAppBar from './components/AppBar/AppBar';
import QuoteList from './components/QuoteList/QuoteList';

function App() {
  

  useSignals();


  return (
    <div className="App">
      <SignalsAppBar />
      <QuoteList />
      
    </div>
  );
}

export default App;
