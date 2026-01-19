import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./courts.css";

export default function Courts() {
  const API = import.meta.env.VITE_API_URL;

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [q, setQ] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const [type, setType] = useState("all");
  const [location, setLocation] = useState("all");

  const [courts, setCourts] = useState([]);

  function absUrl(u) {
    if (!u) return "";
    if (u.startsWith("http")) return u;
    if (u.startsWith("/uploads")) return API + u;
    return u;
  }

  useEffect(() => {
    const urlLoc = searchParams.get("location");
    const urlType = searchParams.get("type");

    if (urlLoc) setLocation(urlLoc.toLowerCase());
    if (urlType) setType(urlType.toLowerCase());
  }, [searchParams]);

  useEffect(() => {
    async function loadCourts() {
      try {
        const res = await fetch(`${API}/api/courts`);
        const data = await res.json().catch(() => []);

        if (!res.ok) {
          console.error("Courts API error:", data?.message || "Failed to load courts");
          setCourts([]);
          return;
        }

        setCourts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Courts API error:", err);
        setCourts([]);
      }
    }

    loadCourts();
  }, []);

  const locations = ["all"];
  for (let i = 0; i < courts.length; i++) {
    const city = (courts[i].club_city || "").trim();
    if (!city) continue;
    const v = city.toLowerCase();
    if (!locations.includes(v)) locations.push(v);
  }

  const s = q.trim().toLowerCase();

  const filtered = courts.filter((c) => {
    const clubText = `${c.club_name || ""} ${c.club_city || ""} ${c.club_address || ""}`.toLowerCase();

    const matchesText =
      !s ||
      clubText.includes(s) ||
      String(c.type || "").toLowerCase().includes(s) ||
      String(c.name || "").toLowerCase().includes(s);

    const matchesType = type === "all" || String(c.type || "").toLowerCase() === type;

    const city = String(c.club_city || "").toLowerCase();
    const matchesLoc = location === "all" || city === location;

    return matchesText && matchesType && matchesLoc;
  });

  const clearFilters = () => {
    setType("all");
    setLocation("all");
    setFilterOpen(false);
  };

  const onSearchClick = () => setFilterOpen(false);

  return (
    <div className="crt-page">
      <div className="crt-container">
        {/* Top Bar */}
        <div className="crt-topbar">
          <div className="crt-search">
            <span className="crt-search-ic">🔎</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by club, type, or location..."
            />
            <button className="crt-search-btn" type="button" onClick={onSearchClick}>
              Search
            </button>
          </div>

          <div className="crt-filterWrap">
            <button
              className="crt-filter"
              type="button"
              onClick={() => setFilterOpen(!filterOpen)}
              aria-expanded={filterOpen}
            >
              <span className="crt-filter-ic">⏷</span>
              Filter
            </button>

            {filterOpen && (
              <div className="crt-filterPop">
                <div className="crt-filterTop">
                  <div className="crt-filterTitle">Filters</div>
                  <button className="crt-x" type="button" onClick={() => setFilterOpen(false)}>
                    ✕
                  </button>
                </div>

                {/* Type */}
                <div className="crt-filterGroup">
                  <div className="crt-filterLabel">Court Type</div>
                  <div className="crt-chipRow">
                    {[
                      { id: "all", label: "All" },
                      { id: "outdoor", label: "Outdoor" },
                      { id: "indoor", label: "Indoor" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        className={`crt-chip ${type === t.id ? "active" : ""}`}
                        onClick={() => setType(t.id)}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Location */}
                <div className="crt-filterGroup">
                  <div className="crt-filterLabel">Location</div>
                  <div className="crt-chipRow">
                    {locations.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        className={`crt-chip ${location === loc ? "active" : ""}`}
                        onClick={() => setLocation(loc)}
                      >
                        {loc === "all" ? "All" : loc.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="crt-filterDivider" />

                <div className="crt-filterActions">
                  <button className="crt-clear" type="button" onClick={clearFilters}>
                    Clear
                  </button>
                  <button className="crt-done" type="button" onClick={() => setFilterOpen(false)}>
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cards */}
        <div className="crt-grid">
          {filtered.map((c) => (
            <article
              key={`${c.club_id}-${c.court_id}`}
              className="crt-card"
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/clubs/${c.club_id}/courts/${c.court_id}`)}
              onKeyDown={(e) => e.key === "Enter" && navigate(`/clubs/${c.club_id}/courts/${c.court_id}`)}
            >
              <div className="crt-cover" style={{ backgroundImage: `url(${absUrl(c.cover_url || "")})` }}>
                <div className="crt-dim" />

                <div className="crt-top">
                  <div className="crt-title">{c.club_name || "Club"}</div>
                </div>

                <div className="crt-bottom">
                  <div className="crt-pill">
                    <span className="crt-ic">🎾</span>
                    <span>{c.type || "Court"}</span>
                  </div>

                  <div className="crt-pill">
                    <span className="crt-ic">📍</span>
                    <span>{c.club_city || c.club_address || ""}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="crt-empty">
            <div className="crt-emptyTitle">No courts found</div>
            <div className="crt-emptySub">Try changing your search or filters.</div>
          </div>
        )}
      </div>
    </div>
  );
}