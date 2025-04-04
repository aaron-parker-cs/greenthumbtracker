import { RouterProvider } from "react-router-dom";

import "./style.scss";
import "react-toastify/dist/ReactToastify.css";

import { ToastContainer } from "react-bootstrap";
import { router } from "./Router";

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
