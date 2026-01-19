import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ownerCourts.css";

import tropicoCover from "../assets/courts/redCourt.jpeg";
import tropicoCover2 from "../assets/courts/3.jpeg";
import projectCover from "../assets/courts/SCR-20251203-uebn.jpeg";
import wepadelCover from "../assets/courts/wepadel-court-cover.jpg";

export default function AdminCourts() {
  const navigate = useNavigate();

  const [courts, setCourts] = useState([
    {
      id: 1,
      clubId: "1",
      courtId: "court1",
      club: "Tropico Padel Club",
      courtName: "Court 1",
      type: "Outdoor",
      cover: tropicoCover,
      location: "Khalda",
      isActive: true,
    },
    {
      id: 2,
      clubId: "1",
      courtId: "court2",
      club: "Tropico Padel Club",
      courtName: "Court 2",
      type: "Indoor",
      cover: tropicoCover2,
      location: "Khalda",
      isActive: true,
    },
    {
      id: 3,
      clubId: "1",
      courtId: "court3",
      club: "Tropico Padel Club",
      courtName: "Court 3",
      type: "Outdoor",
      cover: wepadelCover,
      location: "Khalda",
      isActive: false,
    },
    {
      id: 4,
      clubId: "1",
      courtId: "court4",
      club: "Tropico Padel Club",
      courtName: "Court 4",
      type: "Indoor",
      cover: projectCover,
      location: "Khalda",
      isActive: true,
    },
  ]);

  const [q, setQ] = useState("");
  const [type, setType] = useState("all"); // all | indoor | outdoor
  const [status, setStatus] = useState("all"); // all | active | hidden
  const [filterOpen, setFilterOpen] = useState(false);

  const toggleCourt = (id) => {
    setCourts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const s = q.trim().toLowerCase();

  const filtered = courts.filter((c) => {
    const matchesText =
      !s ||
      c.courtName.toLowerCase().includes(s) ||
      c.type.toLowerCase().includes(s) ||
      c.location.toLowerCase().includes(s);

    const matchesType = type === "all" || c.type.toLowerCase() === type;

    const matchesStatus =
      status === "all" ||
      (status === "active" && c.isActive) ||
      (status === "hidden" && !c.isActive);

    return matchesText && matchesType && matchesStatus;
  });

  return (
    <div className="act-page">
      <div className="act-container">
        {/* TOP BAR */}
        <div className="act-topbar">
          <div className="act-titleBox">
            <div className="act-title">Admin • Courts</div>
            <div className="act-sub">
              Click a court to open details. Use toggle to Active/Hidden quickly.
            </div>
          </div>

          <div className="act-tools">
            {/* SEARCH */}
            <div className="act-search">
              <span className="act-search-ic">🔎</span>
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search by court name, type, or location..."
              />
            </div>

            {/* ACTIONS (Filter + Add) */}
            <div className="act-actions">
              {/* Filter */}
              <div className="act-filterWrap">
                <button
                  className="act-filterBtn"
                  type="button"
                  onClick={() => setFilterOpen((v) => !v)}
                  aria-expanded={filterOpen}
                >
                  <span className="act-filterIc">⏷</span>
                  Filter
                </button>

                {filterOpen && (
                  <div className="act-filterPop">
                    <div className="act-filterTop">
                      <div className="act-filterTitle">Filters</div>
                      <button
                        className="act-x"
                        type="button"
                        onClick={() => setFilterOpen(false)}
                      >
                        ✕
                      </button>
                    </div>

                    {/* TYPE */}
                    <div className="act-filterGroup">
                      <div className="act-filterLabel">Court Type</div>
                      <div className="act-chipRow">
                        {[
                          { id: "all", label: "All" },
                          { id: "outdoor", label: "Outdoor" },
                          { id: "indoor", label: "Indoor" },
                        ].map((t) => (
                          <button
                            key={t.id}
                            className={`act-chip ${type === t.id ? "active" : ""}`}
                            type="button"
                            onClick={() => setType(t.id)}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* STATUS */}
                    <div className="act-filterGroup">
                      <div className="act-filterLabel">Status</div>
                      <div className="act-chipRow">
                        {[
                          { id: "all", label: "All" },
                          { id: "active", label: "Active" },
                          { id: "hidden", label: "Hidden" },
                        ].map((x) => (
                          <button
                            key={x.id}
                            className={`act-chip ${status === x.id ? "active" : ""}`}
                            type="button"
                            onClick={() => setStatus(x.id)}
                          >
                            {x.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="act-filterDivider" />

                    <div className="act-filterActions">
                      <button
                        className="act-clear"
                        type="button"
                        onClick={() => {
                          setType("all");
                          setStatus("all");
                        }}
                      >
                        Clear
                      </button>
                      <button
                        className="act-done"
                        type="button"
                        onClick={() => setFilterOpen(false)}
                      >
                        Done
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Add Court */}
              <button
                className="act-addBtn"
                type="button"
                onClick={() => navigate("/admin/courts/add")}
              >
                + Add Court
              </button>
            </div>
          </div>
        </div>

        {/* CARDS */}
        <div className="act-grid">
          {filtered.map((c) => (
            <article
              key={c.id}
              className={`act-card ${c.isActive ? "" : "isHidden"}`}
              role="button"
              tabIndex={0}
              onClick={() => navigate(`/admin/courts/${c.courtId}`)}
              onKeyDown={(e) => e.key === "Enter" && navigate(`/admin/courts/${c.courtId}`)}
            >
              <div className="act-cover" style={{ backgroundImage: `url(${c.cover})` }}>
                <div className="act-dim" />

                <div className="act-top">
                  <div className="act-courtName">{c.courtName}</div>
                  <div className="act-metaRow">
                    <span className="act-tag">{c.type}</span>
                    <span className={`act-status ${c.isActive ? "on" : "off"}`}>
                      {c.isActive ? "Active" : "Hidden"}
                    </span>
                  </div>
                </div>

                {/* Toggle (STOP card click) */}
                <button
                  className={`act-toggle ${c.isActive ? "on" : "off"}`}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleCourt(c.id);
                  }}
                >
                  {c.isActive ? "Hide" : "Make Active"}
                </button>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="act-empty">
            <div className="act-emptyTitle">No courts found</div>
            <div className="act-emptySub">Try changing search or filters.</div>
          </div>
        )}
      </div>
    </div>
  );
}