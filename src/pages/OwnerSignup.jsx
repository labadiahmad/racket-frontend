import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ownerSignup.css";
import logo from "../assets/clubs/racket.png";

export default function OwnerSignup() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [owner, setOwner] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [club, setClub] = useState({
    name: "",
    city: "",
    address: "",
    phone: "",
    whatsapp: "",
    mapsUrl: "",
  });

  const [showPass, setShowPass] = useState(false);

  const onOwnerChange = (key, value) => setOwner((p) => ({ ...p, [key]: value }));
  const onClubChange = (key, value) => setClub((p) => ({ ...p, [key]: value }));

  const passwordStrength = useMemo(() => {
    const p = owner.password || "";
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    return score; 
  }, [owner.password]);

  const strengthLabel = useMemo(() => {
    if (passwordStrength <= 1) return "Weak";
    if (passwordStrength === 2) return "Okay";
    if (passwordStrength === 3) return "Good";
    return "Strong";
  }, [passwordStrength]);

  const canGoNext = useMemo(() => {
    return (
      owner.firstName.trim() &&
      owner.lastName.trim() &&
      owner.email.trim() &&
      owner.phone.trim() &&
      owner.password.trim() &&
      owner.confirmPassword.trim() &&
      owner.password === owner.confirmPassword
    );
  }, [owner]);

  const canFinish = useMemo(() => {
    return club.name.trim() && club.city.trim() && club.address.trim() && club.phone.trim();
  }, [club]);

  const goNext = (e) => {
    e.preventDefault();
    if (!canGoNext) return;
    setStep(2);
  };

  const goBack = () => setStep(1);

  const finish = (e) => {
    e.preventDefault();
    if (!canFinish) return;

    const payload = { owner, club };
    console.log("OWNER SIGNUP:", payload);

    navigate("/admin");
  };

  return (
    <div className="os-page">
      <div className="os-shell">
        {/* LEFT */}
        <aside className="os-left">
          <div className="os-leftCard">
            <div className="os-brand">
              <div className="os-logoWrap">
                <img src={logo} alt="Racket" className="os-logo" />
              </div>
              <div>
                <div className="os-name">Racket • Club Owner</div>
                <div className="os-tag">Launch your club page fast 🚀</div>
              </div>
            </div>

            {/* progress */}
            <div className="os-progress">
              <div className="os-progressTop">
                <span className="os-progressLabel">Progress</span>
                <span className="os-progressValue">{step}/2</span>
              </div>
              <div className="os-bar">
                <div className="os-barFill" style={{ width: step === 1 ? "50%" : "100%" }} />
              </div>
            </div>

            {/* step cards */}
            <div className="os-steps">
              <div className={`os-step ${step === 1 ? "active" : "done"}`}>
                <div className="os-stepDot">{step === 1 ? "1" : "✓"}</div>
                <div>
                  <div className="os-stepTitle">Owner info</div>
                  <div className="os-stepSub">Create your admin account</div>
                </div>
              </div>

              <div className={`os-step ${step === 2 ? "active" : ""}`}>
                <div className="os-stepDot">2</div>
                <div>
                  <div className="os-stepTitle">Club essentials</div>
                  <div className="os-stepSub">Only basics (edit later)</div>
                </div>
              </div>
            </div>

            <div className="os-note">
              ✅ You can add <b>gallery, facilities, rules, courts</b> later in <b>Edit Club</b>.
              <div className="os-mini">For now we only need the minimum to create your club page.</div>
            </div>
          </div>
        </aside>

        {/* RIGHT */}
        <main className="os-right">
          <div className="os-card">
            <Link className="os-back" to="/admin">
              ← Back
            </Link>

            {/* header */}
            <div className="os-head">
              <div className="os-kicker">{step === 1 ? "Step 1" : "Step 2"} of 2</div>
              <div className="os-title">{step === 1 ? "Create owner account" : "Add club essentials"}</div>
              <div className="os-sub">
                {step === 1
                  ? "This account will manage your club profile and courts."
                  : "Just the essentials now — you can complete the rest later."}
              </div>
            </div>

            {/* FORM */}
            {step === 1 ? (
              <form className="os-form" onSubmit={goNext}>
                <div className="os-2col">
                  <div className="os-field">
                    <label className="os-label">First name</label>
                    <div className="os-inputWrap">
                      <span className="os-ico">👤</span>
                      <input
                        className="os-input"
                        value={owner.firstName}
                        onChange={(e) => onOwnerChange("firstName", e.target.value)}
                        placeholder="Nour"
                        required
                      />
                    </div>
                  </div>

                  <div className="os-field">
                    <label className="os-label">Last name</label>
                    <div className="os-inputWrap">
                      <span className="os-ico">👤</span>
                      <input
                        className="os-input"
                        value={owner.lastName}
                        onChange={(e) => onOwnerChange("lastName", e.target.value)}
                        placeholder="Abusoud"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="os-field">
                  <label className="os-label">Email</label>
                  <div className="os-inputWrap">
                    <span className="os-ico">✉️</span>
                    <input
                      className="os-input"
                      type="email"
                      value={owner.email}
                      onChange={(e) => onOwnerChange("email", e.target.value)}
                      placeholder="owner@email.com"
                      required
                    />
                  </div>
                </div>

                <div className="os-field">
                  <label className="os-label">Phone</label>
                  <div className="os-inputWrap">
                    <span className="os-ico">📞</span>
                    <input
                      className="os-input"
                      value={owner.phone}
                      onChange={(e) => onOwnerChange("phone", e.target.value)}
                      placeholder="+962 79..."
                      required
                    />
                  </div>
                  <div className="os-help">Use the same number you want for admin contact.</div>
                </div>

                <div className="os-field">
                  <label className="os-label">Password</label>
                  <div className="os-passRow">
                    <div className="os-inputWrap">
                      <span className="os-ico">🔒</span>
                      <input
                        className="os-input"
                        type={showPass ? "text" : "password"}
                        value={owner.password}
                        onChange={(e) => onOwnerChange("password", e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                    </div>

                    <button type="button" className="os-eye" onClick={() => setShowPass((v) => !v)}>
                      {showPass ? "🙈" : "👁️"}
                    </button>
                  </div>

                  <div className="os-strength">
                    <div className="os-strengthBar">
                      <div
                        className={`os-strengthFill s${passwordStrength}`}
                        style={{ width: `${(passwordStrength / 4) * 100}%` }}
                      />
                    </div>
                    <span className={`os-strengthText s${passwordStrength}`}>{strengthLabel}</span>
                  </div>
                </div>

                <div className="os-field">
                  <label className="os-label">Confirm password</label>
                  <div className="os-inputWrap">
                    <span className="os-ico">✅</span>
                    <input
                      className="os-input"
                      type="password"
                      value={owner.confirmPassword}
                      onChange={(e) => onOwnerChange("confirmPassword", e.target.value)}
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  {owner.confirmPassword && owner.password !== owner.confirmPassword && (
                    <div className="os-error">Passwords do not match</div>
                  )}
                </div>

                <button className="os-btn" type="submit" disabled={!canGoNext}>
                  Next → Club essentials
                </button>

                <div className="os-small">
                  Already have an account? <Link to="/admin/login">Sign in</Link>
                </div>
              </form>
            ) : (
              <form className="os-form" onSubmit={finish}>
                <div className="os-field">
                  <label className="os-label">Club name</label>
                  <div className="os-inputWrap">
                    <span className="os-ico">🏟️</span>
                    <input
                      className="os-input"
                      value={club.name}
                      onChange={(e) => onClubChange("name", e.target.value)}
                      placeholder="Tropico Padel Club"
                      required
                    />
                  </div>
                </div>

                <div className="os-2col">
                  <div className="os-field">
                    <label className="os-label">City</label>
                    <div className="os-inputWrap">
                      <span className="os-ico">📍</span>
                      <input
                        className="os-input"
                        value={club.city}
                        onChange={(e) => onClubChange("city", e.target.value)}
                        placeholder="Amman"
                        required
                      />
                    </div>
                  </div>

                  <div className="os-field">
                    <label className="os-label">Club phone</label>
                    <div className="os-inputWrap">
                      <span className="os-ico">📞</span>
                      <input
                        className="os-input"
                        value={club.phone}
                        onChange={(e) => onClubChange("phone", e.target.value)}
                        placeholder="+962 79..."
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="os-field">
                  <label className="os-label">Address</label>
                  <div className="os-inputWrap">
                    <span className="os-ico">🗺️</span>
                    <input
                      className="os-input"
                      value={club.address}
                      onChange={(e) => onClubChange("address", e.target.value)}
                      placeholder="Street, area, near landmark..."
                      required
                    />
                  </div>
                  <div className="os-help">Just a short address. Full address can be added later.</div>
                </div>

                <div className="os-2col">
                  <div className="os-field">
                    <label className="os-label">WhatsApp (optional)</label>
                    <div className="os-inputWrap">
                      <span className="os-ico">💬</span>
                      <input
                        className="os-input"
                        value={club.whatsapp}
                        onChange={(e) => onClubChange("whatsapp", e.target.value)}
                        placeholder="+962 79..."
                      />
                    </div>
                  </div>

                  <div className="os-field">
                    <label className="os-label">Maps URL (optional)</label>
                    <div className="os-inputWrap">
                      <span className="os-ico">🔗</span>
                      <input
                        className="os-input"
                        value={club.mapsUrl}
                        onChange={(e) => onClubChange("mapsUrl", e.target.value)}
                        placeholder="https://maps.google.com/..."
                      />
                    </div>
                  </div>
                </div>

                <div className="os-actions">
                  <button type="button" className="os-btnGhost" onClick={goBack}>
                    ← Back
                  </button>
                  <button className="os-btn" type="submit" disabled={!canFinish}>
                    Create club ✅
                  </button>
                </div>
              </form>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}