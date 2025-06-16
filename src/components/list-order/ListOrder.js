import NavLink from '../NavLink/Nav-link';
import useOrderService from '../../services/OrderService';
import { useState, useEffect } from 'react';
import './ListOrder.scss'
import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useBarcode } from 'next-barcode'; 
import {  error, PDFDocument, PDFName } from 'pdf-lib';
import { saveAs } from 'file-saver';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button'; 
import Modal from 'react-bootstrap/Modal'; 
import Image from 'react-bootstrap/Image';
import Table from 'react-bootstrap/Table';
import  { useRef } from 'react'; 
import { useReactToPrint } from 'react-to-print';
import ModalOrder from './components/ModalOrder'; 
import OrderTableWB from './components/OrderTableWB';
import PageOZN from './components/PageOZN';

const ListOrder = ({allProducts, props, setAllOrders, onLoadingProducts, date, setDate, headersOzon, ordersWB,  setOrdersWB,stickersWB,  setStickersWB, productsForOrdersBarcode, ordersMega}) => { 
 
    const {getLabelOzon, getStickersOrdersYandex, updateProductQuantity, loading, getPhotoProducts, updateOzonOrders} = useOrderService()
    const [labels, setLabels] = useState();
    const [name, setName] = useState('')
    const [stickersYandex, setStickersYandex] = useState([])
    const [notReadyProducts, setNotReadyProducts] = useState([])
    const [requestPucked, setRequestPucked] = useState([])
    const [show, setShow] = useState(false);
    const [dataOrder, setDataOrder] =useState([])
    const [ordersDelivery, setOrdersDelivery] = useState([])
    const [errorInput, setErrorInput] = useState(false)
    const [dateInput, setDateInput] = useState('')
    const ordersDeliveryRef = useRef(ordersDelivery); 

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    

    useEffect(() => {
      const notReadyProducts = props.filter(prop => !prop.packed)
      const notReadyProductsWB = ordersWB.filter(prop => !prop.packed)


      const res = notReadyProducts.flatMap(order => {
          const product = productsForOrdersBarcode.filter(product => product.article == order.productArt) 
          if(product.length){
           return product[0].orders.map(orderProd => { 
              const quantity = orderProd.quantity * order.quantity 
              return{
                ...orderProd, 
                postingNumber: order.postingNumber,
                quantity 
              }
            })
           
          }
      })

      const resWb = notReadyProductsWB.flatMap(order => {
        const product = productsForOrdersBarcode.filter(product => product.article == order.article) 
        if(product.length){
         return product[0].orders.map(orderProd => { 
            const quantity = orderProd.quantity * 1
            return{
              ...orderProd, 
              postingNumber: order.id,
              quantity 
            }
          })
         
        }
    }) 
     res.length ? setNotReadyProducts(res) : setNotReadyProducts(resWb)

    }, [props, ordersWB ])

    const handleKeyDown = (event) => {
      if (event.ctrlKey && (event.key === 'p' || event.key === 'з')) {
       
        if (ordersWB.length || props[0]?.warehouse === 'Яндекс') {
          return; // Если условия выполняются, ничего не делаем
        }
        event.preventDefault(); // Отключаем стандартное действие Ctrl + P (печать)
    
        // Проверяем, что массив не пустой и первый элемент имеет дату
        if (!ordersDeliveryRef.current.length || !ordersDeliveryRef.current[0]?.deliveryDate) {
          console.log('Дата доставки не задана или массив пуст. Логика отключена.');
          setErrorInput(true);
          return;
        }
    
        console.log('Ctrl + P была нажата');
        setErrorInput(false);
    
        // Отправляем обновленные данные
        updateOzonOrders(ordersDeliveryRef.current)
          .then(() => {
            console.log('Данные успешно обновлены');
            // После обновления вызываем печать
            setTimeout(() => {
              window.print();
            }, 500); // Небольшая задержка для завершения обновления состояния
          })
          .catch((error) => {
            console.error('Ошибка при обновлении данных:', error);
          });
      }
    };
    
    
    useEffect(() => {
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [ordersWB, props]);

 
    function puckedProducts (){
      notReadyProducts.forEach(product => { 
        updateProductQuantity({ comment: `${product.postingNumber}`, productsToUpdate: [product] })
          .then(res => { 
            setRequestPucked(prevRequest =>  [...prevRequest, res[0]])})
          .catch(er => console.log(er)) 
      }) 
    } 

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
            status, deliveryDate, shipmentDate} = item;   
            const statusPacked =  deliveryDate  ? 'awaiting_packed': null  
            console.log(shipmentDate)
            return(
                    <tr 
                      className={`list-order__item ${status} ${statusPacked}`} 
                      key={item.postingNumber} 
                     
                    >

                          <td className='list-order__item'>{i+=1}</td>
                          <td className='list-order__item posting-number'>{postingNumber}</td>
                          <td className='list-order__item'>
                            {date.length > 10 ? 
                              `${date.slice(8, 10)}.${date.slice(5, 7)}.${date.slice(0, 4)}` : 
                              `${date.slice(0, 2)}.${date.slice(3, 5)}.${date.slice(6, 10)}`
                            }
                          </td>
                          <td className='productName list-order__item'  onClick={() => {setInfoOrder(productArt, postingNumber)}}>{productName}</td>
                          <td className='list-order__item'>{productArt}</td>
                          <td className='list-order__item'>
                            {productPrice.length > 7 ? productPrice.slice(0, -5) : productPrice}
                          </td>
                          <td className='list-order__item'>{quantity}</td>
                          <td className='warehouse list-order__item'>{warehouse.slice(0, 8)}</td>
                          <td 
                            className='cross_item' 
                            onClick={(event) => {
                              event.stopPropagation(); // предотвращаем всплытие события
                              deleteItemOzon(item.postingNumber);
                            }}
                          >
                            x
                          </td>
                    </tr> 
            )
    }) : null;

    function setInfoOrder(article){
      handleShow() 
      const product = allProducts.find(product => product.article === article)
      getPhotoProducts(article).then(productPhoto => {
        setDataOrder({
          ...product,
          photo: productPhoto[0].main_photo_link 
        })
      })
    }
    
    const sortedElemsSticker = removeDuplicatesByProperty(readySort, 'postingNumber')


    function removeDuplicatesByProperty(array, propertyName) {
      const unique = array.reduce((acc, current) => {
        const x = acc.find(item => item[propertyName] === current[propertyName]);
        if (!x) {
          return acc.concat([current]);
        } else {
          return acc;
        }
      }, []);
      return unique;
    }
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
   

      function getLabels() {
        const postingNumbers = readySort ? readySort.map(obj => obj.postingNumber) : null;
    
        if (!postingNumbers || postingNumbers.length === 0) {
            console.warn('Нет номеров заказов для генерации ярлыков');
            return;
        }
    
        getLabelOzon(postingNumbers, headersOzon)
            .then(() => {
                console.log('Ярлыки успешно получены и открыты');
            })
            .catch(error => {
                console.error('Ошибка при получении ярлыков:', error.message);
            });
    }
    


    async function onGetStickersYandex(objectsArray = sortedElemsSticker) { 
      const stickerURLs = []; // массив для собирания урлов стикеров в правильном порядке
      const campaignId = localStorage.clientId
       
  
    for (const prop of objectsArray) {
      try {
        const sticker = await getStickersOrdersYandex(prop.postingNumber, campaignId); 
        if (!sticker.ok) {
          throw new Error('Failed to download file');
        }
     
        const contentType = sticker.headers.get('Content-Type');
        const blob = await sticker.blob();
        const url = window.URL.createObjectURL(blob);
        stickerURLs.push(url); // сохраняем URL в массив
        // setStickersYandex(prevSticker => [...prevSticker, url]);
      } catch (error) {
        console.error(error); // обработка ошибок запроса
      }
    }
  
    // здесь можно вызвать setStickersYandex один раз для всего массива URL
    setStickersYandex(stickerURLs);
  }
  

