import { useEffect, useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../redux/user/slice";
import { MDBCard, MDBCardBody, MDBCardHeader } from "mdb-react-ui-kit";
import { api } from "../redux/api";

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
    if (isError) {
      if ("data" in loginError) {
        const errorData = loginError as FetchBaseQueryError & {
          data: { message: string };
        };
        setError(errorData.data.message || "An unexpected error occurred");
      } else {
        setError("An unexpected error occurred");
      }
    }
  }, [isError, loginError]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await loginUser(inputs).unwrap();
    dispatch(login(res));
    navigate("/");
  };

  return (
    <MDBCard fluid className="w-25 mx-auto mt-5 p-5 shadow border-0 rounded ">
      <MDBCardHeader className="text-center">
        <h3>Sign in</h3>
      </MDBCardHeader>
      <MDBCardBody className="d-flex flex-row align-items-center justify-content-center">
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-4" controlId="username">
            <Form.Control
              type="text"
              placeholder="username"
              onChange={handleChange}
            />
          </Form.Group>

          <Form.Group className="mb-4" controlId="password">
            <Form.Control
              type="password"
              placeholder="password"
              onChange={handleChange}
            />
          </Form.Group>

          <Button type="submit" className="mb-4 w-100">
            Sign In {isLoading && <Spinner animation="border" size="sm" />}
          </Button>

          <Form.Group className="mb-4 text-center">
            <Form.Text className="text-danger">
              <span>{error}</span>
            </Form.Text>
          </Form.Group>

          <span className="m-3">
            Don't have an account? <Link to="/register">Register</Link>
          </span>
        </Form>
      </MDBCardBody>
    </MDBCard>
  );
};

export default Login;
