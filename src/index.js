import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';
console.log(process.env.API_URL)
  
console.log(process.env.CLIENT_ID)
console.log(process.env.API_KEY)
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);



// import useOrderService from './services/OrderService'
// import Table from './components/Table/Table';
// import ListOrder from './components/list-order/ListOrder';
// import TestPage from './components/TestPage/TestPage';
// import { useState, useEffect } from 'react';
// import './index.css';
