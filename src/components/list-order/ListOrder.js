import NavLink from '../NavLink/Nav-link';
import useOrderService from '../../services/OrderService';
import { useState, useEffect } from 'react';
import './ListOrder.scss'

const ListOrder = ({props, onLoadingProducts, date, setDate, headersOzon}) => {
    const {getLabelOzon} = useOrderService()
    const [labels, setLabels] = useState();
    const [name, setName] = useState('')
    const compare = (a, b) => {
        if (a.productArt < b.productArt) {
          return -1;
        }
        if (a.productArt > b.productArt) {
          return 1;
        }
        return 0;
      };

    const readySort = props ? props.sort(compare) : null
    
    const elem = readySort ? readySort.map((item, i) => {
        const {date,
            postingNumber,
            productArt,productName,
            productPrice,
            quantity,
            warehouse} = item;
  
            return(
   
                <tr className='list-order__item' key={item.postingNumber}>
                    <td className='list-order__item'>{i+=1}</td>
                    <td className='list-order__item posting-number'>{postingNumber}</td>
                    <td className='list-order__item'>{`${date.slice(8, 10)}.${date.slice(5, 7)}.${date.slice(0, 4)}`}</td>
                    <td className='productName list-order__item'>{productName}</td>
                    <td className='list-order__item'>{productArt}</td>
                    <td className='list-order__item'>{productPrice.slice(0, -7)}</td>
                    <td className='list-order__item'>{quantity}</td>
                    <td className='warehouse list-order__item'>{warehouse.slice(0, 3)}</td>
                </tr>
               
            )
    }) : null;
 

   
    
   

    function getLabels () {
        const postingNumbers = readySort ? readySort.map(obj => obj.postingNumber): null
    
        const body = {
            "posting_number": postingNumbers
        };
    
            
        getLabelOzon('https://api-seller.ozon.ru/v1/posting/fbs/package-label/create', 'POST', JSON.stringify(body), headersOzon)
        .then(data => {
            console.log(data);
            const taskId = {
                "task_id": data.result.task_id
            };
            console.log(taskId);
    
            const interval = setInterval(() => {
                getLabelOzon('https://api-seller.ozon.ru/v1/posting/fbs/package-label/get', 'POST', JSON.stringify(taskId), headersOzon)
                    .then(res => {
                        console.log(res);
                        if (res.result.status === 'completed') {
                            clearInterval(interval);
                            setLabels(res.result.file_url);
                        } else if (res.result.status === 'error') {
                            clearInterval(interval);
                            console.log('Ошибка при формировании файла с этикетками:', res.result.error);
                        }
                    })
                    .catch(error => {
                        clearInterval(interval);
                        console.log('Ошибка при проверке статуса задания:', error);
                    });
            }, 3000);
        })
        .catch(error => console.log('Ошибка при создании задания:', error));
    
    }

    function colculateTotalProducts(product) {
        const summary = product.reduce((accumulator, item) =>
          Object.assign(accumulator, {
            [item.productArt]: {
              name: item.productName,
              quantity: (accumulator[item.productArt]?.quantity || 0) + item.quantity,
            },
          }), {});
      
        return Object.entries(summary).map(([key, value]) => (
          <tr className='list-order__item' key={key}>
            <td className='list-order__item'>{key}</td>
            <td className='list-order__item-name'>{value.name}</td>
            <td className='list-order__item'>{value.quantity}</td>
          </tr>
        ));
      }
      
const productTotal = props ? colculateTotalProducts(props) : null;
   const dateOrders = props[0] ? `${props[0].date.slice(8, 10)}.${props[0].date.slice(5, 7)}.${props[0].date.slice(0, 4)}` : 'Нет отправлений';
  
    return(
        <>
             <NavLink onLoadingProducts={onLoadingProducts} date={date} setDate={setDate} getLabels={getLabels} labels={labels} setName={setName}/>
             <h1>{localStorage.nameCompany}</h1>
            {elem ? <Page elem={elem} productTotal={productTotal} dateOrders={dateOrders}/> : <h2>Введите дату</h2>}
            </>
    )
}

const Page = ({elem, productTotal, dateOrders}) => {
    return(
        <>
               
                <table className="list-order">
                    <thead>
                        <tr className='list-order__item'>
                            <th className='list-order__item'>№</th>
                            <th className='list-order__item'>Номер отправления</th>
                            <th className='list-order__item'>Дата отгрузки</th>
                            <th className='list-order__item date'>{dateOrders}</th>
                            <th className='art list-order__item'>Артикул</th>
                            <th className='list-order__item'>Стоимость</th>
                            <th className='list-order__item'>Кол-во шт.</th>
                            <th className='list-order__item'>Склад</th>
                        </tr>
                    </thead>
                    <tbody>
                        {elem}
                        
                    </tbody>
                
                </table>
            
                <table className="list-order">
                    <h2>Итого</h2>
                    <thead>
                        <tr className='list-order__item'>
                            <th className='list-order__item'>Артикул</th> 
                            <th className='list-order__item'>Название</th>
                            <th className='list-order__item'>Кол-во</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productTotal}
                    </tbody>

                </table>

        </>
    )
}

export default ListOrder;