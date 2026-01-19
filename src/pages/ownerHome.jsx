import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ownerHome.css";
import projectLogo from "../assets/clubs/project-padel.png";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const club = {
    name: "Project Padel",
    location: "KHBP",
    description: "Indoor courts, clean facilities, and fast booking.",
    image: projectLogo,
  };

  const [courts, setCourts] = useState([
    { id: "court1", name: "Court 1", type: "Indoor", price: "25 JD / hour", isActive: true },
    { id: "court2", name: "Court 2", type: "Indoor", price: "25 JD / hour", isActive: true },
    { id: "court3", name: "Court 3", type: "Indoor", price: "30 JD / hour", isActive: true },
    { id: "court4", name: "Court 4", type: "Outdoor", price: "20 JD / hour", isActive: false },
    { id: "court5", name: "Court 5", type: "Indoor", price: "35 JD / hour", isActive: true },
  ]);

  const [reservations] = useState([
    { bookingId: "BK-10491", customer: "Nour Abusoud", court: "Court 1", date: "2025-12-27", time: "21:00 - 22:00" },
    { bookingId: "BK-10492", customer: "Razan", court: "Court 2", date: "2025-12-28", time: "08:00 - 09:00" },
    { bookingId: "BK-10493", customer: "Elias", court: "Court 3", date: "2025-12-29", time: "18:00 - 19:00" },
    { bookingId: "BK-1055", customer: "Nour Abusoud", court: "Court 1", date: "2025-12-27", time: "21:00 - 22:00" },
    { bookingId: "BK-104925", customer: "Razan", court: "Court 2", date: "2025-12-28", time: "08:00 - 09:00" },
    { bookingId: "BK-104936", customer: "Elias", court: "Court 3", date: "2025-12-29", time: "18:00 - 19:00" },
  ]);


  const COURTS_PER_PAGE = 3;
  const [courtsPage, setCourtsPage] = useState(0);

  const courtsPages = Math.max(1, Math.ceil(courts.length / COURTS_PER_PAGE));
  const courtsStart = courtsPage * COURTS_PER_PAGE;
  const courtsView = courts.slice(courtsStart, courtsStart + COURTS_PER_PAGE);

  const prevCourts = () => setCourtsPage((p) => (p - 1 + courtsPages) % courtsPages);
  const nextCourts = () => setCourtsPage((p) => (p + 1) % courtsPages);

  const toggleCourt = (courtId) => {
    setCourts((prev) => prev.map((c) => (c.id === courtId ? { ...c, isActive: !c.isActive } : c)));
  };


  const [resQuery, setResQuery] = useState("");

  const q = resQuery.trim().toLowerCase();
  const filteredReservations = !q
    ? reservations
    : reservations.filter((r) => {
        const all = `${r.bookingId} ${r.customer} ${r.court} ${r.date} ${r.time}`.toLowerCase();
        return all.includes(q);
      });

  return (
    <div className="admin-page">
      {/* HERO */}
      <header className="admin-hero">
        <div className="admin-heroText">
          <div className="admin-heroTop">
            <div>
              <h1 className="admin-title">Club Owner Dashboard</h1>
              <p className="admin-sub">
                Manage your club details, courts, and reservations in one place.
              </p>
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

          <div className="admin-clubCard">
            <div className="admin-clubLogoWrap">
              <img className="admin-clubLogo" src={club.image} alt="Club logo" />
            </div>

            <div className="admin-clubInfo">
              <div className="admin-clubName">{club.name}</div>
              <div className="admin-clubMeta">📍 {club.location}</div>
              <div className="admin-clubDesc">{club.description}</div>

              <div className="admin-actions">
                <button className="admin-outlineBtn" type="button" onClick={() => navigate("/admin/club")}>
                  Edit Club
                </button>
              </div>
            </div>
          </div>
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

          <div className="admin-grid">
            {courtsView.map((c) => (
              <div
                key={c.id}
                className={`admin-card ${c.isActive ? "" : "isHidden"}`}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/admin/courts/${c.id}`)}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/admin/courts/${c.id}`)}
                
              >
                <div className="admin-cardTop">
                  <div className="admin-cardTitle">{c.name}</div>
                  <div className="admin-badge">{c.type}</div>
                </div>

                <div className="admin-cardLine">💰 {c.price}</div>

                <div className="admin-cardBtns" onClick={(e) => e.stopPropagation()}>
  <button
    className="admin-outlineBtn"
    type="button"
    onClick={() => navigate(`/admin/courts/${c.id}`)}
  >
    Edit
  </button>
</div>

<button
  className={`admin-toggle ${c.isActive ? "on" : "off"}`}
  type="button"
  onClick={(e) => {
    toggleCourt(c.id);
  }}
>
  {c.isActive ? "Hide" : "Make Active"}
</button>
              </div>
            ))}
          </div>

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
                  placeholder="Search by booking id, customer, court, date, or time..."
                />
              </div>

              <div className="admin-count">
                Showing <b>{filteredReservations.length}</b> / {reservations.length}
              </div>
            </div>

            <div className="admin-tableScroll">
              <div className="admin-table">
                <div className="admin-row admin-rowHead">
                  <div>Booking</div>
                  <div>Customer</div>
                  <div>Court</div>
                  <div>Date</div>
                  <div>Time</div>
                </div>

                {filteredReservations.length === 0 ? (
                  <div className="admin-empty">No results found.</div>
                ) : (
                  filteredReservations.map((r) => (
                    <div
                      className="admin-row admin-rowClickable"
                      key={r.bookingId}
                      role="button"
                      tabIndex={0}
                      onClick={() => navigate(`/admin/reservations/${r.bookingId}`)}
                      onKeyDown={(e) => e.key === "Enter" && navigate(`/admin/reservations/${r.bookingId}`)}
                      title="Open reservation details"
                    >
                      <div><b>{r.bookingId}</b></div>
                      <div>{r.customer}</div>
                      <div>{r.court}</div>
                      <div>{r.date}</div>
                      <div>{r.time}</div>
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