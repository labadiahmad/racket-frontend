import { Link, NavLink, useLocation } from "react-router-dom";
import logo from "../assets/clubs/racket.png";
import "./navbar.css";

export default function Navbar() {
  const { pathname } = useLocation();

  const isCourts = pathname.startsWith("/courts") || pathname.includes("/courts/");
  const isClubs = pathname.startsWith("/clubs") && !isCourts;

  let user = null;
  try {
    user = JSON.parse(localStorage.getItem("user"));
  } catch {
    user = null;
  }

  const isUserLoggedIn = !!user;

  return (
    <div className="nb-wrap">
      <div className="nb-bar">
        {/* LEFT */}
        <div className="nb-left">
          <img src={logo} alt="Racket logo" className="nb-logo" />
          <span className="nb-name">Racket</span>
        </div>

        {/* CENTER */}
        <div className="nb-links">
          <NavLink to="/" className={({ isActive }) => `nb-link ${isActive ? "active" : ""}`}>
            Home
          </NavLink>

          <Link to="/clubs" className={`nb-link ${isClubs ? "active" : ""}`}>
            Clubs
          </Link>

          <Link to="/courts" className={`nb-link ${isCourts ? "active" : ""}`}>
            Courts
          </Link>

          <NavLink to="/contact" className={({ isActive }) => `nb-link ${isActive ? "active" : ""}`}>
            Contact Us
          </NavLink>
        </div>

        {/* RIGHT */}
        <div className="nb-right">
          {!isUserLoggedIn ? (
            <Link to="/login" className="nb-login">
              Sign In
            </Link>
          ) : (
            <Link to="/profile" className="nb-profile" aria-label="Profile">
              👤
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}