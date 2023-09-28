import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import "./navbar.css";
import { Link, useLocation } from "react-router-dom";

function AdminNavbar() {
  const location = useLocation();
  return (
    <>
      <br />
      <Navbar bg="light" data-bs-theme="light">
        {/* <Navbar.Brand href="/admin" className="navbarmain">
          Admin Dashboard
        </Navbar.Brand> */}
        <Nav className="me-auto">
          <Link
            to="/admin"
            style={{ marginRight: "10px" }}
            className={` text-dark text-decoration-none ${
              location.pathname === "/admin" ? "navigation__link--active" : ""
            }`}
          >
            Admin Dashboard
          </Link>
          <Link
            to="/form"
            style={{ marginRight: "20px" }}
            className={` text-dark text-decoration-none ${
              location.pathname === "/form" ? "navigation__link--active" : ""
            }`}
          >
            Form
          </Link>
          {/* <Nav.Link href="/form">New Game</Nav.Link> */}
          <Link
            to="/user"
            style={{ marginRight: "20px" }}
            className={`navigation__link text-dark text-decoration-none ${
              location.pathname === "/user" ? "navigation__link--active" : ""
            }`}
          >
            User
          </Link>
          {/* <Nav.Link href="/user">User</Nav.Link> */}
          <Link
            to="/logout"
            className={`navigation__link text-dark text-decoration-none ${
              location.pathname === "/logout" ? "navigation__link--active" : ""
            }`}
          >
            Log out
          </Link>
          {/* <Nav.Link href="/logout">Logout</Nav.Link> */}
        </Nav>
      </Navbar>
    </>
  );
}

export default AdminNavbar;
