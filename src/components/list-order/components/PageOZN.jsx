import React from 'react';

const PageOZN = ({
  elem,
  productTotal,
  dateOrders,
  addedDeliveryDateOzn,
  props,
  errorInput,
  dateInput,
}) => {
  return (
    <>
      <table className="list-order" id="list-order">
        <thead>
          <tr className="list-order__item">
            <th className="list-order__item">№</th>
            <th className="list-order__item">Номер отправления</th>
            <th className="list-order__item">Дата отгрузки</th>
            <th className="list-order__item date">
              <input
                type="date"
                value={dateInput}
                onChange={(e) => addedDeliveryDateOzn(e.target.value, props)}
                style={{ border: errorInput ? '3px solid red' : '' }}
              />
            </th>
            <th className="art list-order__item">Артикул</th>
            <th className="list-order__item">Стоимость</th>
            <th className="list-order__item">Кол-во шт.</th>
            <th className="list-order__item">Склад</th>
            <th className="list-order__item">Дейст.</th>
          </tr>
        </thead>
        <tbody>{elem}</tbody>
      </table>

      <table className="list-order" id="list-order">
        <h2>Итого</h2>
        <thead>
          <tr className="list-order__item">
            <th className="list-order__item">Артикул</th>
            <th className="list-order__item">Название</th>
            <th className="list-order__item">Кол-во</th>
          </tr>
        </thead>
        <tbody>{productTotal}</tbody>
      </table>
    </>
  );
};

export default PageOZN;
