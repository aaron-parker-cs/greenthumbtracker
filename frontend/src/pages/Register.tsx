import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { MDBCard, MDBCardBody, MDBCardHeader } from "mdb-react-ui-kit";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/register", inputs);
      navigate("/login");
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorMessage =
          typeof err.response.data === "string"
            ? err.response.data
            : err.response.data.message;
        setError(errorMessage);
      } else {
        setError("An unexpected error occurred");
      }
    }
  };

  return (
    <MDBCard fluid className="w-25 mx-auto mt-5 p-5 shadow border-0 rounded ">
      <MDBCardHeader className="text-center">
        <h3>Register</h3>
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

          <Form.Group className="mb-4" controlId="email">
            <Form.Control
              type="email"
              placeholder="email"
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
            Register
          </Button>

          <Form.Group className="mb-4 text-center">
            <Form.Text className="text-danger">{error}</Form.Text>
          </Form.Group>

          <span className="m-3">
            Have an account? <Link to="/login">Login</Link>
          </span>
        </Form>
      </MDBCardBody>
    </MDBCard>
  );
};

export default Register;
