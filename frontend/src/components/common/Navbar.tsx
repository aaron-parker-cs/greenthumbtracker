import { Link } from "react-router-dom";

const Navbar = () => {
    return (
        <div className="navbar">
            <div className="container">
                <div className="logo">logo</div>
                <div className="links">
                    <Link className="link" to="/">
                        <h6>Home</h6>
                    </Link>
                    <Link className="link" to="/login">
                        <h6>Login</h6>
                    </Link>
                    <Link className="link" to="/register">
                        <h6>Register</h6>
                    </Link>
                    <Link className="link" to="/">
                        <h6>Logout</h6>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Navbar;