import { useEffect } from "react";
import { Button, Spinner } from "react-bootstrap";
import { MDBCard, MDBCardBody, MDBCardHeader } from "mdb-react-ui-kit";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../redux/api";

const VerifiedPage = () => {
  const [verifyEmail, { isSuccess, isLoading, isError, error }] =
    api.useVerifyEmailMutation();

  const navigate = useNavigate();

  useEffect(() => {
    const handleVerify = async () => {
      // Extract ?token=... from URL
      const token = new URLSearchParams(window.location.search).get("token");
      if (!token) return;

      try {
        await verifyEmail(token).unwrap();
      } catch (err) {
        console.error("Verification error:", err);
      }
    };

    handleVerify();
  }, [verifyEmail]);

  const handleContinue = () => {
    navigate("/login");
  };

  let errorMessage = "Something went wrong!";
  if (isError && error && "data" in error && typeof error.data === "string") {
    errorMessage = error.data;
  }

  return (
    <div className="auth-page">
      <MDBCard className="auth-card rounded">
        <MDBCardHeader className="text-center p-4">
          <h3 className="mb-0">Email Verification</h3>
        </MDBCardHeader>
        <MDBCardBody className="p-4">
          {isLoading ? (
            <div className="text-center">
              <Spinner animation="border" />
            </div>
          ) : isSuccess ? (
            <div className="text-center">
              <h5 className="mb-3">Your email has been verified!</h5>
              <Button onClick={handleContinue} className="w-100 mb-3">
                Continue
              </Button>
            </div>
          ) : isError ? (
            <div className="text-center text-danger">
              <h5 className="mb-3">{errorMessage}</h5>
              <Link to="/resend-verification" className="text-decoration-none">
                Resend Verification Email
              </Link>
            </div>
          ) : (
            <div className="text-center">
              <h5>No verification token found in the URL.</h5>
            </div>
          )}
        </MDBCardBody>
      </MDBCard>
    </div>
  );
};

export default VerifiedPage;
