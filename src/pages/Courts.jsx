import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./courts.css";

import tropicoCover from "../assets/courts/redCourt.jpeg";
import projectCover from "../assets/courts/SCR-20251203-uebn.jpeg";
import wepadelCover from "../assets/courts/wepadel-court-cover.jpg";

function toISODate(dmy) {
  const parts = dmy.split(",")[1]?.trim(); 
  if (!parts) return "";
  const [dd, mm, yyyy] = parts.split("/");
  if (!dd || !mm || !yyyy) return "";
  return `${yyyy}-${mm}-${dd}`;
}

export default function Courts() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const COURTS = [
    {
      id: 1,
      clubId: "1",
      courtId: "court1",
      club: "Tropico Padel Club",
      courtName: "Court 1",
      type: "Outdoor",
      cover: tropicoCover,
      location: "Khalda",
      date: "Sun, 22/05/2025",
    },
    {
      id: 2,
      clubId: "2",
      courtId: "court1",
      club: "Project Padel",
      courtName: "Court 1",
      type: "Indoor",
      cover: projectCover,
      location: "KHBP",
      date: "Sun, 22/05/2025",
    },
    {
      id: 3,
      clubId: "3",
      courtId: "court1",
      club: "WePadel",
      courtName: "Court 1",
      type: "Outdoor",
      cover: wepadelCover,
      location: "Khalda",
      date: "Sun, 22/05/2025",
    },
  ];

  const [q, setQ] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const [type, setType] = useState("all"); 
  const [location, setLocation] = useState("all"); 
  const [selectedDate, setSelectedDate] = useState(""); 


  useEffect(() => {
    const urlLoc = searchParams.get("location"); 
    const urlDate = searchParams.get("date"); 
    const urlType = searchParams.get("type"); 

    if (urlLoc) setLocation(urlLoc.toLowerCase());
    if (urlDate) setSelectedDate(urlDate);

    if (urlType) setType(urlType.toLowerCase()); 
  }, [searchParams]);

  const locations = ["all"];
  COURTS.forEach((c) => {
    const v = c.location.toLowerCase();
    if (!locations.includes(v)) locations.push(v);
  });

  // ✅ filtering (simple)
  const s = q.trim().toLowerCase();
  const filtered = COURTS.filter((c) => {
    const matchesText =
      !s ||
      c.club.toLowerCase().includes(s) ||
      c.location.toLowerCase().includes(s) ||
      c.type.toLowerCase().includes(s);

    const matchesType = type === "all" || c.type.toLowerCase() === type;
    const matchesLoc = location === "all" || c.location.toLowerCase() === location;

    const isoDate = toISODate(c.date);
    const matchesDate = !selectedDate || isoDate === selectedDate;

    return matchesText && matchesType && matchesLoc && matchesDate;
  });

  const clearFilters = () => {
    setType("all");
    setLocation("all");
    setSelectedDate("");
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

                {/* Date */}
                <div className="crt-filterGroup">
                  <div className="crt-filterLabel">Date</div>

                  <input
                    className="crt-dateInput"
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                  />

                  <div className="crt-dateHint">Tip: select a date to show courts available on that day.</div>
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
              key={c.id}
              className="crt-card"
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/clubs/${c.clubId}/courts/${c.courtId}`)}
              onKeyDown={(e) => e.key === "Enter" && navigate(`/clubs/${c.clubId}/courts/${c.courtId}`)}
            >
              <div className="crt-cover" style={{ backgroundImage: `url(${c.cover})` }}>
                <div className="crt-dim" />

                <div className="crt-top">
                  <div className="crt-title">{c.club}</div>
                  <div className="crt-sub">{c.type}</div>
                </div>

                <div className="crt-bottom">
                  <div className="crt-pill">
                    <span className="crt-ic">📍</span>
                    <span>{c.location}</span>
                  </div>

                  <div className="crt-pill">
                    <span className="crt-ic">🗓️</span>
                    <span>{c.date}</span>
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