import { useEffect, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Link, useNavigate } from "react-router-dom";
import { MDBCard, MDBCardBody, MDBCardHeader } from "mdb-react-ui-kit";
import { api } from "../redux/api";

const RequestPasswordReset = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [requestPasswordReset, { isLoading, isError, error: resetError }] =
    api.useForgotPasswordMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (
      isError &&
      resetError &&
      typeof resetError === "object" &&
      "data" in resetError
    ) {
      const errorData = resetError as FetchBaseQueryError;

      // If the server returns a string
      if (typeof errorData.data === "string") {
        setError(errorData.data);
      }
      // If the server returns an object like { message: "some error" }
      else if (
        errorData.data &&
        typeof errorData.data === "object" &&
        "message" in errorData.data
      ) {
        setError((errorData.data as { message: string }).message);
      } else {
        setError("An unexpected error occurred");
      }
    } else if (isError) {
      setError("An unexpected error occurred");
    }
  }, [isError, resetError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await requestPasswordReset(email).unwrap();
      navigate("/password-reset-confirmation");
    } catch (err) {
      console.log(err);
      setError("Password reset request failed. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <MDBCard className="auth-card rounded">
        <MDBCardHeader className="text-center p-4">
          <h3 className="mb-0">Reset Password</h3>
          <small className="text-muted">
            Enter your email to reset password
          </small>
        </MDBCardHeader>
        <MDBCardBody className="p-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Control
                type="email"
                placeholder="Email"
                onChange={handleChange}
              />
            </Form.Group>

            {error && (
              <div className="text-danger text-center mb-3">{error}</div>
            )}

            <Button type="submit" className="w-100 mb-3" disabled={isLoading}>
              Request Password Reset{" "}
              {isLoading && <Spinner animation="border" size="sm" />}
            </Button>

            <div className="text-center">
              <small className="text-muted">
                Remembered your password?{" "}
                <Link to="/login" className="text-decoration-none">
                  Sign In
                </Link>
              </small>
            </div>
          </Form>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
};

export default RequestPasswordReset;
