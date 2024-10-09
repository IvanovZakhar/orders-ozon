import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React from "react";
import Form from "react-bootstrap/Form";
import Toast from 'react-bootstrap/Toast';
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import './Nav-link.scss';

const NavLink = ( {onLoadingProducts, getLabels, labels, setName, onGetStickersYandex, onDownlloadStickersYandex, stickersYandex, stickersWB, onDownlloadStickersWB} ) => {
  
  const [show, setShow] = useState(false);
  // const [dateNav, setNavDate] = useState()

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
    
  const apiData = localStorage.apiData ? JSON.parse(localStorage.apiData) : []
  const deletItem = (i) => { 
      const newData = apiData.filter(item => item.id !== i)
      console.log(newData)
      localStorage.apiData = JSON.stringify(newData) 
  }
  const setApiData = (item) => {
    localStorage.setItem('clientId', item.clientId)
    localStorage.setItem('apiKey', item.apiKey)
    localStorage.setItem('nameCompany', item.name)

  }
  const toasts = apiData.map((item, i) => {
    return(
      <Toast key={i} onClose={() => deletItem(item.id)} className={item.name === localStorage.nameCompany ? 'active': null}>
        <Toast.Header> 
          <strong className={item.name === localStorage.nameCompany ? 'active-text me-auto': 'me-auto'} onClick={() => setApiData(item)}>{item.name}</strong> 
        </Toast.Header>
        <Toast.Body>ClientID: {item.clientId}</Toast.Body>
    </Toast>
    )
  }) 
    return(

      <>
      <button className='button-nav'  onClick={handleShow}>
              V
      </button>
      <Offcanvas show={show} onHide={handleClose} placement='top'>
        <Offcanvas.Header closeButton>
         
          </Offcanvas.Header>
            <Offcanvas.Body>
            <Navbar bg="light" variant="light">
              
                  <Navbar.Brand href="/">Список заказов</Navbar.Brand>
                  <Nav className="me-auto">
                    <Nav.Link href="/table">Наряды</Nav.Link>
                  </Nav>
                
             
              
            </Navbar>

                
              <div className='forms'>
                <Form>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                      <Form.Label>Введите дату</Form.Label>
                      <Form.Control  type="date" defaultValue={localStorage.data} onInput={(e) => {localStorage.setItem('data', e.target.value)}}/>
                  </Form.Group>
                  
                    <Button variant="primary"  
                      onClick={() => onLoadingProducts()}
                      type="submit"
                    >
                    Ок
                    </Button>
                </Form>
                  <div className='labels'>
                      <Button className='labels-btn' onClick={() =>{
                       
                         if(localStorage.nameCompany === 'Яндекс' || localStorage.nameCompany === 'Яндекс КГТ'){
                          onGetStickersYandex()
                         }else if(localStorage.nameCompany === 'Арсенал' || localStorage.nameCompany === 'ЦМА' || localStorage.nameCompany === 'MD'){
                          getLabels()
                         }
                         }}> Получить наклейки</Button>
                          {stickersWB.length ?  <span onClick={() => onDownlloadStickersWB(stickersWB)}>Скачать WB </span> : null }
                      {stickersYandex.length ? <span onClick={onDownlloadStickersYandex}>Скачать Яндекс </span> : null}
                      {labels ? <span onClick={() => window.open(labels)}>Скачать Озон</span> : null}
                  </div>

                <div className='keys'>
                  {toasts}
                </div>


                <Form onSubmit={(e) => {
                  e.preventDefault()
                  const obj = {
                    id: apiData.length + 1,
                    name: e.target.elements[0].value,
                    clientId: e.target.elements[1].value,
                    apiKey: e.target.elements[2].value
                  }
                  localStorage.setItem('apiData', JSON.stringify([...apiData, obj]))
                }}>
                     
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Введите данные</Form.Label>
                  <Form.Control type="text" placeholder="Название" />
         
                  </Form.Group>
                  <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                  
                  <Form.Control type="number" placeholder="Client-Id" />

                </Form.Group>
                    <Form.Control type="text" placeholder="Api-key" />
                  </Form.Group>

                  <Button variant="primary"  onClick={(e) => {
                    console.log(e)
                    onLoadingProducts()}} type='submit'>
                    Submit
                  </Button>
              </Form>
              

              </div>
 
            </Offcanvas.Body>


         </Offcanvas>
        
      </>
    )
}
 

export default NavLink;

// import { useState } from 'react';
// import Button from 'react-bootstrap/Button';
// import Offcanvas from 'react-bootstrap/Offcanvas';

// function OffCanvasExample({ name, ...props }) {
//   const [show, setShow] = useState(false);

//   const handleClose = () => setShow(false);
//   const handleShow = () => setShow(true);
// console.log
//   return (
//     <>
//       <Button variant="primary" onClick={handleShow} className="me-2">
//         {name}
//       </Button>
//       <Offcanvas show={show} onHide={handleClose} {...props}>
//         <Offcanvas.Header closeButton>
//           <Offcanvas.Title>Offcanvas</Offcanvas.Title>
//         </Offcanvas.Header>
//         <Offcanvas.Body>
//           Some text as placeholder. In real life you can have the elements you
//           have chosen. Like, text, images, lists, etc.
//         </Offcanvas.Body>
//       </Offcanvas>
//     </>
//   );
// }

// function NavLink() {
//   return (
//     <>
//       {['top'].map((placement, idx) => (
//         <OffCanvasExample key={idx} placement={placement} name={placement} />
//       ))}
//     </>
//   );
// }

// export default NavLink;