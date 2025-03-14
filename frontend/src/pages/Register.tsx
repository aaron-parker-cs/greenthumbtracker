import { useEffect, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { MDBCard, MDBCardBody, MDBCardHeader } from "mdb-react-ui-kit";
import { api } from "../redux/api";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Credential } from "../models/credential";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [registerUser, { isLoading, isError, error: registerError }] =
    api.useRegisterMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (isError) {
      if ("data" in registerError) {
        const errorData = registerError as FetchBaseQueryError & {
          data: { message: string };
        };
        setError(errorData.data.message || "An unexpected error occurred");
      } else {
        setError("An unexpected error occurred");
      }
    }
  }, [isError, registerError]);

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
    const credentials: Credential = {
      username: inputs.username,
      email: inputs.email,
      password: inputs.password,
    };
    try {
      await registerUser(credentials).unwrap();
      navigate("/verify");
    } catch (err) {
      console.log(err);
      setError("Registration failed. Please try again.");
    }
  };

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

  return (
    <div className="auth-page">
      <MDBCard className="auth-card rounded">
        <MDBCardHeader className="text-center p-4">
          <h3 className="mb-0">Create an Account</h3>
          <small className="text-muted">Sign up to get started</small>
        </MDBCardHeader>

        <MDBCardBody className="p-4">
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="username">
              <Form.Control
                type="text"
                placeholder="Username"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="email">
              <Form.Control
                type="email"
                placeholder="Email"
                onChange={handleChange}
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Control
                type="password"
                placeholder="Password"
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
              Register {isLoading && <Spinner animation="border" size="sm" />}
            </Button>

            <div className="text-center">
              <small className="text-muted">
                Have an account?{" "}
                <Link to="/login" className="text-decoration-none">
                  Login
                </Link>
              </small>
            </div>
          </Form>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
};

export default Register;
