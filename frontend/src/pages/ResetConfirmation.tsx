import { MDBCard, MDBCardBody, MDBCardHeader } from "mdb-react-ui-kit";
import { Link } from "react-router-dom";

const ResetConfirmation = () => {
  return (
    <div className="auth-page">
      <MDBCard className="auth-card rounded">
        <MDBCardHeader className="text-center p-4">
          <h3 className="mb-0">Check Your Email</h3>
        </MDBCardHeader>
        <MDBCardBody className="p-4">
          <div className="text-center mb-4">
            <p>
              We have sent a password reset link to your email. Please check
              your inbox and follow the instructions to reset your password.
            </p>
          </div>
          <div className="text-center">
            <small className="text-muted">
              Didn't receive the email?{" "}
              <Link
                to="/request-password-reset"
                className="text-decoration-none"
              >
                Try Again
              </Link>
            </small>
          </div>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
};

export default ResetConfirmation;
