import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';
//import { createStore } from 'redux';
import rootReducer from './reducers/rootReducer';
//import { composeWithDevTools } from "redux-devtools-extension";
import { configureStore } from '@reduxjs/toolkit';

const root = ReactDOM.createRoot(document.getElementById("root"));

const store = configureStore({
  reducer: rootReducer,
  // Other middleware or enhancers can be configured here if needed
});
// const store = createStore(
//               rootReducer,
//               composeWithDevTools()
//   )

root.render(
  <React.StrictMode>
     <Provider store={store}><App /></Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
