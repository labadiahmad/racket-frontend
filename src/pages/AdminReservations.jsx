import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./adminReservations.css";

export default function AdminReservations() {
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([
    {
      bookingId: "BK-10491",
      clubName: "Tropico Padel Club",
      courtName: "Court 1",
      date: "2025-12-27",
      time: "21:00 - 22:00",
      cost: "50 JD",
      name: "Nour Abusoud",
      phone: "0790000000",
      players: ["Nour", "Ahmad", "Majd", "Omar"],
      status: "Reserved",
    },
    {
      bookingId: "BK-10492",
      clubName: "Tropico Padel Club",
      courtName: "Court 2",
      date: "2025-12-28",
      time: "08:00 - 09:00",
      cost: "35 JD",
      name: "Razan",
      phone: "0781234567",
      players: ["Razan", "Hala"],
      status: "Reserved",
    },
    {
      bookingId: "BK-10493",
      clubName: "Tropico Padel Club",
      courtName: "Court 3",
      date: "2025-12-29",
      time: "18:00 - 19:00",
      cost: "20 JD",
      name: "Elias",
      phone: "0772223333",
      players: ["Elias", "Jafar", "Labadi", "Majdi"],
      status: "Cancelled",
    },
  ]);

  // filters
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  // ✅ FILTER PANEL
  const [filterOpen, setFilterOpen] = useState(false);

  // ✅ MODALS
  const [cancelTarget, setCancelTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const normalize = (v) => String(v || "").toLowerCase().trim();

  const matchesSearch = (r) => {
    const q = normalize(query);
    if (!q) return true;

    const hay = [
      r.bookingId,
      r.courtName,
      r.name,
      r.phone,
      r.date,
      r.time,
      r.cost,
      (r.players || []).join(" "),
      r.status,
    ]
      .map(normalize)
      .join(" | ");

    return hay.includes(q);
  };

  const matchesFilters = (r) => {
    const status = r.status || "Reserved";
    if (statusFilter !== "All" && status !== statusFilter) return false;
    if (dateFilter && normalize(r.date) !== normalize(dateFilter)) return false;
    return true;
  };

  const toSortableDate = (r) => {
    const parsed = Date.parse(`${r.date} ${String(r.time || "").slice(0, 5)}`);
    return Number.isFinite(parsed) ? parsed : 0;
  };

  const filtered = reservations
    .filter(matchesSearch)
    .filter(matchesFilters)
    .sort((a, b) => {
      const A = toSortableDate(a);
      const B = toSortableDate(b);
      return sortBy === "newest" ? B - A : A - B;
    });

  const reservedCount = reservations.filter((r) => (r.status || "Reserved") === "Reserved").length;
  const cancelledCount = reservations.filter((r) => (r.status || "Reserved") === "Cancelled").length;

  const resetFilters = () => {
    setQuery("");
    setStatusFilter("All");
    setDateFilter("");
    setSortBy("newest");
  };

  const hasActiveFilters =
    statusFilter !== "All" || Boolean(dateFilter) || sortBy !== "newest";

  const activeFiltersCount =
    (statusFilter !== "All" ? 1 : 0) +
    (dateFilter ? 1 : 0) +
    (sortBy !== "newest" ? 1 : 0);

  // ✅ actions
  const cancelReservation = (bookingId) => {
    setReservations((prev) =>
      prev.map((x) => (x.bookingId === bookingId ? { ...x, status: "Cancelled" } : x))
    );
  };

  const deleteReservation = (bookingId) => {
    setReservations((prev) => prev.filter((x) => x.bookingId !== bookingId));
  };

  const cancelInfo = reservations.find((x) => x.bookingId === cancelTarget);
  const deleteInfo = reservations.find((x) => x.bookingId === deleteTarget);

  return (
    <div className="ar-page">
      <div className="ar-shell">
        {/* HERO */}
        <div className="ar-hero">
          <div className="ar-heroLeft">
            <div className="ar-title">Admin • Reservations</div>
            <div className="ar-sub">Manage reservations.</div>
          </div>

          <div className="ar-heroActions">
            <button
              className="ar-btn ar-btnPrimary"
              type="button"
              onClick={() => navigate("/admin/reservations/add")}
            >
              + Add Reservation
            </button>
          </div>
        </div>

        {/* STATS */}
        <div className="ar-stats">
          <div className="ar-statCard">
            <div>
              <div className="ar-statLabel">Total</div>
              <div className="ar-statHint">All reservations</div>
            </div>
            <div className="ar-statNum">{reservations.length}</div>
          </div>

          <div className="ar-statCard">
            <div>
              <div className="ar-statLabel">Reserved</div>
              <div className="ar-statHint">Active bookings</div>
            </div>
            <div className="ar-statNum">{reservedCount}</div>
          </div>

          <div className="ar-statCard">
            <div>
              <div className="ar-statLabel">Cancelled</div>
              <div className="ar-statHint">Not active</div>
            </div>
            <div className="ar-statNum">{cancelledCount}</div>
          </div>
        </div>

        {/* TOOLBAR (Search + Filter button only) */}
        <div className="ar-toolbar ar-toolbar2">
          <div className="ar-searchWrap">
            <span className="ar-searchIc">⌕</span>
            <input
              className="ar-search"
              placeholder="Search: booking id, court, customer, phone..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            {query && (
              <button className="ar-clear" type="button" onClick={() => setQuery("")}>
                ✕
              </button>
            )}
          </div>

          <div className="ar-toolbarRight">
            <button
              className={`ar-btn ar-btnGhost ar-filterBtn ${hasActiveFilters ? "isActive" : ""}`}
              type="button"
              onClick={() => setFilterOpen((p) => !p)}
            >
              Filters {hasActiveFilters ? <span className="ar-pill">{activeFiltersCount}</span> : null}
            </button>
          </div>

          {/* FILTER PANEL */}
          {filterOpen && (
            <div className="ar-filterPanel" onMouseDown={(e) => e.stopPropagation()}>
              <div className="ar-filterPanelHead">
                <div>
                  <div className="ar-filterPanelTitle">Filters</div>
                  <div className="ar-filterPanelSub">Refine results quickly.</div>
                </div>

                <button className="ar-x" type="button" onClick={() => setFilterOpen(false)}>
                  ✕
                </button>
              </div>

              <div className="ar-filterGrid">
                <div className="ar-filter">
                  <div className="ar-filterLabel">Status</div>
                  <select
                    className="ar-select"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option>All</option>
                    <option>Reserved</option>
                    <option>Cancelled</option>
                  </select>
                </div>

                <div className="ar-filter">
                  <div className="ar-filterLabel">Date</div>
                  <input
                    className="ar-input"
                    type="date"
                    value={dateFilter}
                    onChange={(e) => setDateFilter(e.target.value)}
                  />
                </div>

                <div className="ar-filter">
                  <div className="ar-filterLabel">Sort</div>
                  <select
                    className="ar-select"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </div>
              </div>

              <div className="ar-filterPanelActions">
                <button
                  className="ar-btn ar-btnGhost"
                  type="button"
                  onClick={() => {
                    resetFilters();
                  }}
                >
                  Reset
                </button>

                <button
                  className="ar-btn ar-btnPrimary"
                  type="button"
                  onClick={() => setFilterOpen(false)}
                >
                  Apply
                </button>
              </div>
            </div>
          )}
        </div>

        {/* LIST CARD */}
        <div className="ar-card">
          <div className="ar-cardHead">
            <div>
              <div className="ar-cardTitle">Reservations</div>
              <div className="ar-cardSub">
                Showing <b>{filtered.length}</b> result(s)
              </div>
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="ar-empty">
              <div className="ar-emptyTitle">No reservations found</div>
              <div className="ar-emptySub">Try another search or clear filters.</div>
              <button
                className="ar-btn ar-btnGhost"
                type="button"
                onClick={() => {
                  resetFilters();
                  setFilterOpen(true);
                }}
              >
                Open Filters
              </button>
            </div>
          ) : (
            <div className="ar-list">
              {filtered.map((r) => {
                const status = r.status || "Reserved";
                const isCancelled = status === "Cancelled";

                return (
                  <div
                    key={r.bookingId}
                    className={`ar-itemRow ${isCancelled ? "isCancelled" : "isReserved"}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => navigate(`/admin/reservations/${r.bookingId}`)}
                  >
                    <div className="ar-leftBar" />

                    <div className="ar-main">
                      <div className="ar-topLine">
                        <div className="ar-bookId">{r.bookingId}</div>
                        <span className={`ar-badge ${isCancelled ? "off" : "on"}`}>
                          {isCancelled ? "Cancelled" : "Reserved"}
                        </span>
                      </div>

                      <div className="ar-grid ar-gridNoClub">
                        <div className="ar-cell">
                          <div className="ar-k">Court</div>
                          <div className="ar-v">{r.courtName}</div>
                        </div>

                        <div className="ar-cell">
                          <div className="ar-k">Date</div>
                          <div className="ar-v">{r.date}</div>
                        </div>

                        <div className="ar-cell">
                          <div className="ar-k">Time</div>
                          <div className="ar-v">{r.time}</div>
                        </div>

                        <div className="ar-cell">
                          <div className="ar-k">Customer</div>
                          <div className="ar-v">{r.name}</div>
                          <div className="ar-mini">{r.phone}</div>
                        </div>

                        <div className="ar-cell">
                          <div className="ar-k">Total</div>
                          <div className="ar-v ar-total">{r.cost}</div>
                        </div>
                      </div>

                      <div className="ar-foot">
                        <div className="ar-players">
                          <span className="ar-playersK">Players:</span>
                          <div className="ar-chips">
                            {(r.players || []).slice(0, 6).map((p, i) => (
                              <span key={i} className="ar-chip">
                                {p}
                              </span>
                            ))}
                            {(r.players || []).length > 6 && (
                              <span className="ar-chip ar-chipMore">
                                +{(r.players || []).length - 6}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="ar-actions" onClick={(e) => e.stopPropagation()}>
                          <button
                            className="ar-miniBtn ar-view"
                            type="button"
                            onClick={() => navigate(`/admin/reservations/${r.bookingId}`)}
                          >
                            View
                          </button>

                          {isCancelled ? (
                            <button
                              className="ar-miniBtn ar-del"
                              type="button"
                              onClick={() => setDeleteTarget(r.bookingId)}
                            >
                              Delete
                            </button>
                          ) : (
                            <button
                              className="ar-miniBtn ar-cancel"
                              type="button"
                              onClick={() => setCancelTarget(r.bookingId)}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="ar-chevron">›</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* CANCEL MODAL */}
      {cancelTarget && (
        <div className="ar-modal" onMouseDown={() => setCancelTarget(null)}>
          <div className="ar-modalBox" onMouseDown={(e) => e.stopPropagation()}>
            <div className="ar-modalTitle">Cancel reservation?</div>
            <div className="ar-modalSub">
              This will mark booking <b>{cancelInfo?.bookingId}</b> as <b>Cancelled</b>.
            </div>

            <div className="ar-modalActions">
              <button className="ar-btn ar-btnGhost" type="button" onClick={() => setCancelTarget(null)}>
                Back
              </button>
              <button
                className="ar-btn ar-btnPrimary"
                type="button"
                onClick={() => {
                  cancelReservation(cancelTarget);
                  setCancelTarget(null);
                }}
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteTarget && (
        <div className="ar-modal" onMouseDown={() => setDeleteTarget(null)}>
          <div className="ar-modalBox" onMouseDown={(e) => e.stopPropagation()}>
            <div className="ar-modalTitle">Delete reservation?</div>
            <div className="ar-modalSub">
              This will permanently delete booking <b>{deleteInfo?.bookingId}</b>.
            </div>

            <div className="ar-modalActions">
              <button className="ar-btn ar-btnGhost" type="button" onClick={() => setDeleteTarget(null)}>
                Back
              </button>
              <button
                className="ar-btn ar-btnDanger"
                type="button"
                onClick={() => {
                  deleteReservation(deleteTarget);
                  setDeleteTarget(null);
                }}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}