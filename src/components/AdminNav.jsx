import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/clubs/racket.png";
import "./navbar.css";

const linkClass = ({ isActive }) => `nb-link ${isActive ? "active" : ""}`;

export default function AdminNavbar({ setOwner }) {
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("owner");
    localStorage.removeItem("reservationDraft");
    localStorage.removeItem("reservationSuccess");

    if (typeof setOwner === "function") setOwner(null);

    navigate("/", { replace: true });
  }

  return (
    <div className="nb-wrap">
      <div className="nb-bar nb-adminMode">
        <div className="nb-left">
          <img src={logo} alt="Racket logo" className="nb-logo" />
          <span className="nb-name">Racket Admin</span>
        </div>

        <div className="nb-links">
          <NavLink to="/admin" end className={linkClass}>Dashboard</NavLink>
          <NavLink to="/admin/club" className={linkClass}>Club</NavLink>
          <NavLink to="/admin/courts" className={linkClass}>Courts</NavLink>
          <NavLink to="/admin/reservations" className={linkClass}>Reservations</NavLink>
        </div>

        <button className="nb-signout" type="button" onClick={logout}>
          Sign Out
        </button>
      </div>
    </div>
  );
}