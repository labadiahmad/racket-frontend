import { Link } from "react-router-dom";
import "./notFound.css";

export default function NotFound() {
  return (
    <div className="nf-page">
      <div className="nf-card">
        <div className="nf-code">404</div>
        <h1 className="nf-title">Page not found</h1>
        <p className="nf-sub">
          The page you are looking for doesn’t exist or was moved.
        </p>

        <div className="nf-actions">
          <Link to="/" className="nf-btn nf-btnPrimary">
            Go Home
          </Link>

         
        </div>
      </div>
    </div>
  );
}