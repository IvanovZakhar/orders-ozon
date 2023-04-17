import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import React from "react";
 
import './Nav-link.scss';

const NavLink = () => {
  
  

    return(
        <Navbar bg="dark" variant="dark">
        <Container>
        
          <Nav className="me-auto">
            <Nav.Link href="/table">Table</Nav.Link>
            <Nav.Link href="/list-order">List order</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    )
}

export default NavLink;