async function mergePDFs(pdfUrls) {
  const mergedPdf = await PDFDocument.create();

  for (const url of pdfUrls) {
      const pdfBytes = await fetch(url).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);

      const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach(page => {
          mergedPdf.addPage(page);
      });
  }

  return mergedPdf;
}
 

const onDownlloadStickersYandex = () => { 
  mergePDFs(stickersYandex).then(mergedPdf => {
    mergedPdf.saveAsBase64({ dataUri: true }).then(function(base64DataUri) {
        const a = document.createElement('a');
        a.href = base64DataUri;
        a.download = 'merged_document.pdf';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        console.log('Объединенный PDF-документ успешно сохранен.');
    }).catch(error => {
        console.error('Произошла ошибка при сохранении PDF-документа:', error);
    });
}).catch(error => {
    console.error('Произошла ошибка при объединении PDF-документов:', error);
});
}
   
async function createPDFFromImages(imageUrls) {
  const pdfDoc = await PDFDocument.create();

  for (const url of imageUrls) {
    const imgBytes = await fetch(url).then(res => res.arrayBuffer());
    const img = await pdfDoc.embedPng(imgBytes);
    
    // Создаем новую страницу для каждого изображения с размерами 58x40 миллиметров
    const page = pdfDoc.addPage([58 * 2.83, 40 * 2.83]);
    
    // Масштабируем изображение, чтобы оно влезло на страницу
    const scaleFactor = Math.min(58 * 2.83 / img.width, 40 * 2.83 / img.height);
    const imgWidth = img.width * scaleFactor;
    const imgHeight = img.height * scaleFactor;
    
    // Размещаем изображение по центру страницы
    page.drawImage(img, {
        x: (58 * 2.83 - imgWidth) / 2,
        y: (40 * 2.83 - imgHeight) / 2,
        width: imgWidth,
        height: imgHeight,
    });
}

  // Возвращаем буфер PDF-документа
  return await pdfDoc.save();
}

 

