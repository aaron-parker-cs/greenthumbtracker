import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
import AppNavbar from "./components/common/AppNavbar";
import AppFooter from "./components/common/AppFooter";
import "./style.scss";
import "react-toastify/dist/ReactToastify.css";
import PlantPage from "./pages/PlantPage";
import { ToastContainer } from "react-bootstrap";
import VerifyEmail from "./pages/VerifyEmail";
import VerifiedPage from "./pages/VerifiedPage";

const Layout = () => {
  return (
    <>
      <AppNavbar />
      <Outlet />
      <AppFooter />
    </>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/plants",
        element: <PlantPage />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/verify",
    element: <VerifyEmail />,
  },
  {
    path: "/verify-email",
    element: <VerifiedPage />,
  },
]);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
