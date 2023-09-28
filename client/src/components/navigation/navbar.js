import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

function NavigationBar() {
  return (
    <Navbar bg="light" expand="lg">
      <Navbar.Brand href="#home">Trivia App Admin</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link href="#dashboard">Dashboard</Nav.Link>
          <Nav.Link href="#questions">Questions</Nav.Link>
          <Nav.Link href="#categories">Categories</Nav.Link>
          <Nav.Link href="#difficulty">Difficulty</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default NavigationBar;