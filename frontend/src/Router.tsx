import { createBrowserRouter } from "react-router-dom";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Login from "./pages/Login";
import PlantPage from "./pages/PlantPage";
import RecordsPage from "./pages/RecordsPage";
import VerifyEmail from "./pages/VerifyEmail";
import VerifiedPage from "./pages/VerifiedPage";
import RequestPasswordReset from "./pages/RequestPasswordReset";
import ResetConfirmation from "./pages/ResetConfirmation";
import ResetPasswordPage from "./pages/ResetPasswordPage";

import Health from "./pages/Health";
import { Layout } from "./Layout";
import WeatherPage from "./pages/WeatherPage";

export const router = createBrowserRouter([
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
      {
        path: "/records",
        element: <RecordsPage />,
      },
      {
        path: "/weather",
        element: <WeatherPage />,
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
  {
    path: "/forgot-password",
    element: <RequestPasswordReset />,
  },
  {
    path: "/password-reset-confirmation",
    element: <ResetConfirmation />,
  },
  {
    path: "reset-password",
    element: <ResetPasswordPage />,
  },
  {
    path: "health",
    element: <Health />,
  },
]);
