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
  const [date, setDate] = useState('')
  const  { getAllOrders, getInfoProducts } = useOrderService()
 
 useEffect(()=>{
    onLoadingProducts()
 }, [localStorage.data])
 
 const onLoadingProducts = (data = localStorage.data) =>{
   
      const formData = JSON.stringify({
        "dir": "ASC",
        "filter": {
            "cutoff_from": `${data}T00:00:00.000Z`,
            "cutoff_to": `${data}T13:00:00Z`,
            "delivery_method_id": [],
            "provider_id": [],
            "status": "awaiting_deliver",
            "warehouse_id": []
        },
        "limit": 100,
        "offset": 0,
        "with": {
            "analytics_data": true,
            "barcodes": true,
            "financial_data": true,
            "translit": true
        }
      })

      const arr = []
      getAllOrders(formData).then(data => {
        console.log(data)
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
  

 
 }
 
 
 
 const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <div>
          <ListOrder props={orders} date={date} setDate={setDate} onLoadingProducts={onLoadingProducts}/>
      </div>
    ), 
  },
  {
    path: "table",
    element:  <Table props={product} date={date} setDate={setDate} onLoadingProducts={onLoadingProducts}/>,
  } 
]);

createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
);
  
  // return (
  //   <div className="App">
  //     {/* <NavLink onLoadingProducts={onLoadingProducts}/> */}
  //     {/* <ListOrder props={orders}/>
  //       <Table props={product}/> */}
  //   </div>
  // );
}

export default App;
