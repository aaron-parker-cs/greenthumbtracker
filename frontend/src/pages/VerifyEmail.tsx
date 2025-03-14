import { MDBCard, MDBCardBody, MDBCardHeader } from "mdb-react-ui-kit";
import { Link } from "react-router-dom";

const VerifyEmail = () => {
  return (
    <div className="auth-page">
      <MDBCard className="auth-card rounded">
        <MDBCardHeader className="text-center p-4">
          <h3 className="mb-0">Verify Your Email</h3>
          <small className="text-muted">
            Check your email to verify your account
          </small>
        </MDBCardHeader>
        <MDBCardBody className="p-4">
          <div className="text-center mb-4">
            <p>
              We have sent a verification link to your email address. Please
              check your inbox and click on the link to verify your email.
            </p>
          </div>
          <div className="text-center">
            <small className="text-muted">
              Didn’t receive the email?{" "}
              <Link to="/resend-verification" className="text-decoration-none">
                Resend Verification Email
              </Link>
            </small>
          </div>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
};

export default VerifyEmail;
