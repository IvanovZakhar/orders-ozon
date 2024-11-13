import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import useOrderService from '../../services/OrderService';
import Table from '../Table/Table';
import ListOrder from '../list-order/ListOrder';
import TestPage from '../TestPage/TestPage';
import { PDFDocument } from 'pdf-lib';
import './App.css';

function App() {

  const [orders, setOrders] = useState('');
  const [product, setProduct] = useState('');
  const [allProducts, setAllProducts] = useState('');
  const [date, setDate] = useState('');
  const [baskets, setBaskets] = useState();
  const [basketsProduct, setBasketsProduct] = useState();
  const [basketsCompl, setBasketsCompl] = useState();
  const [ordersWB, setOrdersWB] = useState([])
  const [logs, setLogs] = useState([])
  const [allOrders, setAllOrders] = useState([])
  const [stickersWB, setStickersWB] = useState([]);
  const [arrIdsWB, setArrIdWb] = useState([])
  const [productsForOrdersBarcode, setProductsForOrdersBarcode] = useState([])
  const { getAllOrders, 
          getInfoProducts, 
          getBaskets, 
          getAllProducts, 
          getAllOrdersWB, 
          getStickersWB, 
          getAllLogs, 
          getAllOrdersYandex, 
          getProductsForOrdersBarcode,
          getStickersWBCMA,
          getStickersWBMD,
          getAllOrdersWBCMA, 
          getAllOrdersWBMD,
          getAllOrdersWBArsenal,
          getStickersWBArsenal } = useOrderService();

 

  const formData = JSON.stringify({
    dir: 'ASC',
    filter: {
      cutoff_from: `${localStorage.data}T00:00:00.000Z`,
      cutoff_to: `${localStorage.data}T23:59:00Z`,
      delivery_method_id: [],
      provider_id: [],
      status: 'awaiting_deliver',
      warehouse_id: [],
    },
    limit: 200,
    offset: 0,
    with: {
      analytics_data: true,
      barcodes: true,
      financial_data: true,
      translit: true,
    }
}) 


useEffect(()=> {
  getProductsForOrdersBarcode().then(setProductsForOrdersBarcode)
}, [])
 
  useEffect(() => {
    onLoadingProducts(); 
  }, [localStorage.data]); 
   const headersOzon = {  
        'Client-Id': `${localStorage.clientId}` ,
        'Api-Key': `${localStorage.apiKey}`
     } 

     useEffect(()=> {
      const key = {
        'Client-Id': localStorage.clientId,
        'Api-Key': localStorage.apiKey
      }; 
      getAllLogs().then(logs =>{ 
        const data = localStorage.data
        const dateFrom = `${data}T00:00:00.000Z`
        const dateTo = `${data}T23:59:59Z`
        if( key['Client-Id'] == 1) {   
          getAllOrdersWB(dateFrom, dateTo, localStorage.apiKey).then(ordersWB => { 
 
            const res = ordersWB.map(item =>{  
              const filtRes = logs.find(log => log.comment == item.id) 
              
              if(filtRes){
                return{
                  ...item, packed: true
                }
              }else{
                return item
              }
            }) 
  
            getInfoProducts().then(allProducts => {
              // Перебираем заказы и сравниваем и фильтруя их по артикулам выводим их названия
              const resOrders = res.map(order => { 
                const resProd = allProducts.filter(product => product.article === order.article);
                if (resProd.length) {
                  // Создаем новый объект с обновленными данными
                  const updatedProduct = {
                    ...resProd[0], // Копируем свойства из существующего продукта
                    id: order.id,
                    warehouseId: order.warehouseId,
                    packed: order.packed
                  }; 
                  return updatedProduct;
                }
              });
               
              // Получаем id каждого заказа
              const arrId = resOrders.map(item => item.id) 

              getStickersWB(localStorage.apiKey, JSON.stringify({'orders':arrId})).then(stickers => { 
 
                stickers.forEach(sticker => {
                    // Ваша строка в кодировке base64
                    const base64String =  sticker.file
                    // Создаем бинарные данные из строки base64
                    const binaryString = atob(base64String);
                    const binaryLength = binaryString.length;
                    const bytes = new Uint8Array(binaryLength);
                    for (var i = 0; i < binaryLength; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }
            
                    // Создаем Blob из бинарных данных
                    const blob = new Blob([bytes], { type: 'image/png' });
            
                    // Создаем ссылку для загрузки изображения
                    const url = URL.createObjectURL(blob);
                     
                    setStickersWB(prevSticker => [...prevSticker, {url, id: sticker.partB}])
                })
            
            
                const readyOrders = resOrders.map(order => {
                  const result = stickers.filter(sticker => sticker.orderId === order.id);
              
                  if(result.length){
                      const obj = {
                          'id': result[0].orderId,
                          'name': order.name,
                          'article': order.article,
                          'stickerId': result[0].partB ,
                          'warehouseId': order.warehouseId,
                          'packed': order.packed
                      };
                      return obj;
                  } else {
                      // Если result пустой, не возвращаем ничего
                      return null;
                  }
              }).filter(order => order !== null); // Фильтруем, чтобы удалить все пустые элементы
              
                  setOrdersWB(readyOrders)
              })
            })  
          })
  
          
        }else if(localStorage.nameCompany === 'Яндекс' || localStorage.nameCompany === 'Яндекс КГТ'){
          getAllOrdersYandex(localStorage.clientId).then(data => {
            const processOrders = data.filter(item => item.status === 'PROCESSING' && 
                                                      item.delivery.shipments[0].shipmentDate === `${localStorage.data.slice(8, 10)}-${localStorage.data.slice(5, 7)}-${localStorage.data.slice(0, 4)}`) 
         
            const orders = processOrders.reduce((result, order) => {
                const orderItems = order.items.map(item => ({
                    postingNumber: order.id,
                    date: order.delivery.shipments[0].shipmentDate,
                    productArt: item.offerId,
                    productName: item.offerName,
                    quantity: item.count,
                    productPrice: item.price,
                    warehouse: 'Яндекс'
                }));
        
                return [...result, ...orderItems];
            }, []); 
            const res = orders.map(order => {
              const filtRes = logs.find(log => log.comment == order.postingNumber)
              if(filtRes){
                return{
                  ...order, packed: true
                }
              }else{
                return order
              }
  
            })
        setAllOrders(res);
        });
        }else if(localStorage.nameCompany === 'WBCMA'){
 
          getAllOrdersWBCMA(dateFrom, dateTo, localStorage.apiKey).then(ordersWB => { 
 
            const res = ordersWB.map(item =>{  
              const filtRes = logs.find(log => log.comment == item.id) 
              
              if(filtRes){
                return{
                  ...item, packed: true
                }
              }else{
                return item
              }
            }) 
  
            getInfoProducts().then(allProducts => {
              // Перебираем заказы и сравниваем и фильтруя их по артикулам выводим их названия
              const resOrders = res.map(order => { 
                const resProd = allProducts.filter(product => product.article === order.article);
                if (resProd.length) {
                  // Создаем новый объект с обновленными данными
                  const updatedProduct = {
                    ...resProd[0], // Копируем свойства из существующего продукта
                    id: order.id,
                    warehouseId: order.warehouseId,
                    packed: order.packed
                  }; 
                  return updatedProduct;
                }
              });
               
              // Получаем id каждого заказа
              const arrId = resOrders.map(item => item.id) 

              getStickersWBCMA(localStorage.apiKey, JSON.stringify({'orders':arrId})).then(stickers => { 
 
                stickers.forEach(sticker => {
                    // Ваша строка в кодировке base64
                    const base64String =  sticker.file
                    // Создаем бинарные данные из строки base64
                    const binaryString = atob(base64String);
                    const binaryLength = binaryString.length;
                    const bytes = new Uint8Array(binaryLength);
                    for (var i = 0; i < binaryLength; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }
            
                    // Создаем Blob из бинарных данных
                    const blob = new Blob([bytes], { type: 'image/png' });
            
                    // Создаем ссылку для загрузки изображения
                    const url = URL.createObjectURL(blob);
                     
                    setStickersWB(prevSticker => [...prevSticker, {url, id: sticker.partB}])
                })
            
            
                const readyOrders = resOrders.map(order => {
                  const result = stickers.filter(sticker => sticker.orderId === order.id);
              
                  if(result.length){
                      const obj = {
                          'id': result[0].orderId,
                          'name': order.name,
                          'article': order.article,
                          'stickerId': result[0].partB ,
                          'warehouseId': order.warehouseId,
                          'packed': order.packed
                      };
                      return obj;
                  } else {
                      // Если result пустой, не возвращаем ничего
                      return null;
                  }
              }).filter(order => order !== null); // Фильтруем, чтобы удалить все пустые элементы
              
                  setOrdersWB(readyOrders)
              })
            })  
          })
        }
        else if(localStorage.nameCompany === 'WBARSENAL'){
 
          getAllOrdersWBArsenal(dateFrom, dateTo, localStorage.apiKey).then(ordersWB => { 
 
            const res = ordersWB.map(item =>{  
              const filtRes = logs.find(log => log.comment == item.id) 
              
              if(filtRes){
                return{
                  ...item, packed: true
                }
              }else{
                return item
              }
            }) 
  
            getInfoProducts().then(allProducts => {
              // Перебираем заказы и сравниваем и фильтруя их по артикулам выводим их названия
              const resOrders = res.map(order => { 
                const resProd = allProducts.filter(product => product.article === order.article);
                if (resProd.length) {
                  // Создаем новый объект с обновленными данными
                  const updatedProduct = {
                    ...resProd[0], // Копируем свойства из существующего продукта
                    id: order.id,
                    warehouseId: order.warehouseId,
                    packed: order.packed
                  }; 
                  return updatedProduct;
                }
              });
               
              // Получаем id каждого заказа
              const arrId = resOrders.map(item => item.id) 

              getStickersWBArsenal(localStorage.apiKey, JSON.stringify({'orders':arrId})).then(stickers => { 
 
                stickers.forEach(sticker => {
                    // Ваша строка в кодировке base64
                    const base64String =  sticker.file
                    // Создаем бинарные данные из строки base64
                    const binaryString = atob(base64String);
                    const binaryLength = binaryString.length;
                    const bytes = new Uint8Array(binaryLength);
                    for (var i = 0; i < binaryLength; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }
            
                    // Создаем Blob из бинарных данных
                    const blob = new Blob([bytes], { type: 'image/png' });
            
                    // Создаем ссылку для загрузки изображения
                    const url = URL.createObjectURL(blob);
                     
                    setStickersWB(prevSticker => [...prevSticker, {url, id: sticker.partB}])
                })
            
            
                const readyOrders = resOrders.map(order => {
                  const result = stickers.filter(sticker => sticker.orderId === order.id);
              
                  if(result.length){
                      const obj = {
                          'id': result[0].orderId,
                          'name': order.name,
                          'article': order.article,
                          'stickerId': result[0].partB ,
                          'warehouseId': order.warehouseId,
                          'packed': order.packed
                      };
                      return obj;
                  } else {
                      // Если result пустой, не возвращаем ничего
                      return null;
                  }
              }).filter(order => order !== null); // Фильтруем, чтобы удалить все пустые элементы
              
                  setOrdersWB(readyOrders)
              })
            })  
          })
        }else if(localStorage.nameCompany === 'WBMD'){
 
          getAllOrdersWBMD(dateFrom, dateTo, localStorage.apiKey).then(ordersWB => { 
 
            const res = ordersWB.map(item =>{  
              const filtRes = logs.find(log => log.comment == item.id) 
              
              if(filtRes){
                return{
                  ...item, packed: true
                }
              }else{
                return item
              }
            }) 
  
            getInfoProducts().then(allProducts => {
              // Перебираем заказы и сравниваем и фильтруя их по артикулам выводим их названия
              const resOrders = res.map(order => { 
                const resProd = allProducts.filter(product => product.article === order.article);
                if (resProd.length) {
                  // Создаем новый объект с обновленными данными
                  const updatedProduct = {
                    ...resProd[0], // Копируем свойства из существующего продукта
                    id: order.id,
                    warehouseId: order.warehouseId,
                    packed: order.packed
                  }; 
                  return updatedProduct;
                }
              });
               
              // Получаем id каждого заказа
              const arrId = resOrders.map(item => item.id) 

              getStickersWBMD(localStorage.apiKey, JSON.stringify({'orders':arrId})).then(stickers => { 
 
                stickers.forEach(sticker => {
                    // Ваша строка в кодировке base64
                    const base64String =  sticker.file
                    // Создаем бинарные данные из строки base64
                    const binaryString = atob(base64String);
                    const binaryLength = binaryString.length;
                    const bytes = new Uint8Array(binaryLength);
                    for (var i = 0; i < binaryLength; i++) {
                        bytes[i] = binaryString.charCodeAt(i);
                    }
            
                    // Создаем Blob из бинарных данных
                    const blob = new Blob([bytes], { type: 'image/png' });
            
                    // Создаем ссылку для загрузки изображения
                    const url = URL.createObjectURL(blob);
                     
                    setStickersWB(prevSticker => [...prevSticker, {url, id: sticker.partB}])
                })
            
            
                const readyOrders = resOrders.map(order => {
                  const result = stickers.filter(sticker => sticker.orderId === order.id);
              
                  if(result.length){
                      const obj = {
                          'id': result[0].orderId,
                          'name': order.name,
                          'article': order.article,
                          'stickerId': result[0].partB ,
                          'warehouseId': order.warehouseId,
                          'packed': order.packed
                      };
                      return obj;
                  } else {
                      // Если result пустой, не возвращаем ничего
                      return null;
                  }
              }).filter(order => order !== null); // Фильтруем, чтобы удалить все пустые элементы
              
                  setOrdersWB(readyOrders)
              })
            })  
          })
        }
        else{
          getAllOrders(formData, key).then(orders => { 
           
              const res = orders.map(order => {
                const filtRes = logs.find(log => log.comment === order.postingNumber)
                if(filtRes){
                  return{
                    ...order, packed: true
                  }
                }else{
                  return order
                }
    
              })
         
              setAllOrders(res)
         
      })
        }
      })
         
    }, [localStorage.clientId]) 
  const onLoadingProducts = (data = localStorage.data) => {
 
    const arr = [];
 
      getAllOrders(formData, headersOzon).then(setOrders);
     
  };


 

  return (
 
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={<ListOrder 
                                            props={allOrders} 
                                            setAllOrders={setAllOrders}
                                            ordersWB={ordersWB}  
                                            setOrdersWB={setOrdersWB} 
                                            date={date} setDate={setDate} 
                                            onLoadingProducts={onLoadingProducts} 
                                            headersOzon={headersOzon} 
                                            stickersWB={stickersWB}  
                                            setStickersWB={setStickersWB}
                                            productsForOrdersBarcode={productsForOrdersBarcode}/>} />
        
        <Route path="/table" element={<Table basketsCompl={basketsCompl} props={product} date={date} setDate={setDate} onLoadingProducts={onLoadingProducts}  />} />
        
        <Route path="/test" element={<TestPage props={baskets} basketsProduct={basketsProduct} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
