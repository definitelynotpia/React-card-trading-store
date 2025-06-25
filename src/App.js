import { ReactComponent as Logo } from "./logo.svg";
import './App.css';
// React
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Routes, Route, NavLink } from "react-router-dom";
// api
import api from './services/api';
// components
import { Container, Nav, Navbar, Button } from "react-bootstrap";
// App screens
import Explore from './screens/Explore';
import Trending from './screens/Trending';
import Shop from './screens/Shop';
import Auctions from './screens/Auctions';
import Login from './screens/Login';
import Register from './screens/Register';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [cards, setCards] = useState([]);

  useEffect(() => {
    api.get('/cards?pageSize=16')
      .then(res => {
        setCards(res.data.data); // `data.data` is the actual card array
      })
      .catch(err => console.error('Error fetching cards:', err));
  }, []);

  return (
    <div>
      <Navbar
        expand="lg"
        fixed="top"
        className="navbar mx-4"
        style={{ height: "12vh" }}
        data-bs-theme="light"
      // bg="light"
      >
        <Container fluid>
          <Navbar.Brand>
            <Logo width="10vw" alt="TradeBall" onClick={() => navigate("/")} />
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse className="d-flex justify-content-center align-items-center">
            <Nav>
              <Nav.Link>
                <NavLink className="mx-2" style={{ color: "#5AA1AA", textDecoration: "none" }} to="/">Explore</NavLink>
              </Nav.Link>
              <Nav.Link>
                <NavLink className="mx-2" style={{ color: "#5AA1AA", textDecoration: "none" }} to="/trending">Trending</NavLink>
              </Nav.Link>
              <Nav.Link>
                <NavLink className="mx-2" style={{ color: "#5AA1AA", textDecoration: "none" }} to="/shop">Shop</NavLink>
              </Nav.Link>
              <Nav.Link>
                <NavLink className="mx-2" style={{ color: "#5AA1AA", textDecoration: "none" }} to="/auctions">Auctions</NavLink>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>

          <Button className="me-2 navbar-button rounded-pill"><Nav.Link>
            <NavLink style={{ color: "white", textDecoration: "none" }} to="/login">Login</NavLink>
          </Nav.Link></Button>
          <Button className="mw-2 navbar-button rounded-pill"><Nav.Link>
            <NavLink style={{ color: "white", textDecoration: "none" }} to="/register">Register</NavLink>
          </Nav.Link></Button>
        </Container>
      </Navbar>

      <header>
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>

          <Route path="/" element={<Explore cards={cards} />}></Route>
          <Route path="/trending" element={<Login />}></Route>
          <Route path="/shop" element={<Shop />}></Route>
          <Route path="/auctions" element={<Login />}></Route>

          {/* error */}
          <Route path="*" element={<p>Not found</p>} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
