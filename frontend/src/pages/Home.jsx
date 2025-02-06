import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBCard,
  MDBCardBody,
  MDBCardText,
  MDBCardTitle,
} from "mdb-react-ui-kit";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const Home = () => {
  const user = useSelector((state) => state.user);

  // if the user isn't authenticated, redirect them to the login page
  if (!user.isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return (
    <MDBContainer className="mt-5">
      <MDBRow>
        <MDBCol md="12">
          <MDBCard>
            <MDBCardBody>
              <MDBCardTitle>Welcome, {user.username}!</MDBCardTitle>
              <MDBCardText>
                We're glad to have you back. Here's what's happening today:
              </MDBCardText>
              <ul>
                <li>Check your plant's water levels</li>
                <li>Review your garden's growth progress</li>
                <li>Explore new gardening tips</li>
              </ul>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Home;
