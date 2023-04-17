import useOrderService from '../../services/OrderService'
import Table from '../Table/Table';
import ListOrder from '../list-order/ListOrder';
import { useState, useEffect } from 'react';
import './App.css';
import NavLink from '../NavLink/Nav-link';

import React from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from "react-router-dom";



function App() {
  const [orders, setOrders] = useState('')
  const [product, setProduct] = useState('')
  const  { getAllOrders, getInfoProducts } = useOrderService()
 useEffect(() => {
  const arr = []
  getAllOrders().then(data => {
    setOrders(data)
    getInfoProducts(data).then(data => {
 
   data.forEach((item, i) => item.then((data) => {
    arr[i] = data[0]
    arr[i].postingNumber = data.postingNumber;
    arr[i].date = data.date;
    arr[i].price = data.price
    setProduct([arr])
  }))
 
  })})


 }, [])
 
 
 const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
          <NavLink/>
      </div>
    ),
  },
  {
    path: "list-order",
    element: <ListOrder props={orders}/>,
  },
  {
    path: "table",
    element:  <Table props={product}/>,
  },
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
  
  return (
    <div className="App">
      <NavLink/>
      <ListOrder props={orders}/>
        <Table props={product}/>
    </div>
  );
}

export default App;
