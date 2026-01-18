import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./signup.css";
import logo from "../assets/clubs/racket.png";
import { apiFetch } from "../api";

export default function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: true,
  });

  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onChange = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const onSubmit = async (e) => {
  e.preventDefault();

  if (form.password !== form.confirmPassword) {
    alert("Passwords do not match.");
    return;
  }

  if (!form.agree) {
    alert("You must agree to the terms.");
    return;
  }

  try {
   await apiFetch("/auth/signup", {
  method: "POST",
  body: JSON.stringify({
    full_name: form.fullName,
    email: form.email,
    password: form.password,
    role: "user",
  }),
});

    alert("Account created successfully");
    navigate("/login");
  } catch (err) {
    alert(err.message);
  }
};
 
  return (
    <div className="rk-auth">
      <div className="rk-authShell">
        <aside className="rk-authLeft">
          <div className="rk-authLeftCard">
            <div className="rk-brandRow">
              <div className="rk-logoWrap">
                <img src={logo} alt="Racket" className="rk-logo" />
              </div>
              <div className="rk-brandText">
                <div className="rk-brandName">Racket</div>
                <div className="rk-brandTag">Create your account</div>
              </div>
              
            </div>

            <div className="rk-leftHero">
              <h1 className="rk-leftTitle">Join & book courts fast.</h1>
              <p className="rk-leftDesc">
                Create an account to reserve courts, manage bookings, and save your favorite clubs.
                It takes less than a minute.
              </p>
            </div>

            <div className="rk-steps">
              <div className="rk-step">
                <div className="rk-stepNum">1</div>
                <div>
                  <div className="rk-stepTitle">Set up your profile</div>
                  <div className="rk-stepSub">Name + email + password</div>
                </div>
              </div>

              <div className="rk-step">
                <div className="rk-stepNum">2</div>
                <div>
                  <div className="rk-stepTitle">Explore clubs</div>
                  <div className="rk-stepSub">Find courts & time slots</div>
                </div>
              </div>

              <div className="rk-step">
                <div className="rk-stepNum">3</div>
                <div>
                  <div className="rk-stepTitle">Book in seconds</div>
                  <div className="rk-stepSub">Pick → confirm → play</div>
                </div>
              </div>
            </div>

            <div className="rk-benefits">
              <div className="rk-benefit">
                <span className="rk-bIc">🔒</span>
                <div>
                  <div className="rk-bTitle">Secure</div>
                  <div className="rk-bSub">Your data stays protected</div>
                </div>
              </div>

              <div className="rk-benefit">
                <span className="rk-bIc">⚡</span>
                <div>
                  <div className="rk-bTitle">Fast</div>
                  <div className="rk-bSub">Simple booking flow</div>
                </div>
              </div>

              <div className="rk-benefit">
                <span className="rk-bIc">📅</span>
                <div>
                  <div className="rk-bTitle">Flexible</div>
                  <div className="rk-bSub">Edit & cancel anytime</div>
                </div>
              </div>
            </div>

            <div className="rk-leftFooter">
              Already have an account?{" "}
              <Link to="/login" className="rk-leftLink">
                Sign in
              </Link>
            </div>
          </div>
        </aside>

        {/* RIGHT (Form) */}
        <main className="rk-authRight">
          <div className="rk-card">
            <div className="rk-cardHead">
              <div>
                <h2 className="rk-title">Create account</h2>
                <p className="rk-sub">
                  Use your email and create a password to get started.
                </p>
              </div>
            </div>

            <form className="rk-form" onSubmit={onSubmit}>
              <div className="rk-field">
                <label className="rk-label">Full name</label>
                <input
                  className="rk-input"
                  value={form.fullName}
                  onChange={(e) => onChange("fullName", e.target.value)}
                  placeholder="Your name"
                  required
                />
              </div>

              <div className="rk-field">
                <label className="rk-label">Email</label>
                <input
                  className="rk-input"
                  type="email"
                  value={form.email}
                  onChange={(e) => onChange("email", e.target.value)}
                  placeholder="you@email.com"
                  required
                />
              </div>

              <div className="rk-field">
                <label className="rk-label">Password</label>
                <div className="rk-passWrap">
                  <input
                    className="rk-input rk-inputPass"
                    type={showPass ? "text" : "password"}
                    value={form.password}
                    onChange={(e) => onChange("password", e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="rk-eye"
                    onClick={() => setShowPass((v) => !v)}
                  >
                    {showPass ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <div className="rk-field">
                <label className="rk-label">Confirm password</label>
                <div className="rk-passWrap">
                  <input
                    className="rk-input rk-inputPass"
                    type={showConfirm ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={(e) => onChange("confirmPassword", e.target.value)}
                    placeholder="••••••••"
                    required
                  />
                  <button
                    type="button"
                    className="rk-eye"
                    onClick={() => setShowConfirm((v) => !v)}
                  >
                    {showConfirm ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <label className="rk-check">
                <input
                  type="checkbox"
                  checked={form.agree}
                  onChange={(e) => onChange("agree", e.target.checked)}
                />
                <span>I agree to the Terms & Privacy</span>
              </label>

              <button className="rk-submit" type="submit">
                Create account →
              </button>

              <div className="rk-divider">or</div>

              <Link className="rk-ghost" to="/login">
                Back to Sign in
              </Link>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}