import useOrderService from '../../services/OrderService'
import Table from '../Table/Table';
import ListOrder from '../list-order/ListOrder';
import { useState, useEffect } from 'react';
import './App.css';

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
 
 
  
  return (
    <div className="App">
      <ListOrder props={orders}/>
        {/* <Table props={product}/> */}
    </div>
  );
}

export default App;
