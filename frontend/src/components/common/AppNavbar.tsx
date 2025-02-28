import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { logout, UserState } from "../../redux/user/slice";
import { api } from "../../redux/api";

const AppNavbar = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: { user: UserState }) => state.user);
  const [logoutUser] = api.useLogoutMutation();

  const handleLogout = async () => {
    // Call the logout REST api endpoint and clear the user state
    await logoutUser();
    dispatch(logout());
  };

  return (
    <Navbar
      bg="success"
      variant="dark"
      expand="lg"
      className="py-2"
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 1000,
      }}
    >
      <Container fluid>
        <Navbar.Brand as={Link} to="/" className="ms-3">
          GreenThumb Tracker
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="basic-navbar-nav" className="me-3" />

        <Navbar.Collapse
          id="basic-navbar-nav"
          className="justify-content-end me-3"
        >
          <Nav>
            <Nav.Link as={Link} to="/">
              Home
            </Nav.Link>
            <Nav.Link as={Link} to="/plants">
              Plants
            </Nav.Link>
            <Nav.Link as={Link} to="/records">
              Records
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
