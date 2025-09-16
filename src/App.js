import { ReactComponent as Logo } from "./logo-3.svg";
import * as Icon from 'react-bootstrap-icons';
import './App.css';
// React
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Routes, Route, NavLink } from "react-router-dom";
// components
import { Container, Nav, Navbar, Dropdown, Button, Form } from "react-bootstrap";
import CustomFooter from "./components/footer.js";
// App screens
import Home from "./screens/Home";
import Explore from './screens/Explore';
import Listings from './screens/Listings';
import Login from './screens/Login';
import Register from './screens/Register';

function App() {
  const navigate = useNavigate();
  // temp auth
  const [isLogin, setIsLogin] = useState(false);
  const [isSeller, setIsSeller] = useState(false);

  // when page scrolled on Home page, change navbar bg (transparent -> solid divor)
  const [navbarBg, setNavbarBg] = useState(false); useEffect(() => {
    const changeNavbarBg = () => { if (window.scrollY >= 50) { setNavbarBg(true); } else { setNavbarBg(false); } };
    // attach listener
    window.addEventListener("scroll", changeNavbarBg);
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
        className={`navbar ${navbarBg ? "nav-bg" : ""} m-0 p-0`}
        expand="lg"
        fixed="top"
      >
        <Container fluid className="d-flex flex-row justify-content-between align-items-center mx-4 my-0">
          <div className="d-flex flex-row w-25">
            <Navbar.Brand>
              <Logo width="10vw" height="auto" alt="TradeBall" onClick={() => navigate("/")} className="clickable-image m-0 p-0" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
            <Form className="d-flex flex-row align-items-center ms-4" style={{ width: "15vw" }}>
              <Form.Control type="text" size="sm" className="search-input me-2" placeholder="What are you looking for?"></Form.Control>
              <Icon.Search size={15} className="me-2" />
            </Form>
          </div>

          <div>
            <Nav className="d-flex justify-content-center align-items-center">
              <Nav.Link>
                <NavLink className="mx-2 text-black text-decoration-none" to="/">Home</NavLink>
              </Nav.Link>
              <Nav.Link>
                <NavLink className="mx-2 text-black text-decoration-none" to="/explore">Explore</NavLink>
              </Nav.Link>
            </Nav>
          </div>

          <div className="d-flex justify-content-end align-items-center w-25">
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
                <Dropdown.Menu className="dropdown-menu">
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
          </div>
        </Container>
      </Navbar>

      <div className="page">
        <Routes>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>

          <Route path="/" element={<Home />}></Route>
          <Route path="/explore" element={<Explore />}></Route>
          <Route path="/explore/:cardId" element={<Listings />}></Route>

          {/* error */}
          <Route path="*" element={<p>Not found</p>} />
        </Routes>
      </div>

      <CustomFooter />
    </div>
  );
}

export default App;