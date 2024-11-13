import NavLink from '../NavLink/Nav-link';
import useOrderService from '../../services/OrderService';
import { useState, useEffect } from 'react';
import './ListOrder.scss'
import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { useBarcode } from 'next-barcode'; 
import {  PDFDocument, PDFName } from 'pdf-lib';
import { saveAs } from 'file-saver';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button'; 
import Modal from 'react-bootstrap/Modal'; 
import Image from 'react-bootstrap/Image';
import Table from 'react-bootstrap/Table';
import  { useRef } from 'react'; 
import { useReactToPrint } from 'react-to-print';

const ListOrder = ({allProducts, props, setAllOrders, onLoadingProducts, date, setDate, headersOzon, ordersWB,  setOrdersWB,stickersWB,  setStickersWB, productsForOrdersBarcode}) => { 
  console.log(allProducts)
    const {getLabelOzon, getStickersOrdersYandex, updateProductQuantity, loading, getPhotoProducts} = useOrderService()
    const [labels, setLabels] = useState();
    const [name, setName] = useState('')
    const [stickersYandex, setStickersYandex] = useState([])
    const [notReadyProducts, setNotReadyProducts] = useState([])
    const [requestPucked, setRequestPucked] = useState([])
    const [show, setShow] = useState(false);
    const [dataOrder, setDataOrder] =useState([])

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
            packed} = item;  
            const green = packed ? 'packed' : ''
           
            return(
                    <tr 
                      className={`list-order__item ${green}`} 
                      key={item.postingNumber} 
                      onClick={() => {setInfoOrder(productArt, postingNumber)}}
                    >

                          <td className='list-order__item'>{i+=1}</td>
                          <td className='list-order__item posting-number'>{postingNumber}</td>
                          <td className='list-order__item'>
                            {date.length > 10 ? 
                              `${date.slice(8, 10)}.${date.slice(5, 7)}.${date.slice(0, 4)}` : 
                              `${date.slice(0, 2)}.${date.slice(3, 5)}.${date.slice(6, 10)}`
                            }
                          </td>
                          <td className='productName list-order__item'>{productName}</td>
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

    function setInfoOrder(article, postingNumber){
      setDataOrder({article,postingNumber})
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
   

    function getLabels () {
        const postingNumbers = readySort ? readySort.map(obj => obj.postingNumber): null
    
        const body = {
            "posting_number": postingNumbers
        };
    
            
        getLabelOzon('https://api-seller.ozon.ru/v1/posting/fbs/package-label/create', 'POST', JSON.stringify(body), headersOzon)
        .then(data => { 
            const taskId = {
                "task_id": data.result.task_id
            }; 
    
            const interval = setInterval(() => {
                getLabelOzon('https://api-seller.ozon.ru/v1/posting/fbs/package-label/get', 'POST', JSON.stringify(taskId), headersOzon)
                    .then(res => { 
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


    async function onGetStickersYandex(objectsArray = sortedElemsSticker) { 
      const stickerURLs = []; // массив для собирания урлов стикеров в правильном порядке
      const campaignId = localStorage.clientId
       
  
    for (const prop of objectsArray) {
      try {
        const sticker = await getStickersOrdersYandex(prop.postingNumber, campaignId);
        console.log(sticker)
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
  
  console.log(imageUrls); // Проверяем, что получен правильный массив URL-адресов
  
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




  function renderContent() {
    console.log(loading)
    console.log(ordersWB)
    if (loading) {
      return <div className="loading-message">Загрузка данных, пожалуйста, подождите...</div>; // Сообщение о загрузке
    }
  
    if (!loading && !props.length && !ordersWB.length) {
      return <div className="no-orders-message">Заказы не найдены</div>; // Сообщение, если заказы не найдены
    }
  
    if (!loading && (props.length || ordersWB.length)) {
      return ordersWB.length 
        ? <PageWB ordersWB={ordersWB} deleteItemWB={deleteItemWB} /> 
        : <PageOZN elem={elem} productTotal={productTotal} dateOrders={dateOrders} />;
    }
  
    return null;
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

            {requestPucked.map(item => {
              return (
                <Alert variant="success" style={{marginTop: '20px'}}> 
                   {`Продукт ${item.article} обновлен`}
              </Alert>
              )
            })}
            <ModalOrder dataOrder={dataOrder} show={show} handleClose={handleClose}/>
        </>
    )
    }

const PageOZN = ({elem, productTotal, dateOrders}) => {
    
    return(
        <>
               
                <table className="list-order" id='list-order'>
                    <thead>
                        <tr className='list-order__item'>
                            <th className='list-order__item'>№</th>
                            <th className='list-order__item'>Номер отправления</th>
                            <th className='list-order__item'>Дата отгрузки</th>
                            {/* <th className='list-order__item date'>{dateOrders.length > 10 ? 
                                                        `${dateOrders.slice(8, 10)}.${dateOrders.slice(5, 7)}.${dateOrders.slice(0, 4)}` : 
                                                        `${dateOrders.slice(0, 2)}.${dateOrders.slice(3, 5)}.${dateOrders.slice(6, 10)}`}</th> */}
                            <th className='list-order__item date'><input type='date'/></th>
                            <th className='art list-order__item'>Артикул</th>
                            <th className='list-order__item'>Стоимость</th>
                            <th className='list-order__item'>Кол-во шт.</th>
                            <th className='list-order__item'>Склад</th>
                            <th className='list-order__item'>Дейст.</th>
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

const PageWB = ({ordersWB, deleteItemWB}) => {  
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
                            <th className='list-order__item'>Дейст.</th>
                        </tr>
                    </thead>
                    <tbody>
                      {ordersWB.map((order, i) => (
                        <tr className='list-order__item' key={order.id} style={{backgroundColor: order.packed ? 'green' : 'transparent'}}>
                          <td className='list-order__item'>{i+1}</td>
                          <td className='list-order__item posting-number'>
                            <Barcode barcodeOrders={`WB${order.id}`} />
                          </td>
                          <td className='list-order__item'>{order.stickerId}</td>
                          <td className='productName list-order__item'>{order.name}</td>
                          <td className='list-order__item'>{order.article}</td>
                          <td className='list-order__item'>1</td>
                          <td className='warehouse list-order__item'>
                            {order.warehouseId === 1088352 || order.warehouseId === 1129665 ? "Уткина заводь" : "Шушары"}
                          </td>
                          <td className='cross_item' onClick={() => deleteItemWB(order.id, order.stickerId)}>x</td>
                        </tr>
                      ))}
                    </tbody>

                
                </table>
            
  

        </>
    )
}

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

const ModalOrder = ({ dataOrder, handleClose, show }) => {
  const { article, postingNumber, name, photo, Column22, Column14, Column15, Column16, Column17, Column18, Column19, Column20 } = dataOrder;
  
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,  // Передача ref правильно здесь
    documentTitle: 'Order Details',
  });

  return (
    <Modal size='lg' show={show} onHide={handleClose} aria-labelledby="example-modal-sizes-title-lg">
      <PrintableContent
        ref={printRef}  // Передаем ref здесь
        article={article}
        postingNumber={postingNumber}
        name={name}
        photo={photo}
        Column22={Column22}
        Column14={Column14}
        Column15={Column15}
        Column16={Column16}
        Column17={Column17}
        Column18={Column18}
        Column19={Column19}
        Column20={Column20}
      />
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Закрыть
        </Button>
        <Button variant="primary" onClick={handlePrint}>
          Печать
        </Button>
      </Modal.Footer>
    </Modal>
  );
};


 


export default ListOrder;