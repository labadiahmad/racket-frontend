import { useState, useEffect } from "react";
import "./clubs.css";
import { Link } from "react-router-dom";

import starIcon from "../assets/clubs/star.png";

export default function Clubs() {
  const API = import.meta.env.VITE_API_URL;

  function absUrl(u) {
    if (!u) return "";
    if (u.startsWith("http")) return u;
    if (u.startsWith("/uploads")) return API + u; 
    return u;
  }

  const [q, setQ] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const [sortBy, setSortBy] = useState("top");
  const [minRating, setMinRating] = useState(0);
  const [location, setLocation] = useState("all");

  const [clubs, setClubs] = useState([]);

  useEffect(() => {
    async function loadClubs() {
      try {
        const res = await fetch(`${API}/api/clubs`);
        const data = await res.json().catch(() => []);

        if (!res.ok) {
          console.error("Clubs API error:", data?.message || "Failed to load clubs");
          setClubs([]);
          return;
        }

        const mapped = (data || []).map((c) => ({
          id: String(c.club_id),
          name: c.name || "",
          cover: absUrl(c.cover_url || ""),
          logo: absUrl(c.logo_url || ""),
          location: c.address || c.city || "",
          rating: Number(c.avg_rating ?? 0),
          reviews: Number(c.reviews_count ?? 0),
        }));

        setClubs(mapped);
      } catch (err) {
        console.error("Clubs API error:", err);
        setClubs([]);
      }
    }

    loadClubs();
  }, []);

  const locations = ["all"];
  for (let i = 0; i < clubs.length; i++) {
    if (!locations.includes(clubs[i].location)) locations.push(clubs[i].location);
  }

  const search = q.trim().toLowerCase();

  let filtered = clubs.filter((c) => {
    const matchesText =
      !search || c.name.toLowerCase().includes(search) || c.location.toLowerCase().includes(search);

    const matchesRating = c.rating >= minRating;

    const matchesLocation =
      location === "all" || c.location.toLowerCase() === location.toLowerCase();

    return matchesText && matchesRating && matchesLocation;
  });

  filtered.sort((a, b) => {
    if (sortBy === "top") return b.rating - a.rating;
    if (sortBy === "reviews") return b.reviews - a.reviews;
    if (sortBy === "az") return a.name.localeCompare(b.name);
    return 0;
  });

  const clearFilters = () => {
    setSortBy("top");
    setMinRating(0);
    setLocation("all");
    setFilterOpen(false);
  };

  return (
    <div className="clb-page">
      <div className="clb-container">
        <div className="clb-top">
          <div className="clb-search">
            <span className="clb-search-ic">🔎</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name to find your next game..."
            />
            <button className="clb-search-btn" type="button">
              Search
            </button>
          </div>

          <div className="clb-filterWrap">
            <button className="clb-filter" type="button" onClick={() => setFilterOpen(!filterOpen)}>
              <span className="clb-filter-ic">⏷</span>
              Filter
            </button>

            {filterOpen && (
              <div className="clb-filterPop">
                <div className="clb-filterTop">
                  <div className="clb-filterTitle">Filters</div>
                  <button className="clb-x" type="button" onClick={() => setFilterOpen(false)}>
                    ✕
                  </button>
                </div>

                {/* Sort */}
                <div className="clb-filterGroup">
                  <div className="clb-filterLabel">Sort by</div>
                  <div className="clb-chipRow">
                    <button
                      type="button"
                      className={`clb-chip ${sortBy === "top" ? "active" : ""}`}
                      onClick={() => setSortBy("top")}
                    >
                      ⭐ Top Rated
                    </button>
                    <button
                      type="button"
                      className={`clb-chip ${sortBy === "reviews" ? "active" : ""}`}
                      onClick={() => setSortBy("reviews")}
                    >
                      💬 Most Reviews
                    </button>
                    <button
                      type="button"
                      className={`clb-chip ${sortBy === "az" ? "active" : ""}`}
                      onClick={() => setSortBy("az")}
                    >
                      A → Z
                    </button>
                  </div>
                </div>

                {/* Location */}
                <div className="clb-filterGroup">
                  <div className="clb-filterLabel">Location</div>
                  <div className="clb-chipRow">
                    {locations.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        className={`clb-chip ${location === loc ? "active" : ""}`}
                        onClick={() => setLocation(loc)}
                      >
                        {loc === "all" ? "All" : loc}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Min rating */}
                <div className="clb-filterGroup">
                  <div className="clb-filterLabel">Minimum Rating</div>

                  <div className="clb-rangeMeta">
                    <span>{minRating.toFixed(1)}+</span>
                    <span>5.0</span>
                  </div>

                  <input
                    className="clb-range"
                    type="range"
                    min="0"
                    max="5"
                    step="0.1"
                    value={minRating}
                    onChange={(e) => setMinRating(Number(e.target.value))}
                  />
                </div>

                <div className="clb-filterDivider" />

                <div className="clb-filterActions">
                  <button className="clb-clear" type="button" onClick={clearFilters}>
                    Clear
                  </button>
                  <button className="clb-done" type="button" onClick={() => setFilterOpen(false)}>
                    Done
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Cards */}
        <div className="clb-grid">
          {filtered.map((c) => (
            <Link key={c.id} to={`/clubs/${c.id}`} className="clb-cardLink">
              <article className="clb-card">
                <div className="clb-cover" style={{ backgroundImage: `url(${c.cover})` }}>
                  <div className="clb-dim" />
                  <div className="clb-title">{c.name}</div>

                  <div className="clb-logoWrap">
                    <div className="clb-logoPlate">
                      <img className="clb-logo" src={c.logo} alt={`${c.name} logo`} />
                    </div>
                  </div>

                  <div className="clb-bottom">
                    <div className="clb-locGlass">
                      <span className="clb-pin">📍</span>
                      <span>{c.location}</span>
                    </div>

                    <div className="clb-starsRow">
                      {Array.from({ length: Math.round(c.rating) }).map((_, idx) => (
                        <img key={idx} className="clb-star" src={starIcon} alt="star" />
                      ))}
                    </div>

                    <div className="clb-reviewsText">(+{c.reviews} Reviews)</div>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}