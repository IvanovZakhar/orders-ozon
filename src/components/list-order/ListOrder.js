import NavLink from '../NavLink/Nav-link';
import useOrderService from '../../services/OrderService';
import { useState, useEffect } from 'react';
import './ListOrder.scss'
import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useBarcode } from 'next-barcode';

const ListOrder = ({props, onLoadingProducts, date, setDate, headersOzon, ordersWB}) => {

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
            warehouse, 
            packed} = item;
  
            return(
   
                <tr className='list-order__item' key={item.postingNumber} style={{backgroundColor: `${packed ? 'green' : null}`}}>
                    <td className='list-order__item'>{i+=1}</td>
                    <td className='list-order__item posting-number'>{postingNumber}</td>
                    <td className='list-order__item'>{`${date.slice(8, 10)}.${date.slice(5, 7)}.${date.slice(0, 4)}`}</td>
                    <td className='productName list-order__item'>{productName}</td>
                    <td className='list-order__item'>{productArt}</td>
                    <td className='list-order__item'>{productPrice.slice(0, -5)}</td>
                    <td className='list-order__item'>{quantity}</td>
                    <td className='warehouse list-order__item'>{warehouse.slice(0, 8)}</td>
                </tr>
               
            )
    }) : null;
 

    function getEuropeanFormattedDate() {
        const today = new Date();
      
        // Получаем день, месяц и год
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Месяцы в JS начинаются с 0, поэтому добавляем 1
        const year = today.getFullYear();
      
        // Собираем дату в европейском формате
        const europeanFormattedDate = `${day}/${month}/${year}`;
      
        return europeanFormattedDate;
      }
      
      // Пример использования
      const todayEuropeanDate = getEuropeanFormattedDate();
    const saveAsPDF = () => {
        const input = document.getElementById('canvas');
    
        html2canvas(input).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('landscape'); // Задаем альбомный формат
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
          pdf.save(`${localStorage.nameCompany}__${todayEuropeanDate}.pdf`);
        });
      };
   

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
      console.log(ordersWB)
const productTotal = props ? colculateTotalProducts(props) : null;
   const dateOrders = props[0] ? `${props[0].date.slice(8, 10)}.${props[0].date.slice(5, 7)}.${props[0].date.slice(0, 4)}` : 'Нет отправлений';
  
    return(
        <>
             <NavLink onLoadingProducts={onLoadingProducts} date={date} setDate={setDate} getLabels={getLabels} labels={labels} setName={setName}/>
            <div id='canvas'>
                <h1>{localStorage.nameCompany}</h1>
                {ordersWB.length ? <PageWB ordersWB={ordersWB}/> : <Page elem={elem} productTotal={productTotal} dateOrders={dateOrders}/> }
            </div>
            <button onClick={saveAsPDF}>Сохранить как PDF</button>
            </>
    )
}

const Page = ({elem, productTotal, dateOrders}) => {
    
    return(
        <>
               
                <table className="list-order" id='list-order'>
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
            
                <table className="list-order" id='list-order'>
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

const PageWB = ({ordersWB}) => {
    console.log(ordersWB)
    const Barcode = ({barcodeOrders}) => {
        const options = {
            value: `${barcodeOrders}`,
            options: {
              background: '#ffffff',
              height: '50',
              width: '2', 
              display: 'flex',
              justifyContent: 'center',
              fontSize: '0'
            }
          };
        const { inputRef } = useBarcode(options);
      
        return <svg className='barcode' ref={inputRef} style={  {
            display: 'block',
            margin: '0 auto',
            textAlign: 'center'
          }}/>;
      };
    return(
        <>
               
                <table className="list-order" id='list-order'>
                    <thead>
                        <tr className='list-order__item'>
                            <th className='list-order__item'>№</th>
                            <th className='list-order__item'>Номер отправления</th>
                            <th className='list-order__item'>Наклейка</th>
                            <th className='list-order__item date'><input type='date'/></th>
                            <th className='art list-order__item'>Артикул</th> 
                            <th className='list-order__item'>Кол-во шт.</th>
                            <th className='list-order__item'>Склад</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ordersWB.map((order, i) => {
                            console.log(order)
                            return(
                            <tr className='list-order__item' key={i} style={{backgroundColor: `${order.packed ? 'green' : null}`}}>
                                <td className='list-order__item'>{i+=1}</td>
                                <td className='list-order__item posting-number'>{<Barcode barcodeOrders={`WB${order.id}`}/>}</td>
                                <td className='list-order__item'> {order.stickerId}</td>
                                <td className='productName list-order__item'>{order.name}</td>
                                <td className='list-order__item'>{order.article}</td> 
                                <td className='list-order__item'>1</td>
                                <td className='warehouse list-order__item'>{order.warehouseId === 837292 ? "Уткина заводь" : "Шушары"}</td>
                            </tr>
                            )
                        })}
                        
                    </tbody>
                
                </table>
            
  

        </>
    )
}

export default ListOrder;