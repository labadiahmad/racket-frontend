import "./footer.css";
import logo from "../assets/clubs/racket white.png";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="rk-foot">
      <div className="rk-container">
        <div className="rk-foot-card">
          <div className="rk-foot-top">
            <div className="rk-foot-brand">
              <img src={logo} alt="Racket logo" className="rk-foot-logo" />
              <div>
                <div className="rk-foot-name">Racket</div>
                <div className="rk-foot-tag">Built for Champs</div>
              </div>
            </div>

            <div className="rk-foot-cta">
              <div className="rk-foot-ctaText">
                <div className="rk-foot-ctaTitle">Ready to play?</div>
                <div className="rk-foot-ctaSub">Find courts and tournaments in seconds.</div>
              </div>

              <a className="rk-foot-btn rk-press" href="/courts">
                Book a Court <span className="rk-foot-btnIc">→</span>
              </a>
            </div>
          </div>

          <div className="rk-foot-links">
            <div className="rk-foot-col">
              <div className="rk-foot-colTitle">Pages</div>
              <a className="rk-foot-link" href="/">Home</a>
              <a className="rk-foot-link" href="/courts">Courts</a>
              <a className="rk-foot-link" href="/contact">Contact</a>
            </div>

            <div className="rk-foot-col">
              <div className="rk-foot-colTitle">Support</div>
              <a className="rk-foot-link" href="/help">Help Center</a>
              <a className="rk-foot-link" href="/faq">FAQ</a>
              <a className="rk-foot-link" href="/terms">Terms</a>
              <a className="rk-foot-link" href="/privacy">Privacy</a>
            </div>

            <div className="rk-foot-col">
              <div className="rk-foot-colTitle">Social</div>
              <div className="rk-foot-socials">
                <a className="rk-foot-social" href="#" aria-label="Instagram">📸</a>
                <a className="rk-foot-social" href="#" aria-label="TikTok">🎵</a>
                <a className="rk-foot-social" href="#" aria-label="Facebook">📘</a>
              </div>

              <div className="rk-foot-note">
                Premium booking experience for clubs and players in Jordan.
              </div>
            </div>
          </div>

          <div className="rk-foot-bottom">
            <span>© {year} Racket</span>
          </div>
        </div>
      </div>
    </footer>
  );
}