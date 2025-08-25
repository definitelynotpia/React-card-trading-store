import { ReactComponent as Logo } from "./logo-3.svg";
import './App.css';
// React
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Routes, Route, NavLink } from "react-router-dom";
// api
import api from './services/api';
// components
import { Container, Nav, Navbar, Button, Col } from "react-bootstrap";
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
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem("fetchedCards");
    return saved ? JSON.parse(saved) : [];
  });

  // when page scrolled on Home page, change navbar bg (transparent -> solid color)
  const [navbarBg, setNavbarBg] = useState(false);
  useEffect(() => {
    const changeNavbarBg = () => {
      if (window.scrollY >= 50) {
        setNavbarBg(true);
      } else {
        setNavbarBg(false);
      }
    };

    // attach listener
    window.addEventListener("scroll", changeNavbarBg);
  }, []);

  useEffect(() => {
    api.get('/cards?pageSize=16')
      .then(res => {
        const fetchedCards = res.data.data;
        setCards(fetchedCards); // `data.data` is the actual card array
        localStorage.setItem("fetchedCards", JSON.stringify(fetchedCards));
      })
      .catch(err => console.error('Error fetching cards:', err));
  }, []);

  return (
    <div>
      <Navbar
        className={`navbar ${navbarBg ? "bg-white" : ""}`}
        expand="lg"
        fixed="top"
      // data-bs-theme="light"
      >
        <Container fluid className="mx-4">
          <Col>
            <Navbar.Brand>
              <Logo width="10vw" alt="TradeBall" onClick={() => navigate("/")} />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
          </Col>

          <Col className="d-flex justify-content-center align-items-center">
            <Nav>
              <Nav.Link>
                <NavLink className="mx-2 text-black text-decoration-none" to="/">Explore</NavLink>
              </Nav.Link>
              <Nav.Link>
                <NavLink className="mx-2 text-black text-decoration-none" to="/trending">Trending</NavLink>
              </Nav.Link>
              <Nav.Link>
                <NavLink className="mx-2 text-black text-decoration-none" to="/shop">Shop</NavLink>
              </Nav.Link>
              <Nav.Link>
                <NavLink className="mx-2 text-black text-decoration-none" to="/auctions">Auctions</NavLink>
              </Nav.Link>
            </Nav>
          </Col>

          <Col className="d-flex justify-content-end align-items-end">
            <Button className="me-3 rounded-pill" variant="dark"><Nav.Link>
              <NavLink className="text-white text-decoration-none" to="/login">Login</NavLink>
            </Nav.Link></Button>
            <Button className="mw-3 rounded-pill" variant="dark"><Nav.Link>
              <NavLink className="text-white text-decoration-none" to="/register">Register</NavLink>
            </Nav.Link></Button>
          </Col>
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
