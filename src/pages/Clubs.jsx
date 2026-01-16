import { useState } from "react";
import "./clubs.css";
import { Link } from "react-router-dom";

import tropicoCover from "../assets/courts/redCourt.jpeg";
import projectCover from "../assets/courts/SCR-20251203-uebn.jpeg";
import wepadelCover from "../assets/courts/wepadel-court-cover.jpg";
import cover364 from "../assets/courts/unnamed2.webp";

import tropicoLogo from "../assets/clubs/tropico.png";
import projectLogo from "../assets/clubs/project-padel.png";
import wepadelLogo from "../assets/clubs/2.png";
import club364Logo from "../assets/clubs/364.png";

import starIcon from "../assets/clubs/star.png";

export default function Clubs() {
  const [q, setQ] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);

  const [sortBy, setSortBy] = useState("top"); 
  const [minRating, setMinRating] = useState(0);
  const [location, setLocation] = useState("all");

  const clubs = [
    {
      id: "1",
      name: "Tropico Padel Club",
      cover: tropicoCover,
      logo: tropicoLogo,
      location: "Marat St",
      rating: 4.9,
      reviews: 120,
    },
    {
      id: "2",
      name: "Project Padel",
      cover: projectCover,
      logo: projectLogo,
      location: "KHBP",
      rating: 3,
      reviews: 83,
    },
    {
      id: "3",
      name: "WePadel",
      cover: wepadelCover,
      logo: wepadelLogo,
      location: "Khalda",
      rating: 2,
      reviews: 61,
    },
    {
      id: "4",
      name: "364 Sports Club",
      cover: cover364,
      logo: club364Logo,
      location: "Madaba",
      rating: 4.6,
      reviews: 130,
    },
  ];

  const locations = ["all"];
  for (let i = 0; i < clubs.length; i++) {
    if (!locations.includes(clubs[i].location)) locations.push(clubs[i].location);
  }

  const search = q.trim().toLowerCase();

  let filtered = clubs.filter((c) => {
    const matchesText =
      !search || c.name.toLowerCase().includes(search) || c.location.toLowerCase().includes(search);

    const matchesRating = c.rating >= minRating;

    const matchesLocation = location === "all" || c.location.toLowerCase() === location.toLowerCase();

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

        <div className="clb-dots">
          <span className="clb-dot active" />
          <span className="clb-dot" />
          <span className="clb-dot" />
          <span className="clb-dot" />
        </div>
      </div>
    </div>
  );
}