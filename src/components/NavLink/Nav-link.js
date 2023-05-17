import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React from "react";
import Form from "react-bootstrap/Form";
    
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';
import './Nav-link.scss';

const NavLink = ( {onLoadingProducts, date, setDate} ) => {
 
  const [show, setShow] = useState(false);
  // const [dateNav, setNavDate] = useState()

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
   
  const [data, setData] = useState('');
 
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
                <Form>
                  <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Введите данные</Form.Label>
                    <Form.Control type="number" placeholder="Client-Id" defaultValue={localStorage.clientId} onInput={(e) => {localStorage.setItem('clientId', e.target.value)}}/>

                  </Form.Group>

                  <Form.Group className="mb-3" controlId="formBasicPassword">

                    <Form.Control type="text" placeholder="Api-key"  defaultValue={localStorage.apiKey} onInput={(e) => {localStorage.setItem('apiKey', e.target.value)}}/>
                  </Form.Group>

                  <Button variant="primary"  onClick={() => {onLoadingProducts()}} type="submit">
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