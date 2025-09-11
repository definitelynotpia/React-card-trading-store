import { ReactComponent as Logo } from "./logo-3.svg";
import { ReactComponent as FooterLogo } from "./logo-1.svg";
import * as Icon from 'react-bootstrap-icons';
import './App.css';
// React
import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Routes, Route, NavLink } from "react-router-dom";
// api
import api from './services/api';
// components
import { Container, Nav, Navbar, Dropdown, Button, Row, Col } from "react-bootstrap";
// App screens
import Home from "./screens/Home";
import Explore from './screens/Explore';
import Login from './screens/Login';
import Register from './screens/Register';

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  // temp auth
  const [isLogin, setIsLogin] = useState(false);
  const [isSeller, setIsSeller] = useState(false);
  // fetch data and cards from api or memory
  const [rarities, setRarities] = useState(() => {
    const saved = localStorage.getItem("fetchedCardRarities");
    return saved ? JSON.parse(saved) : [];
  });
  const [types, setTypes] = useState(() => {
    const saved = localStorage.getItem("fetchedCardTypes");
    return saved ? JSON.parse(saved) : [];
  });
  const [sets, setSets] = useState(() => {
    const saved = localStorage.getItem("fetchedCardSets");
    return saved ? JSON.parse(saved) : [];
  });
  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem("fetchedCards");
    return saved ? JSON.parse(saved) : [];
  });

  // when page scrolled on Home page, change navbar bg (transparent -> solid color)
  const [navbarBg, setNavbarBg] = useState(false); useEffect(() => {
    const changeNavbarBg = () => { if (window.scrollY >= 50) { setNavbarBg(true); } else { setNavbarBg(false); } };
    // attach listener
    window.addEventListener("scroll", changeNavbarBg);
  }, []);

  // get 16 cards
  useEffect(() => {
    api.get('/cards?pageSize=16')
      .then(res => {
        const fetchedCards = res.data.data;
        setCards(fetchedCards); // `data.data` is the actual card array
        localStorage.setItem("fetchedCards", JSON.stringify(fetchedCards));
      })
      .catch(err => console.error('Error fetching cards:', err));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [raritiesRes, typesRes, setsRes] = await Promise.all([
          api.get("/rarities"),
          api.get("/types"),
          api.get("/sets"),
        ]);

        // rarities
        const fetchedCardRarities = raritiesRes.data.data || raritiesRes.data;
        setRarities(raritiesRes.data.data || raritiesRes.data);
        localStorage.setItem("fetchedCardRarities", JSON.stringify(fetchedCardRarities));
        // types
        const fetchedCardTypes = typesRes.data.data || typesRes.data;
        setTypes(typesRes.data.data || typesRes.data);
        localStorage.setItem("fetchedCardTypes", JSON.stringify(fetchedCardTypes));
        // sets
        const fetchedCardSets = setsRes.data.data || setsRes.data;
        setSets(setsRes.data.data || setsRes.data);
        localStorage.setItem("fetchedCardSets", JSON.stringify(fetchedCardSets));
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchData();
  }, []);

  // login logout
  const handleAuthToggle = () => {
    setIsLogin((prev) => {
      // toggle state of temp auth
      const authState = !prev;
      // state persistence of user auth (simulation only)
      localStorage.setItem("isLogin", authState); // persist
      return authState;
    });
    navigate("/");
  };

  return (
    <div>
      <Navbar
        className={`navbar ${navbarBg ? "nav-bg" : ""}`}
        expand="lg"
        fixed="top"
      >
        <Container fluid className="mx-4">
          <Col>
            <Navbar.Brand>
              <Logo width="10vw" alt="TradeBall" onClick={() => navigate("/")} className="clickable-image m-0 p-0" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
          </Col>

          <Col>
            <Nav className="d-flex justify-content-center align-items-center">
              <Nav.Link>
                <NavLink className="mx-2 text-black text-decoration-none" to="/">Home</NavLink>
              </Nav.Link>
              <Nav.Link>
                <NavLink className="mx-2 text-black text-decoration-none" to="/explore">Explore</NavLink>
              </Nav.Link>
            </Nav>
          </Col>

          <Col className="d-flex justify-content-end align-items-center">
            <Icon.Search size={20} />
            {isLogin ? <>
              <Icon.Heart size={20} className="ms-3" />
              <Icon.Chat size={20} className="ms-3" />
              <Icon.Bell size={20} className="ms-3" />
              <Icon.Cart size={20} className="mx-3" />
              <Button className="me-2 rounded-pill outline-btn"><Nav.Link>
                {/* <NavLink className="text-decoration-none" to="">Be a Seller</NavLink> */}
                <div onClick={() => isSeller ? setIsSeller(false) : setIsSeller(true)}>
                  {isSeller ? "Shop Manager" : "Be a Seller"}
                </div>
              </Nav.Link></Button>
              <Dropdown>
                <Dropdown.Toggle className="navbar-btn rounded-pill" variant="dark">Profile</Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href="#/action-1">My Profile</Dropdown.Item>
                  <Dropdown.Item href="#/action-2">Settings</Dropdown.Item>
                  <Dropdown.Item onClick={handleAuthToggle}>Logout</Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </> : <>
              <Button className="ms-2 me-1 rounded-pill outline-btn"><Nav.Link>
                {/* <NavLink className="text-decoration-none" to="/login">Login</NavLink> */}
                <div onClick={handleAuthToggle}>Login</div>
              </Nav.Link></Button>
              <Button className="ms-1 rounded-pill" variant="dark"><Nav.Link>
                <NavLink className="navbar-btn text-white text-decoration-none" to="/register">Register</NavLink>
              </Nav.Link></Button>
            </>}
          </Col>
        </Container>
      </Navbar>

      <div className="page">
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>

          <Route path="/" element={<Home />}></Route>
          <Route path="/explore" element={<Explore cards={cards} />}></Route>
          <Route path="/explore/:id" element={<Explore cards={cards} />}></Route>

          {/* error */}
          <Route path="*" element={<p>Not found</p>} />
        </Routes>
      </div>

      <footer className="d-flex justify-content-center align-items-center w-100 py-5">
        <Row className="d-flex justify-content-between align-items-start w-75">
          <Col className="d-flex flex-column justify-content-start me-auto" sm="4">
            <FooterLogo width="12vw" height="auto" alt="TradeBall" className="mb-4" />
            <Row><p className="footer-desc w-100 mb-5">Every listing is backed by community trust, invite-only seller access, and secure escrow transactions. With TradeBall, your cards are always in safe hands.</p></Row>
            <div className="footer-socials d-flex justify-content-between w-50">
              <Icon.Facebook size={18} />
              <Icon.Instagram size={18} />
              <Icon.Linkedin size={18} />
              <Icon.Threads size={18} />
            </div>
          </Col>
          <Col sm="2">
            <h5>Marketplace</h5>
            <div className="footer-links">
              <p>Explore</p>
              <p>Trending</p>
              <p>Shop</p>
              <p>Auctions</p>
            </div>
          </Col>
          <Col sm="2">
            <h5>Community</h5>
            <div className="footer-links">
              <p>Forum</p>
              <p>Seller Invite System</p>
              <p>Seller Directory</p>
              <p>Report a Scammer</p>
            </div>
          </Col>
          <Col sm="2">
            <h5>About TradeBall</h5>
            <div className="footer-links">
              <p>Our Mission</p>
              <p>Our Vision</p>
            </div>
          </Col>
        </Row>
      </footer>
    </div>
  );
}

export default App;