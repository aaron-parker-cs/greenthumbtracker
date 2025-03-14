import { useEffect, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Link, useNavigate } from "react-router-dom";
import { MDBCard, MDBCardBody, MDBCardHeader } from "mdb-react-ui-kit";
import { api } from "../redux/api";

const ResetPasswordPage = () => {
  const [inputs, setInputs] = useState({
    token: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [resetPassword, { isLoading, isError, error: resetError }] =
    api.useResetPasswordMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (
      isError &&
      resetError &&
      typeof resetError === "object" &&
      "data" in resetError
    ) {
      const errorData = resetError as FetchBaseQueryError;

      if (typeof errorData.data === "string") {
        setError(errorData.data);
      } else if (
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
    const { id, value } = e.target;
    setInputs((prev) => ({ ...prev, [id]: value }));

    if (id === "password" || id === "confirmPassword") {
      if (inputs.password !== inputs.confirmPassword) {
        setError("Passwords do not match");
      } else {
        setError("");
      }

      const passwordRegex =
        /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
      if (!passwordRegex.test(inputs.password)) {
        setError(
          "Password must be at least 8 characters long and include a number and a special character"
        );
      } else {
        setError("");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (inputs.password !== inputs.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const passwordRegex =
      /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,}$/;
    if (!passwordRegex.test(inputs.password)) {
      setError(
        "Password must be at least 8 characters long and include a number and a special character"
      );
      return;
    }
    try {
      const queryParams = new URLSearchParams(window.location.search);
      const token = queryParams.get("token");

      if (!token) {
        setError("Token is missing");
        return;
      }

      await resetPassword({ token, password: inputs.password }).unwrap();
      navigate("/login");
    } catch (err) {
      console.log(err);
      setError("Reset password failed. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <MDBCard className="auth-card rounded">
        <MDBCardHeader className="text-center p-4">
          <h3 className="mb-0">Reset Password</h3>
          <small className="text-muted">Enter your new password</small>
        </MDBCardHeader>
        <MDBCardBody className="p-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="password">
              <Form.Control
                type="password"
                placeholder="New Password"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="confirmPassword">
              <Form.Control
                type="password"
                placeholder="Confirm Password"
                onChange={handleChange}
              />
            </Form.Group>

            {error && (
              <div className="text-danger text-center mb-3">{error}</div>
            )}

            <Button type="submit" className="w-100 mb-3" disabled={isLoading}>
              Reset Password{" "}
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

export default ResetPasswordPage;