const onDownlloadStickersWB = (imageObjects = stickersWB) => {
  const imageUrls = imageObjects.map(imageObj => imageObj.url); 
  
  createPDFFromImages(imageUrls).then(pdfBytes => {
    // Скачиваем PDF-документ
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, 'merged_document.pdf');
  }).catch(error => {
    console.error('Произошла ошибка при создании PDF-документа:', error);
  });
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
   const dateOrders = props[0] ? props[0].date : 'Нет отправлений';
  

  function deleteItemWB (id, stickerId){
    setOrdersWB(ordersWB.filter(item => item.id !== id))
    setStickersWB(stickersWB.filter((sticker) => sticker.id !== stickerId)) 
  } 

  function deleteItemOzon (postingNumber){
    setAllOrders(prevOrders => {
      return prevOrders.filter(item => item.postingNumber != postingNumber)
    })
  }

  const addedDeliveryDateOzn = (date, data) => {
    setDateInput(date)
    const newOrders = data.map(order => ({
      ...order,
      deliveryDate: date,
    })); 
    setOrdersDelivery(newOrders);
    ordersDeliveryRef.current = newOrders; // Обновляем ref, чтобы он всегда содержал актуальные данные
  };





  function renderContent() { 
    if (loading) {
      return <div className="loading-message">Загрузка данных, пожалуйста, подождите...</div>; // Сообщение о загрузке
    }
  
    if (!loading && !props.length && !ordersWB.length && !ordersMega.length) {
      return <div className="no-orders-message">Заказы не найдены</div>; // Сообщение, если заказы не найдены
    }
  
    if (!loading && (props.length || ordersWB.length)) {
      return ordersWB.length 
        ? <OrderTableWB
        ordersWB={ordersWB}
        deleteItemWB={deleteItemWB}
        setInfoOrder={setInfoOrder}
      />
      
        : <PageOZN 
              elem={elem} 
              productTotal={productTotal} 
              dateOrders={dateOrders} 
              addedDeliveryDateOzn={addedDeliveryDateOzn} 
              props={props} 
              errorInput={errorInput}
              dateInput={dateInput}/>;
    }

    if (!loading && (ordersMega.length)) {
      return <PageMega ordersMega={ordersMega} setInfoOrder={setInfoOrder}/>
    }
  
    return null;
  }
  const dateOn = localStorage.data

  // Получение текущей даты
  const today = new Date();

    // Функция для форматирования даты в чч.мм.гг
    function formatDate(date) {
      const day = String(date.getDate()).padStart(2, '0');        // День
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Месяц (0-11)
      const year = String(date.getFullYear()).slice(-2);          // Последние 2 цифры года
      return `${day}.${month}.${year}`;
    }

    function formatDateOn(date) {
      const day = date.slice(8,10)       // День
      const month =  date.slice(5,7) // Месяц (0-11)
      const year = date.slice(2,4)     // Последние 2 цифры года
      return `${day}.${month}.${year}`;
    }
    
    return(
        <>
             <NavLink onLoadingProducts={onLoadingProducts} 
                      date={date} 
                      setDate={setDate} 
                      getLabels={getLabels} 
                      labels={labels} 
                      setName={setName} 
                      onGetStickersYandex={onGetStickersYandex} 
                      onDownlloadStickersYandex={onDownlloadStickersYandex} 
                      stickersYandex={stickersYandex}
                      stickersWB={stickersWB}
                      onDownlloadStickersWB={onDownlloadStickersWB}/>
              <div id="canvas">
                <h1>{localStorage.nameCompany}</h1>
                {renderContent()}
            </div>
            <div className='buttons'>  
              <Button onClick={puckedProducts} variant="outline-success">Упаковать товары</Button> 
            </div>
            <div className='date-info'>
              <p>{ `Дата заказов: ${formatDateOn(dateOn)}` }</p>
              <p>{`Дата печати: ${formatDate(today)}`}</p>
            </div>
            {requestPucked.map(item => {
              return (
                <Alert variant="success" style={{marginTop: '20px'}}> 
                   {`Продукт ${item.article} обновлен`}
              </Alert>
              )
            })}
             <ModalOrder dataOrder={dataOrder} show={show} handleClose={handleClose} />
        </>
    )
    }

