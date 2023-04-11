import useOrderService from '../../services/OrderService'
import Table from '../Table/Table';
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [art, setArt] = useState('')
  const [product, setProduct] = useState('')
  const  { getAllOrders, getInfoProducts } = useOrderService()
 useEffect(() => {
  getAllOrders().then(data => setArt(data.product))
  getInfoProducts().then(data => setProduct(data))
 }, [])
console.log(art)
 const elem = product ? product.filter(item => item.article === art) : null;
 console.log(elem)
  return (
    <div className="App">
        <Table/>
    </div>
  );
}

export default App;
