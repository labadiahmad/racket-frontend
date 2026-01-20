import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ownerCourts.css";

const API_BASE = import.meta.env.VITE_API_URL;
const API = `${API_BASE}/api`;

function safeJson(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function getOwner() {
  const raw = localStorage.getItem("owner");
  return raw ? safeJson(raw) : null;
}

function ownerHeaders(json = true) {
  const o = getOwner();
  const h = {
    "x-role": "owner",
    "x-user-id": String(o?.user_id || ""),
  };
  if (json) h["Content-Type"] = "application/json";
  return h;
}

function fileUrl(p) {
  if (!p) return "";
  if (p.startsWith("http")) return p;
  return `${API_BASE}${p}`;
}

export default function OwnerCourts() {
  const navigate = useNavigate();

  const [club, setClub] = useState(null);
  const [courts, setCourts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");
  const [togglingId, setTogglingId] = useState(null);

  const [q, setQ] = useState("");
  const [type, setType] = useState("all"); // all | indoor | outdoor
  const [status, setStatus] = useState("all"); // all | active | hidden
  const [filterOpen, setFilterOpen] = useState(false);

  useEffect(() => {
    const o = getOwner();
    if (!o?.user_id) {
      navigate("/login", { replace: true });
      return;
    }

    let alive = true;

    async function loadCourts() {
      try {
        setLoading(true);
        setErr("");
        setMsg("");

        const res = await fetch(`${API}/owner/dashboard`, {
          headers: ownerHeaders(false),
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.message || data.error || "Failed to load courts");

        if (!alive) return;

        setClub(data.club || null);
        setCourts(Array.isArray(data.courts) ? data.courts : []);
      } catch (e) {
        if (!alive) return;
        setErr(e.message || "Server error");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    loadCourts();
    return () => {
      alive = false;
    };
  }, [navigate]);

  async function toggleCourt(court) {
    try {
      setErr("");
      setMsg("");
      setTogglingId(court.court_id);

      const res = await fetch(`${API}/courts/${court.court_id}`, {
        method: "PUT",
        headers: ownerHeaders(true),
        body: JSON.stringify({ is_active: !court.is_active }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || data.error || "Failed to update court");

      const updated = data.court || data;

      setCourts((prev) =>
        prev.map((c) => (c.court_id === updated.court_id ? updated : c))
      );

      setMsg(updated.is_active ? "Court is active ✅" : "Court is hidden ✅");
    } catch (e) {
      setErr(e.message || "Failed");
    } finally {
      setTogglingId(null);
    }
  }

  const s = q.trim().toLowerCase();

  const filtered = courts.filter((c) => {
    const name = String(c.name || "").toLowerCase();
    const t = String(c.type || "").toLowerCase(); 
    const surface = String(c.surface || "").toLowerCase();

    const matchesText = !s || name.includes(s) || t.includes(s) || surface.includes(s);

    const matchesType = type === "all" || t === type;

    const matchesStatus =
      status === "all" ||
      (status === "active" && !!c.is_active) ||
      (status === "hidden" && !c.is_active);

    return matchesText && matchesType && matchesStatus;
  });

  if (loading) return <div className="act-page"><div className="act-container">Loading...</div></div>;

  return (
    <div className="act-page">
      <div className="act-container">
        {/* TOP BAR */}
        <div className="act-topbar">
          <div className="act-titleBox">
            <div className="act-title">Owner • Courts</div>
            <div className="act-sub">
              {club?.name ? `Club: ${club.name}. ` : ""}
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
                placeholder="Search by court name, type, or surface..."
              />
            </div>

            {/* ACTIONS */}
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

        {(err || msg) && (
          <div className={`act-note ${err ? "isErr" : "isOk"}`}>
            {err || msg}
          </div>
        )}

        {/* CARDS */}
        <div className="act-grid">
          {filtered.map((c) => {
            const cover =
              fileUrl(c.cover_url || c.image_url || "") || "";

            return (
              <article
                key={c.court_id}
                className={`act-card ${c.is_active ? "" : "isHidden"}`}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/admin/courts/${c.court_id}`)}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/admin/courts/${c.court_id}`)}
              >
                <div
                  className="act-cover"
                  style={
                    cover
                      ? { backgroundImage: `url(${cover})` }
                      : { backgroundImage: "linear-gradient(180deg, rgba(21,34,51,.20), rgba(11,27,43,.82))" }
                  }
                >
                  <div className="act-dim" />

                  <div className="act-top">
                    <div className="act-courtName">{c.name || `Court #${c.court_id}`}</div>

                    <div className="act-metaRow">
                      <span className="act-tag">{c.type || "Court"}</span>
                      <span className={`act-status ${c.is_active ? "on" : "off"}`}>
                        {c.is_active ? "Active" : "Hidden"}
                      </span>
                    </div>

                    <div className="act-subMeta">
  {c.surface ? `Surface: ${c.surface}` : ""}
  {c.max_players ? ` • Max: ${c.max_players}` : ""}
</div>
                  </div>

                  {/* Toggle */}
                  <button
                    className={`act-toggle ${c.is_active ? "on" : "off"}`}
                    type="button"
                    disabled={togglingId === c.court_id}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleCourt(c);
                    }}
                  >
                    {togglingId === c.court_id
                      ? "Updating..."
                      : c.is_active
                      ? "Hide"
                      : "Make Active"}
                  </button>
                </div>
              </article>
            );
          })}
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