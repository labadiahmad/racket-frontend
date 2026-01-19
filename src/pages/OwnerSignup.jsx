import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./ownerSignup.css";

const API_BASE = import.meta.env.VITE_API_URL;
const API = `${API_BASE}/api`;

export default function OwnerSignup({ setOwner }) {
    const navigate = useNavigate();

  // steps: 1 = owner account, 2 = club info
  const [step, setStep] = useState(1);

  // STEP 1 (owner)
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  // STEP 2 (club)
  const [clubName, setClubName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [lat, setLat] = useState("");
  const [lon, setLon] = useState("");
  const [mapsUrl, setMapsUrl] = useState("");
  const [clubPhone, setClubPhone] = useState("");
  const [about, setAbout] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  function safeJsonParse(raw) {
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  function getOwnerFromLS() {
    const raw = localStorage.getItem("owner");
    return raw ? safeJsonParse(raw) : null;
  }

  function ownerHeaders() {
    const o = getOwnerFromLS();
    return {
      "Content-Type": "application/json",
      ...(o?.user_id ? { "x-user-id": String(o.user_id) } : {}),
      ...(o?.role ? { "x-role": String(o.role) } : { "x-role": "owner" }),
    };
  }

 async function apiPost(path, body, headers = {}) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const msg =
      data.message ||
      data.error ||
      data.detail || // sometimes postgres detail comes here
      "Request failed";

    // friendly message for duplicate id / duplicate email
    if (
      String(msg).toLowerCase().includes("duplicate") ||
      String(msg).toLowerCase().includes("unique constraint")
    ) {
      throw new Error("This account already exists. Try logging in instead.");
    }

    throw new Error(msg);
  }

  return data;
}

  // =========================
  // STEP 1: CREATE OWNER
  // =========================
  async function submitOwner(e) {
    e.preventDefault();
    setErr("");

    const payload = {
      full_name: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      password,
      role: "owner",
    };

    if (!payload.full_name || !payload.email || !payload.phone || !payload.password) {
      setErr("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);

      const data = await apiPost("/auth/signup", payload);

      const owner = data.user || data;

       localStorage.setItem("owner", JSON.stringify(owner));
        localStorage.removeItem("user");
        localStorage.setItem("ownerOnboarding", "1"); 
        setOwner?.(owner);
        setStep(2);

    } catch (e2) {
      setErr(e2.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  }

  // =========================
  // STEP 2: CREATE CLUB
  // =========================
  async function submitClub(e) {
    e.preventDefault();
    setErr("");

    const o = getOwnerFromLS();
    if (!o?.user_id) {
      setErr("Owner session missing. Please signup again.");
      return;
    }

    const payload = {
      name: clubName.trim(),
      address: address.trim(),
      city: city.trim(),
      lat: lat ? Number(lat) : null,
      lon: lon ? Number(lon) : null,
      maps_url: mapsUrl.trim() || null,
      phone: clubPhone.trim() || null,
      about: about.trim() || null,
    };

    if (!payload.name || !payload.address || !payload.city) {
      setErr("Please fill Club Name, Address, and City.");
      return;
    }

    try {
      setLoading(true);

      
      await apiPost("/clubs", payload, ownerHeaders());

      localStorage.removeItem("ownerOnboarding"); 
      navigate("/admin");
    } catch (e2) {
      setErr(e2.message || "Failed to create club");
    } finally {
      setLoading(false);
    }
  }
return (
  <div className="os-page">
    <div className="os-shell">
      {/* LEFT PANEL */}
      <div className="os-left">
        <div className="os-leftCard">
          <div className="os-brand">
            <div className="os-logoWrap">
              {/* put your logo here if you want */}
              <span style={{ color: "white", fontWeight: 1000 }}>🏟️</span>
            </div>

            <div>
              <div className="os-name">Racket Owner</div>
              <div className="os-tag">Create owner + club in 2 steps</div>
            </div>
          </div>

          {/* Progress */}
          <div className="os-progress">
            <div className="os-progressTop">
              <div className="os-progressLabel">Progress</div>
              <div className="os-progressValue">{step === 1 ? "50%" : "100%"}</div>
            </div>

            <div className="os-bar">
              <div
                className="os-barFill"
                style={{ width: step === 1 ? "50%" : "100%" }}
              />
            </div>

            <div className="os-steps">
              <div className={`os-step ${step === 1 ? "active" : "done"}`}>
                <div className="os-stepDot">{step === 1 ? "1" : "✓"}</div>
                <div>
                  <div className="os-stepTitle">Owner account</div>
                  <div className="os-stepSub">Create your owner profile</div>
                </div>
              </div>

              <div className={`os-step ${step === 2 ? "active" : ""}`}>
                <div className="os-stepDot">{step === 2 ? "2" : "2"}</div>
                <div>
                  <div className="os-stepTitle">Club info</div>
                  <div className="os-stepSub">Add your club details</div>
                </div>
              </div>
            </div>
          </div>

          <div className="os-note">
            After signup, you will be redirected to the owner dashboard.
          </div>
          <div className="os-mini">
            Tip: Make sure your email is correct because it will be used to login.
          </div>
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="os-right">
        <div className="os-card">
          <Link className="os-back" to="/">
            ← Back
          </Link>

          <div className="os-head">
            <div className="os-kicker">Owner Signup</div>
            <div className="os-title">{step === 1 ? "Create account" : "Create your club"}</div>
            <div className="os-sub">
              {step === 1
                ? "Enter your owner information to create an account."
                : "Now enter your club details to finish setup."}
            </div>
          </div>

          {err && <div className="os-error" style={{ marginTop: 10 }}>{err}</div>}

          {step === 1 ? (
            <form onSubmit={submitOwner} className="os-form">
              <div className="os-2col">
                <div className="os-field">
                  <div className="os-label">Full Name *</div>
                  <div className="os-inputWrap">
                    <div className="os-ico">👤</div>
                    <input
                      className="os-input"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Owner full name"
                    />
                  </div>
                </div>

                <div className="os-field">
                  <div className="os-label">Email *</div>
                  <div className="os-inputWrap">
                    <div className="os-ico">📧</div>
                    <input
                      className="os-input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="owner@email.com"
                    />
                  </div>
                </div>
              </div>

              <div className="os-2col">
                <div className="os-field">
                  <div className="os-label">Phone *</div>
                  <div className="os-inputWrap">
                    <div className="os-ico">📱</div>
                    <input
                      className="os-input"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="07xxxxxxxx"
                    />
                  </div>
                </div>

                <div className="os-field">
                  <div className="os-label">Password *</div>
                  <div className="os-inputWrap">
                    <div className="os-ico">🔒</div>
                    <input
                      className="os-input"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                    />
                  </div>
                </div>
              </div>

              <button className="os-btn" type="submit" disabled={loading}>
                {loading ? "Creating..." : "Next: Club Info"}
              </button>

              <div className="os-small">
                Already an owner? <Link to="/login">Login</Link>
              </div>
            </form>
          ) : (
            <form onSubmit={submitClub} className="os-form">
              <div className="os-2col">
                <div className="os-field">
                  <div className="os-label">Club Name *</div>
                  <div className="os-inputWrap">
                    <div className="os-ico">🏟️</div>
                    <input
                      className="os-input"
                      value={clubName}
                      onChange={(e) => setClubName(e.target.value)}
                      placeholder="Club name"
                    />
                  </div>
                </div>

                <div className="os-field">
                  <div className="os-label">City *</div>
                  <div className="os-inputWrap">
                    <div className="os-ico">🏙️</div>
                    <input
                      className="os-input"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Amman"
                    />
                  </div>
                </div>
              </div>

              <div className="os-field">
                <div className="os-label">Address *</div>
                <div className="os-inputWrap">
                  <div className="os-ico">📍</div>
                  <input
                    className="os-input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Street / area"
                  />
                </div>
              </div>

              <div className="os-field">
                <div className="os-label">Maps URL</div>
                <div className="os-inputWrap">
                  <div className="os-ico">🗺️</div>
                  <input
                    className="os-input"
                    value={mapsUrl}
                    onChange={(e) => setMapsUrl(e.target.value)}
                    placeholder="https://maps.google.com/..."
                  />
                </div>
              </div>

              <div className="os-2col">
                <div className="os-field">
                  <div className="os-label">Latitude</div>
                  <div className="os-inputWrap">
                    <div className="os-ico">🧭</div>
                    <input
                      className="os-input"
                      value={lat}
                      onChange={(e) => setLat(e.target.value)}
                      placeholder="31.95"
                    />
                  </div>
                </div>

                <div className="os-field">
                  <div className="os-label">Longitude</div>
                  <div className="os-inputWrap">
                    <div className="os-ico">🧭</div>
                    <input
                      className="os-input"
                      value={lon}
                      onChange={(e) => setLon(e.target.value)}
                      placeholder="35.91"
                    />
                  </div>
                </div>
              </div>

              <div className="os-field">
                <div className="os-label">Club Phone</div>
                <div className="os-inputWrap">
                  <div className="os-ico">☎️</div>
                  <input
                    className="os-input"
                    value={clubPhone}
                    onChange={(e) => setClubPhone(e.target.value)}
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="os-field">
                <div className="os-label">About</div>
                <div className="os-inputWrap" style={{ height: "auto", padding: 12 }}>
                  <textarea
                    className="os-input"
                    style={{ minHeight: 90, resize: "vertical" }}
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    placeholder="Short club description..."
                  />
                </div>
              </div>

              <div className="os-actions">
                <button
                  type="button"
                  className="os-btnGhost"
                  onClick={() => setStep(1)}
                  disabled={loading}
                >
                  ← Back
                </button>

                <button className="os-btn" type="submit" disabled={loading}>
                  {loading ? "Saving..." : "Finish & Go to Owner Home"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  </div>
);}