// const PageOZN = ({elem, productTotal, dateOrders, addedDeliveryDateOzn, props, errorInput, dateInput}) => {
    
//     return(
//         <>
               
//                 <table className="list-order" id='list-order'>
//                     <thead>
//                         <tr className='list-order__item'>
//                             <th className='list-order__item'>№</th>
//                             <th className='list-order__item'>Номер отправления</th>
//                             <th className='list-order__item'>Дата отгрузки</th>
//                             {/* <th className='list-order__item date'>{dateOrders.length > 10 ? 
//                                                         `${dateOrders.slice(8, 10)}.${dateOrders.slice(5, 7)}.${dateOrders.slice(0, 4)}` : 
//                                                         `${dateOrders.slice(0, 2)}.${dateOrders.slice(3, 5)}.${dateOrders.slice(6, 10)}`}</th> */}
//                             <th className='list-order__item date'>
//                               <input
//                                 type="date"
//                                 value={dateInput}
//                                 onChange={(e) => addedDeliveryDateOzn(e.target.value, props)}
//                                 style={{ border: `${errorInput ? '3px solid red': ''}` }} // Укажите стиль корректно как объект
//                               />
//                             </th>
//                             <th className='art list-order__item'>Артикул</th>
//                             <th className='list-order__item'>Стоимость</th>
//                             <th className='list-order__item'>Кол-во шт.</th>
//                             <th className='list-order__item'>Склад</th>
//                             <th className='list-order__item'>Дейст.</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {elem}
                        
