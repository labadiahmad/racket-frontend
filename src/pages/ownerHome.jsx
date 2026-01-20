import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ownerHome.css";

const API_BASE = import.meta.env.VITE_API_URL;
const API = `${API_BASE}/api`;

function getOwner() {
  try {
    return JSON.parse(localStorage.getItem("owner"));
  } catch {
    return null;
  }
}

function headersJson() {
  const o = getOwner();
  return {
    "Content-Type": "application/json",
    "x-user-id": String(o?.user_id || ""),
    "x-role": "owner",
  };
}

function headersNoJson() {
  const o = getOwner();
  return {
    "x-user-id": String(o?.user_id || ""),
    "x-role": "owner",
  };
}

function fileUrl(p) {
  if (!p) return "";
  if (p.startsWith("http")) return p;
  return `${API_BASE}${p}`;
}

// ---------- helpers for reservations ----------
function playersText(r) {
  const arr = [r.player1, r.player2, r.player3, r.player4].filter(Boolean);
  return arr.length ? arr.join(" • ") : "—";
}

function dateText(r) {
  return formatDateOnly(r.date_iso) || "—";
}

function timeRangeText(r) {
  const from = formatTime(r.time_from || r.start_time);
  const to = formatTime(r.time_to || r.end_time);
  if (from === "—" && to === "—") return "—";
  return `${from} → ${to}`;
}

function formatDateOnly(iso) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "";
    return d.toLocaleDateString();
  } catch {
    return "";
  }
}

function formatTime(t) {
  if (!t) return "—";
  // "08:00:00" -> "08:00"
  const s = String(t);
  return s.length >= 5 ? s.slice(0, 5) : s;
}

function startEndText(r) {
  // date_iso + time_from/time_to
  const date = formatDateOnly(r.date_iso);
  const from = formatTime(r.time_from || r.start_time); // fallback for old key
  const to = formatTime(r.time_to || r.end_time);       // fallback for old key
  if (!date && (from === "—" && to === "—")) return "—";
  if (!date) return `${from} → ${to}`;
  return `${date} • ${from} → ${to}`;
}

function courtText(r) {
  return r.court_name || (r.court_id ? `#${r.court_id}` : "—");
}

function totalText(r) {
  const v = r.total_price ?? r.total ?? r.price;
  if (v === undefined || v === null || v === "") return "—";
  const n = Number(v);
  return Number.isFinite(n) ? `${n} JD` : "—";
}

