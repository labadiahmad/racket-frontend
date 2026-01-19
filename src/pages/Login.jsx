import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
import logo from "../assets/clubs/racket.png";

export default function Login({ setUser, setOwner }) {
    const navigate = useNavigate();

  const API = import.meta.env.VITE_API_URL;

  const [form, setForm] = useState({
    email: "",
    password: "",
    remember: true,
  });

  const [showPass, setShowPass] = useState(false);

  const onChange = (key, value) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  async function handleLogin(e) {
    e.preventDefault();

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        alert(data.message || data.error || "Login failed");
        return;
      }

      localStorage.setItem("user", JSON.stringify(data.user));
setUser?.(data.user);  
navigate("/");
    } catch {
      alert("Server error");
    }
  }

  return (
    <div className="rk-login2">
      <div className="rk-shell2">
        <aside className="rk-left2">
          <div className="rk-leftCard2">
            <div className="rk-brand2">
              <div className="rk-brandLogo2">
                <img src={logo} alt="Racket" />
              </div>
              <div>
                <div className="rk-brandName2">Racket</div>
                <div className="rk-brandTag2">Search. Book. Play.</div>
              </div>
            </div>

            <div className="rk-hero2">
              <h1>Book padel courts in seconds.</h1>
              <p>
                Find clubs, check real-time slots, and manage your reservations
                with a smooth, modern flow.
              </p>
            </div>

            <div className="rk-stats2">
              <div className="rk-stat2">
                <div className="rk-statNum2">⚡</div>
                <div className="rk-statText2">
                  <div className="rk-statTitle2">Fast booking</div>
                  <div className="rk-statSub2">Pick → confirm → play</div>
                </div>
              </div>

              <div className="rk-stat2">
                <div className="rk-statNum2">🗓️</div>
                <div className="rk-statText2">
                  <div className="rk-statTitle2">Live slots</div>
                  <div className="rk-statSub2">Clear availability</div>
                </div>
              </div>

              <div className="rk-stat2">
                <div className="rk-statNum2">🏟️</div>
                <div className="rk-statText2">
                  <div className="rk-statTitle2">Top clubs</div>
                  <div className="rk-statSub2">Photos + locations</div>
                </div>
              </div>
            </div>

            <div className="rk-pillRow2">
              <span className="rk-pill2 rk-pillSolid2">Clubs</span>
              <span className="rk-pill2">Courts</span>
              <span className="rk-pill2">Slots</span>
              <span className="rk-pill2">Reviews</span>
            </div>
          </div>
        </aside>

        {/* RIGHT */}
        <main className="rk-right2">
          <div className="rk-formCard2">
            <Link className="rk-backTop2" to="/">
              ← Home
            </Link>

            <div className="rk-formHead2">
              <div className="rk-formTitle2">Sign in</div>
              <div className="rk-formSub2">
                Welcome back — let’s book your next match.
              </div>
            </div>

            <form className="rk-form2" onSubmit={handleLogin}>
              <div className="rk-field2">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="you@email.com"
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="rk-field2">
                <label>Password</label>
                <div className="rk-pass2">
                  <input
                    type={showPass ? "text" : "password"}
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => onChange("password", e.target.value)}
                    required
                  />
                  <button
                    className="rk-eye2"
                    type="button"
                    onClick={() => setShowPass((v) => !v)}
                  >
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div className="rk-row2">
                <label className="rk-check2">
                  <input
                    type="checkbox"
                    checked={form.remember}
                    onChange={(e) => onChange("remember", e.target.checked)}
                  />
                  <span>Remember me</span>
                </label>

                <button className="rk-link2" type="button" onClick={() => alert("Later")}>
                  Forgot password?
                </button>
              </div>

              <button className="rk-submit2" type="submit">
                <span className="rk-dot2" />
                Sign in
                <span className="rk-arrow2">→</span>
              </button>

              <div className="rk-sep2">
                <span>New here?</span>
              </div>

              <Link className="rk-ghost2" to="/signup">
                Create account
              </Link>

              <div className="rk-admin2">
                <div className="rk-adminTitle2">Club owner?</div>
                <div className="rk-adminRow2">
                  <Link to="/admin/signup">register your club</Link>
                </div>
              </div>

              <div className="rk-legal2">
                By signing in, you agree to Racket’s <span>Terms</span> and{" "}
                <span>Privacy</span>.
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}