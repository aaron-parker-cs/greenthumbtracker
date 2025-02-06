import { Link } from "react-router-dom";

const AppFooter = () => {
  return (
    <footer
      className="bg-success text-white text-center py-3 fluid"
      style={{ position: "fixed", bottom: 0, width: "100%" }}
    >
      <Link to="/">
        <img
          src="https://i.imgur.com/XfyM3ea.gif"
          width={50}
          height={50}
          alt="Green Radish Logo"
        />
      </Link>
      <span>
        Made by Aaron Parker, Adam Ustby, Darrelle Simonton, and Toby Buckmaster
      </span>
    </footer>
  );
};

export default AppFooter;
