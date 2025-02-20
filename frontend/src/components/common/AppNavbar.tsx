import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { logout } from "../../redux/user/slice";

const AppNavbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleLogout = async () => {
    // Call the logout REST api endpoint and clear the user state
    await axios.post("/api/auth/logout");
    dispatch(logout(user));
  };

  return (
    <Navbar bg="success" variant="dark" expand="lg"
      style={{position: "fixed", top: "0", width: "100%"}}>
      <Container>
        <Navbar.Brand as={Link} to="/">
          GreenThumb Tracker
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            {user.isAuthenticated ? (
              <Nav.Link as={Link} onClick={handleLogout} to="/login">
                Logout
              </Nav.Link>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  Login
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  Register
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
