import logo from './logo.svg';
import './App.css';
// React
import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Routes, Route, NavLink } from "react-router-dom";
// api
import api from './services/api';
// Bootstrap components (navbar)
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
// App screens
import Home from './screens/Home';
import Login from './screens/Login';
import Register from './screens/Register';
import Store from './screens/Store';

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
        sticky="top"
        className="navbar border-bottom border-light-subtle"
        style={{ height: "10vh" }}
        data-bs-theme="light"
        bg="light"
      >
        <Container fluid>
          <Navbar.Brand>
            <img
              src={logo}
              height="35vh"
              alt="React Bootstrap logo"
              onClick={() => navigate("/")}
            />
            <b>TradeBall</b>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse>
            <Nav>
              <Nav.Link>
                <NavLink to="/">HOME</NavLink>
              </Nav.Link>
              <Nav.Link>
                <NavLink to="/store">STORE</NavLink>
              </Nav.Link>
              <Nav.Link>
                <NavLink to="/login">LOGIN</NavLink>
              </Nav.Link>
              <Nav.Link>
                <NavLink to="/register">REGISTER</NavLink>
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <header>
        <Routes>
          <Route path="/" element={<Home cards={cards} />}></Route>
          <Route path="/store" element={<Store />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>

          {/* error */}
          <Route path="*" element={<p>Not found</p>} />
        </Routes>
      </header>
    </div>
  );
}

export default App;
