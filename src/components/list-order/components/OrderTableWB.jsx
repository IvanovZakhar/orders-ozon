 
import React from 'react';
import Barcode from './Barcode';

const OrderTableWB = ({ ordersWB, deleteItemWB, setInfoOrder }) => { 
  return (
    <table className="list-order" id='list-order'>
      <thead>
        <tr className='list-order__item'>
          <th>№</th>
          <th>Номер отправления</th>
          <th>Наклейка</th>
          <th>Дата</th>
          <th>Артикул</th>
          <th>Кол-во шт.</th>
          <th>Склад</th>
          <th>Дейст.</th>
        </tr>
      </thead>
      <tbody>
        {ordersWB.map((order, i) => (
          <tr
            className={`list-order__item ${order.status === 'packed' ? 'packed' : ''}`}
            key={order.id}
          >
            <td className='list-order__item'>{i + 1}</td>
            <td className='list-order__item posting-number'>
              <Barcode value={`WB${order.id}`} />
            </td>
            <td className='list-order__item'>{order.stickerId}</td>
            <td className='productName list-order__item' onClick={() => setInfoOrder(order.article)}>
              {order.name}
            </td>
            <td className='list-order__item'>{order.article}</td>
            <td className='list-order__item'>1</td>
            <td className='warehouse list-order__item'>
              {order.warehouseId === 1088352 || order.warehouseId === 1129665
                ? 'Уткина заводь'
                : 'Шушары'}
            </td>
            <td
              className='cross_item'
              onClick={(event) => {
                event.stopPropagation();
                deleteItemWB(order.id, order.stickerId);
              }}
            >
              x
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default OrderTableWB;