export default function OwnerHome() {
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [courts, setCourts] = useState([]);
  const [reservations, setReservations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const COURTS_PER_PAGE = 3;
  const [courtsPage, setCourtsPage] = useState(0);

  const [resQuery, setResQuery] = useState("");

  useEffect(() => {
    const o = getOwner();
    if (!o?.user_id) {
      navigate("/login", { replace: true });
      return;
    }

    let alive = true;

    async function load() {
      try {
        setLoading(true);
        setErr("");

        const res = await fetch(`${API}/owner/dashboard`, {
          headers: headersNoJson(),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || data.error || "Failed to load dashboard");
        if (!alive) return;

        setClub(data.club || null);
        setCourts(Array.isArray(data.courts) ? data.courts : []);
        const res2 = await fetch(`${API}/reservations`, { headers: headersNoJson() });
        const resData = await res2.json().catch(() => ([]));
if (!res2.ok) throw new Error(resData.message || resData.error || "Failed to load reservations");

        setReservations(Array.isArray(resData) ? resData : []);
        setCourtsPage(0);
      } catch (e) {
        if (!alive) return;
        setErr(e.message || "Server error");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    load();
    return () => {
      alive = false;
    };
  }, [navigate]);

  const courtsPages = Math.max(1, Math.ceil(courts.length / COURTS_PER_PAGE));
  const courtsStart = courtsPage * COURTS_PER_PAGE;
  const courtsView = courts.slice(courtsStart, courtsStart + COURTS_PER_PAGE);

  function prevCourts() {
    setCourtsPage((p) => (p - 1 + courtsPages) % courtsPages);
  }
  function nextCourts() {
    setCourtsPage((p) => (p + 1) % courtsPages);
  }

  async function toggleCourt(court) {
    try {
      const res = await fetch(`${API}/courts/${court.court_id}`, {
        method: "PUT",
        headers: headersJson(),
        body: JSON.stringify({ is_active: !court.is_active }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.error || "Failed to update court");

      const updated = data.court || data;

      setCourts((prev) => prev.map((c) => (c.court_id === updated.court_id ? updated : c)));
    } catch (e) {
      alert(e.message || "Failed");
    }
  }

  // ✅ filter reservations (now includes players, court_name, start/end, total)
  const q = resQuery.trim().toLowerCase();
  const filteredReservations = !q
    ? reservations
    : reservations.filter((r) => {
        const text = `
          ${r.reservation_id || ""}
          ${r.booking_id || ""}
          ${r.booked_by_name || ""}
          ${r.status || ""}
          ${r.court_id || ""}
          ${r.court_name || ""}
          ${r.date_iso || ""}
          ${r.time_from || r.start_time || ""}
          ${r.time_to || r.end_time || ""}
          ${r.total_price || r.total || r.price || ""}
          ${r.player1 || ""} ${r.player2 || ""} ${r.player3 || ""} ${r.player4 || ""}
        `.toLowerCase();
        return text.includes(q);
      });

  if (loading) return <div style={{ padding: 120 }}>Loading owner dashboard...</div>;
  if (err) return <div style={{ padding: 120, color: "crimson" }}>{err}</div>;

  return (
    <div className="admin-page">
      <header className="admin-hero">
        <div className="admin-heroText">
          <div className="admin-heroTop">
            <div>
              <h1 className="admin-title">Club Owner Dashboard</h1>
              <p className="admin-sub">Manage your club, courts, and reservations.</p>
            </div>
          </div>

          <div className="admin-quick">
            <button className="admin-outlineBtn" type="button" onClick={() => navigate("/admin/club")}>
              Edit Club
            </button>

            <button className="admin-outlineBtn" type="button" onClick={() => navigate("/admin/reservations")}>
              View Reservations
            </button>

            <button className="admin-outlineBtn" type="button" onClick={() => navigate("/admin/courts")}>
              Manage Courts
            </button>
          </div>
        </div>
      </header>

      <div className="admin-container">
        {/* CLUB */}
        <section className="admin-section">
          <div className="admin-sectionHead">
            <h2>Club Overview</h2>
            <button className="admin-linkBtn" type="button" onClick={() => navigate("/admin/club")}>
              See details <span className="admin-arrow">→</span>
            </button>
          </div>

          {!club ? (
            <div className="admin-empty">No club found for this owner.</div>
          ) : (
            <div className="admin-clubCard">
              <div className="admin-clubLogoWrap">
                <img
                  className="admin-clubLogo"
                  src={club.logo_url ? fileUrl(club.logo_url) : "/vite.svg"}
                  alt="Club logo"
                  onError={(e) => (e.currentTarget.style.display = "none")}
                />
              </div>

              <div className="admin-clubInfo">
                <div className="admin-clubName">{club.name}</div>
                <div className="admin-clubMeta">📍 {club.city} • {club.address}</div>
                <div className="admin-clubDesc">{club.about || "No description yet."}</div>

                <div className="admin-actions">
                  <button className="admin-outlineBtn" type="button" onClick={() => navigate("/admin/club")}>
                    Edit Club
                  </button>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* COURTS */}
        <section className="admin-section">
          <div className="admin-sectionHead">
            <h2>Your Courts</h2>

            <div className="admin-rightTools">
              {courtsPages > 1 && (
                <div className="admin-navBtns">
                  <button className="admin-navBtn" type="button" onClick={prevCourts} aria-label="Previous courts">
                    ‹
                  </button>
                  <button className="admin-navBtn" type="button" onClick={nextCourts} aria-label="Next courts">
                    ›
                  </button>
                </div>
              )}

              <button className="admin-linkBtn" type="button" onClick={() => navigate("/admin/courts")}>
                See all <span className="admin-arrow">→</span>
              </button>
            </div>
          </div>

          {courts.length === 0 ? (
            <div className="admin-empty">No courts yet. Add your first one.</div>
          ) : (
            <div className="admin-grid">
              {courtsView.map((c) => (
                <div
                  key={c.court_id}
                  className={`admin-card ${c.is_active ? "" : "isHidden"}`}
                  role="button"
                  tabIndex={0}
                  onClick={() => navigate(`/admin/courts/${c.court_id}`)}
                  onKeyDown={(e) => e.key === "Enter" && navigate(`/admin/courts/${c.court_id}`)}
                >
                  <div className="admin-cardTop">
                    <div className="admin-cardTitle">{c.name}</div>
                    <div className="admin-badge">{c.type || "Court"}</div>
                  </div>

                  <div className="admin-cardLine">🏷️ {c.surface || "—"} • Max: {c.max_players || 4}</div>

                  <div className="admin-cardBtns" onClick={(e) => e.stopPropagation()}>
                    <button className="admin-outlineBtn" type="button" onClick={() => navigate(`/admin/courts/${c.court_id}`)}>
                      Edit
                    </button>
                  </div>

                  <button
                    className={`admin-toggle ${c.is_active ? "on" : "off"}`}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCourt(c);
                    }}
                  >
                    {c.is_active ? "Hide" : "Make Active"}
                  </button>
                </div>
              ))}
            </div>
          )}

          {courtsPages > 1 && (
            <div className="admin-dots">
              {Array.from({ length: courtsPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`admin-dot ${i === courtsPage ? "active" : ""}`}
                  onClick={() => setCourtsPage(i)}
                  aria-label={`Courts page ${i + 1}`}
                />
              ))}
            </div>
          )}
        </section>

        {/* RESERVATIONS */}
        <section className="admin-section">
          <div className="admin-sectionHead">
            <h2>Recent Reservations</h2>

            <div className="admin-rightTools">
              <button className="admin-outlineBtn" type="button" onClick={() => navigate("/admin/reservations/add")}>
                + Add Reservation
              </button>

              <button className="admin-linkBtn" type="button" onClick={() => navigate("/admin/reservations")}>
                See all <span className="admin-arrow">→</span>
              </button>
            </div>
          </div>

          <div className="admin-tableWrap">
            <div className="admin-tableTools">
              <div className="admin-search">
                <span className="admin-searchIc">🔎</span>
                <input
                  value={resQuery}
                  onChange={(e) => setResQuery(e.target.value)}
                  placeholder="Search id, name, court, players, status..."
                />
              </div>

              <div className="admin-count">
                Showing <b>{filteredReservations.length}</b> / {reservations.length}
              </div>
            </div>

            <div className="admin-tableScroll">
              <div className="admin-table">
                <div className="admin-row admin-rowHead">
  <div>ID</div>
  <div>Players</div>
  <div>Court</div>
  <div>Date</div>
  <div>Start - End</div>
  <div>Total</div>
  <div>Status</div>
</div>

                {filteredReservations.length === 0 ? (
                  <div className="admin-empty">No results found.</div>
                ) : (
                  filteredReservations.slice(0, 8).map((r) => (
                    <div
                      className="admin-row admin-rowClickable"
                      key={r.reservation_id}
                      role="button"
                      tabIndex={0}
                      onClick={() => navigate(`/admin/reservations/${r.reservation_id}`)}
                      onKeyDown={(e) => e.key === "Enter" && navigate(`/admin/reservations/${r.reservation_id}`)}
                    >
                      <div><b>{r.reservation_id}</b></div>
                      <div title={playersText(r)}>{playersText(r)}</div>
                      <div>{courtText(r)}</div>
                      <div>{dateText(r)}</div>
                      <div>{timeRangeText(r)}</div>
                      <div>{totalText(r)}</div>
                      <div>{r.status || "—"}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}