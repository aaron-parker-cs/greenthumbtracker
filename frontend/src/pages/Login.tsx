import { useEffect, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../redux/user/slice";
import { MDBCard, MDBCardBody, MDBCardHeader } from "mdb-react-ui-kit";
import { api } from "../redux/api";
import { Credential } from "../models/credential";

const Login = () => {
  const dispatch = useDispatch();
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loginUser, { isLoading, isError, error: loginError }] =
    api.useLoginMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (
      isError &&
      loginError &&
      typeof loginError === "object" &&
      "data" in loginError
    ) {
      const errorData = loginError as FetchBaseQueryError;

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
  }, [isError, loginError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const credentials: Credential = {
      ...inputs,
      email: null,
    };
    try {
      const res = await loginUser(credentials).unwrap();
      dispatch(login(res));
      navigate("/");
    } catch (err) {
      console.log(err);
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="auth-page">
      <MDBCard className="auth-card rounded">
        <MDBCardHeader className="text-center p-4">
          <h3 className="mb-0">Welcome Back</h3>
          <small className="text-muted">Sign in to continue</small>
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

            <Form.Group className="mb-4" controlId="password">
              <Form.Control
                type="password"
                placeholder="Password"
                onChange={handleChange}
              />
            </Form.Group>

            {error && (
              <div className="text-danger text-center mb-3">{error}</div>
            )}

            <Button type="submit" className="w-100 mb-3" disabled={isLoading}>
              Sign In {isLoading && <Spinner animation="border" size="sm" />}
            </Button>

            <div className="text-center">
              <small className="text-muted">
                Don’t have an account?{" "}
                <Link to="/register" className="text-decoration-none">
                  Register
                </Link>
              </small>
            </div>
          </Form>
        </MDBCardBody>
      </MDBCard>
    </div>
  );
};

export default Login;
