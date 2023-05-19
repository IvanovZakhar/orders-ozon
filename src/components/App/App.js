import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useOrderService from '../../services/OrderService';
import Table from '../Table/Table';
import ListOrder from '../list-order/ListOrder';
import TestPage from '../TestPage/TestPage';
import './App.css';

function App() {

  const [orders, setOrders] = useState('');
  const [product, setProduct] = useState('');
  const [allProducts, setAllProducts] = useState('');
  const [date, setDate] = useState('');
  const [baskets, setBaskets] = useState();
  const [basketsProduct, setBasketsProduct] = useState();
 
  const { getAllOrders, getInfoProducts, getBaskets, getAllProducts } = useOrderService();
  
   

   
  useEffect(() => {
    onLoadingProducts();
    getBaskets().then((data) => {
      setBaskets(data);
    });

    getAllProducts().then(setAllProducts);

  }, [localStorage.data]);
 
   const headersOzon = {  
        'Client-Id': `${localStorage.clientId}` ,
        'Api-Key': `${localStorage.apiKey}`
     }

  const onLoadingProducts = (data = localStorage.data) => {
    const formData = JSON.stringify({
      dir: 'ASC',
      filter: {
        cutoff_from: `${data}T00:00:00.000Z`,
        cutoff_to: `${data}T17:00:00Z`,
        delivery_method_id: [],
        provider_id: [],
        status: 'awaiting_deliver',
        warehouse_id: [],
      },
      limit: 100,
      offset: 0,
      with: {
        analytics_data: true,
        barcodes: true,
        financial_data: true,
        translit: true,
      },
    });

    const arr = [];
    getAllOrders(formData, headersOzon).then((data) => {
      setOrders(data);
      getInfoProducts(data).then((data) => {
        data.forEach((item, i) =>
          item.then((data) => {
            arr[i] = data[0];
            arr[i].postingNumber = data.postingNumber;
            arr[i].date = data.date;
            arr[i].price = data.price;
            arr[i].warehouse = data.warehouse;
            arr[i].quantity = data.quantity;
            setProduct([arr]);
          })
        );
      });
    });
  };


 

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ListOrder props={orders} date={date} setDate={setDate} onLoadingProducts={onLoadingProducts} headersOzon={headersOzon}/>} />
        <Route path="/table" element={<Table props={product} date={date} setDate={setDate} onLoadingProducts={onLoadingProducts}  />} />
        {/* <Route path="/test" element={<TestPage props={baskets} allProducts={allProducts} basketsProduct={basketsProduct} />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
