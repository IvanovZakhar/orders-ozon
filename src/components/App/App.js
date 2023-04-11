import useOrderService from '../../services/OrderService'
import Table from '../Table/Table';
import { useEffect } from 'react';
import './App.css';

function App() {
  const  { getAllOrders } = useOrderService()
 useEffect(() => {
  getAllOrders()
 }, [])
  return (
    <div className="App">
        <Table/>
    </div>
  );
}

export default App;
