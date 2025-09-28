import LogoLight from "./logo-2.svg";
import LogoDark from "./logo-3.svg";
import './App.css';
// React
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
// firebase
import { useAuth } from "./services/authContext.js";
// components
import { Container, Nav, Navbar, Button } from "react-bootstrap";
import CustomFooter from "./components/footer.js";
// icons
import { BsCart, BsCartFill } from "react-icons/bs";
// App screens
import Home from "./screens/Home";
import Explore from './screens/Explore';
import Listings from './screens/Listings';
import Login from './screens/Login';
import Register from './screens/Register';
import SellerOnboarding from "./screens/SellerOnboarding.js";
import Profile from "./screens/Profile.js";
import Favorites from "./screens/Favorites.js";

function App() {
  const navigate = useNavigate();
  const location = useLocation();
  // check if user authenticated
  const { user, userData } = useAuth();
  // select pathname
  const atExploreListings = /^\/explore\/[^/]+$/.test(location.pathname);
  const atCart = /^\/[^/]+\/cart$/.test(location.pathname);
  const atProfile = /^\/[^/]+\/profile$/.test(location.pathname);
  const atAuthForms = location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/seller/onboarding";

  // when page scrolled on Home page, change navbar bg (transparent -> solid divor)
  const [navbarBg, setNavbarBg] = useState(false); useEffect(() => {
    const changeNavbarBg = () => { if (window.scrollY >= 10) { setNavbarBg(true); } else { setNavbarBg(false); } };
    // attach listener
    window.addEventListener("scroll", changeNavbarBg);
  }, []);

  return (
    <div>
      <Navbar
        className={`navbar ${navbarBg || atProfile ? "nav-bg" : ""} m-0 p-0`}
        expand="lg"
        fixed="top"
      >
        <Container fluid className="d-flex flex-row justify-content-between align-items-center mx-4 my-0">
          <div className="d-flex flex-row w-25">
            <Navbar.Brand>
              <img src={navbarBg || atAuthForms ? LogoLight : LogoDark} width="45%" height="auto" alt="TradeBall" onClick={() => navigate("/")} className="clickable-image m-0 p-0" />
            </Navbar.Brand>
            <Navbar.Toggle aria-controls="navbarScroll" />
          </div>

          {!atAuthForms && <div>
            <Nav className="d-flex justify-content-center align-items-center">
              <Nav.Link>
                <NavLink className="mx-2 text-black text-decoration-none" to="/">Home</NavLink>
              </Nav.Link>
              <Nav.Link>
                <NavLink className="mx-2 text-black text-decoration-none" to="/explore">Explore</NavLink>
              </Nav.Link>
            </Nav>
          </div>}

          <div className="d-flex justify-content-end align-items-center w-25">
            {user && userData ? <>
              <div className="nav-icon py-2 ms-3">
                <NavLink to={`${user.displayName}/cart`}>
                  {atCart ?
                    <BsCartFill size={24} /> :
                    <BsCart size={24} />}
                </NavLink>
              </div>
              <Button className="mx-3 rounded-pill outline-btn"><Nav.Link>
                {userData?.role === "seller" ?
                  <NavLink className="text-decoration-none" to="/seller/store">Shop Manager</NavLink> :
                  <NavLink className="text-decoration-none" to="/seller/onboarding">Be a Seller</NavLink>
                }
              </Nav.Link></Button>
              <NavLink to={`${user.displayName}/profile`}>
                <img src={user.photoURL} alt={`${user.displayName} profile`} height="8vh" width="auto" className="profile-icon" />
              </NavLink>
            </> : <>
              <Button className="ms-2 me-1 rounded-pill outline-btn"><Nav.Link>
                <NavLink className="text-decoration-none" to="/login">Login</NavLink>
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
          <Route path="/" element={<Home />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/explore" element={<Explore />}></Route>

          {/* for listings */}
          <Route path="/explore/:cardId" element={<Listings />}></Route>
          <Route path="/explore/:cardId/listing/:listingId" element={<p className="my-5 py-5 w-100 d-flex justify-content-center align-items-center">/explore/:cardId/listing/:listingId</p>}></Route>

          {/* for user */}
          <Route path=":username/profile" element={<Profile />}></Route>
          <Route path=":username/cart" element={<p className="my-5 py-5 w-100 d-flex justify-content-center align-items-center">:username/cart</p>}></Route>
          <Route path=":username/favorites" element={<Favorites />}></Route>
          <Route path="seller/onboarding" element={<SellerOnboarding />}></Route>
          <Route path=":username/store" element={<p className="my-5 py-5 w-100 d-flex justify-content-center align-items-center">:username/store</p>}></Route>

          {/* services */}
          <Route path=":username/seller/invite-request" element={<p className="my-5 py-5 w-100 d-flex justify-content-center align-items-center">:username/seller/invite-request</p>}></Route>
          <Route path=":username/orders/:orderId" element={<p className="my-5 py-5 w-100 d-flex justify-content-center align-items-center">:username/orders/:orderId</p>}></Route>

          {/* error */}
          <Route path="*" element={<p>Not found</p>} />
        </Routes>
      </div>

      {!atAuthForms && !atExploreListings && !atProfile && <CustomFooter />}
    </div>
  );
}

export default App;