//                     </tbody>
                
//                 </table>
            
//                 <table className="list-order" id='list-order'>
//                     <h2>Итого</h2>
//                     <thead>
//                         <tr className='list-order__item'>
//                             <th className='list-order__item'>Артикул</th> 
//                             <th className='list-order__item'>Название</th>
//                             <th className='list-order__item'>Кол-во</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {productTotal}
//                     </tbody>

//                 </table>

//         </>
//     )
// }

 

// const PageMega = ({ordersMega, setInfoOrder}) => {   
//   const Barcode = ({barcodeOrders}) => {
//       const options = {
//           value: `${barcodeOrders}`,
//           options: {
//             background: '#ffffff',
//             height: '50',
//             width: '2', 
//             display: 'flex',
//             justifyContent: 'center', 
//           }
//         };
//       const { inputRef } = useBarcode(options);
    
//       return <svg className='barcode' ref={inputRef} style={  {
//           display: 'block',
//           margin: '0 auto',
//           textAlign: 'center'
//         }}/>;
//     };
//     console.log(ordersMega)
//     const {date} = ordersMega[0]
//   return(
//       <>
             
//               <table className="list-order" id='list-order'>
//                   <thead>
//                       <tr className='list-order__item'>
//                           <th className='list-order__item'>№</th>
//                           <th className='list-order__item'>Номер отправления</th> 
//                           <th className='list-order__item date'>{`${date.slice(8, 10)}.${date.slice(5, 7)}.${date.slice(0, 4)}`}</th>
//                           <th className='art list-order__item'>Артикул</th> 
//                           <th className='list-order__item'>Кол-во шт.</th>
//                           <th className='list-order__item'>Склад</th>
//                           <th className='list-order__item'>Дейст.</th>
//                       </tr>
//                   </thead>
//                   <tbody>
//                     {ordersMega.map((order, i) => (
//                       <tr className={`${order.packed ? 'list-order__item packed' : 'list-order__item'}`}
//                       onClick={() => {console.log(order.article) 
//                         setInfoOrder(order.article)}}
//                       key={order.id}   >
//                         <td className='list-order__item'>{i+1}</td>
//                         <td className='list-order__item posting-number'>
//                           <Barcode barcodeOrders={`${order.orderId}`} />
//                         </td> 
//                         <td className='productName list-order__item'>{order.name}</td>
//                         <td className='list-order__item'>{order.article}</td>
//                         <td className='list-order__item'>1</td>
//                         <td className='warehouse list-order__item'>
//                           Самовывоз
//                         </td>
//                         <td className='cross_item' onClick={(event) => { 
//                           event.stopPropagation(); // предотвращаем всплытие события
//                           deleteItemWB(order.id, order.stickerId)}}>x</td> 
//                       </tr>
//                     ))}
//                   </tbody>

              
//               </table>
          


//       </>
//   )
// }

const PrintableContent = React.forwardRef((props, ref) => {
  const { article, postingNumber, name, photo, Column22, Column14, Column15, Column16, Column17, Column18, Column19, Column20 } = props;

  return (
    <div ref={ref}>
      <Modal.Header closeButton>
        <Modal.Title id="example-modal-sizes-title-lg">
          {`${name}`} <br />
          {`Цвет: ${Column22}`}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Image src={photo} fluid />
        <Table striped="columns">
          <thead>
            <tr>
              <th>№</th>
              <th>Комплектация</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>1</td><td>{Column14}</td></tr>
            <tr><td>2</td><td>{Column15}</td></tr>
            <tr><td>3</td><td>{Column16}</td></tr>
            <tr><td>4</td><td>{Column17}</td></tr>
            <tr><td>5</td><td>{Column18}</td></tr>
            <tr><td>6</td><td>{Column19}</td></tr>
            <tr><td>7</td><td>{Column20}</td></tr>
          </tbody>
        </Table>
      </Modal.Body>
    </div>
  );
}); 


 


export default ListOrder;