import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./adminReservationDetails.css";

import tropicoCover from "../assets/courts/redCourt.jpeg";
import projectCover from "../assets/courts/SCR-20251203-uebn.jpeg";
import wepadelCover from "../assets/courts/wepadel-court-cover.jpg";

function cleanPlayers(txt) {
  return (txt || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function makeSlots(priceFrom) {
  return [
    { id: "s1", from: "08:00", to: "09:00", price: priceFrom },
    { id: "s2", from: "09:00", to: "10:00", price: priceFrom + 20 },
    { id: "s3", from: "18:00", to: "19:00", price: priceFrom + 10 },
    { id: "s4", from: "21:00", to: "22:00", price: priceFrom + 20 },
    { id: "s5", from: "22:00", to: "23:00", price: priceFrom + 20 },
  ];
}

function slotLabel(s) {
  return `${s.from} - ${s.to}`;
}

export default function AdminReservationDetails() {
  const navigate = useNavigate();
  const { bookingId } = useParams();

  const [courts] = useState([
    {
      id: "court1",
      name: "Court 1",
      image: tropicoCover,
      type: "Outdoor Premium Court",
      surface: "Pro Turf",
      lighting: "LED Night Lighting",
      maxPlayers: 4,
      priceFrom: 30,
      features: ["Glass walls", "Pro turf", "Outdoor", "Seating area"],
      rules: ["Arrive 10 minutes early.", "Only court shoes allowed.", "Max 4 players per booking.", "Leave the court on the hour."],
    },
    {
      id: "court2",
      name: "Court 2",
      image: wepadelCover,
      type: "Indoor Court",
      surface: "Premium Turf",
      lighting: "Indoor Lighting",
      maxPlayers: 4,
      priceFrom: 35,
      features: ["Indoor", "AC", "Premium turf", "Quiet zone"],
      rules: ["Indoor is a quiet zone.", "No wet shoes allowed.", "Max 4 players per booking."],
    },
    {
      id: "court3",
      name: "Court 3",
      image: projectCover,
      type: "Outdoor Court",
      surface: "Pro Turf",
      lighting: "LED Night Lighting",
      maxPlayers: 4,
      priceFrom: 20,
      features: ["Outdoor", "Pro turf", "Seating area"],
      rules: ["Arrive on time.", "Max 4 players per booking."],
    },
  ]);

  const [reservations, setReservations] = useState([
    {
      bookingId: "BK-10491",
      courtId: "court1",
      date: "2025-12-27",
      slotId: "s4",
      time: "21:00 - 22:00",
      cost: "50 JD",
      name: "Nour Abusoud",
      phone: "0790000000",
      players: ["Nour", "Ahmad", "Majd", "Omar"],
      status: "Reserved",
      notes: "Customer requested a quiet corner if possible.",
    },
    {
      bookingId: "BK-10492",
      courtId: "court2",
      date: "2025-12-28",
      slotId: "s1",
      time: "08:00 - 09:00",
      cost: "35 JD",
      name: "Razan",
      phone: "0781234567",
      players: ["Razan", "Hala"],
      status: "Reserved",
      notes: "",
    },
    {
      bookingId: "BK-10493",
      courtId: "court3",
      date: "2025-12-29",
      slotId: "s3",
      time: "18:00 - 19:00",
      cost: "30 JD",
      name: "Elias",
      phone: "0772223333",
      players: ["Elias", "Jafar", "Labadi", "Majdi"],
      status: "Cancelled",
      notes: "Cancelled by admin.",
    },
  ]);

  const found = reservations.find((r) => r.bookingId === bookingId);

  if (!found) {
    return (
      <div className="ard-page">
        <div className="ard-shell">
          <div className="ard-card">
            <div className="ard-title">Reservation not found</div>
            <div className="ard-sub">This booking id does not exist.</div>
            <button className="ard-btn ard-btnPrimary" onClick={() => navigate("/admin/reservations")}>
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(null);

  const [cancelOpen, setCancelOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  useEffect(() => {
    const copy = { ...found, playersText: (found.players || []).join(", ") };

    const c = courts.find((x) => x.id === copy.courtId);
    const s = makeSlots(c ? c.priceFrom : 0);
    if (!copy.slotId && s[0]) {
      copy.slotId = s[0].id;
      copy.time = slotLabel(s[0]);
      copy.cost = `${s[0].price} JD`;
    }

    setDraft(copy);
    setIsEditing(false);
    setCancelOpen(false);
    setDeleteOpen(false);
  }, [bookingId]);

  const status = found.status || "Reserved";
  const isCancelled = status === "Cancelled";

  const update = (key, value) => setDraft((p) => ({ ...p, [key]: value }));

  const changeCourt = (newCourtId) => {
    const newCourt = courts.find((c) => c.id === newCourtId);
    const newSlots = makeSlots(newCourt ? newCourt.priceFrom : 0);
    const first = newSlots[0];

    setDraft((p) => ({
      ...p,
      courtId: newCourtId,
      slotId: first ? first.id : "",
      time: first ? slotLabel(first) : "",
      cost: first ? `${first.price} JD` : "",
    }));
  };

  const changeSlot = (newSlotId) => {
    const c = courts.find((x) => x.id === (draft?.courtId || found.courtId));
    const list = makeSlots(c ? c.priceFrom : 0);
    const s = list.find((x) => x.id === newSlotId);
    if (!s) return;

    setDraft((p) => ({
      ...p,
      slotId: newSlotId,
      time: slotLabel(s),
      cost: `${s.price} JD`,
    }));
  };

  const save = () => {
    const next = {
      ...draft,
      players: cleanPlayers(draft.playersText),
    };
    delete next.playersText;

    setReservations((prev) => prev.map((x) => (x.bookingId === bookingId ? next : x)));
    setIsEditing(false);
  };

  const cancelReservation = () => {
    setReservations((prev) =>
      prev.map((x) => (x.bookingId === bookingId ? { ...x, status: "Cancelled" } : x))
    );
    setCancelOpen(false);
  };

  const deleteReservation = () => {
    setReservations((prev) => prev.filter((x) => x.bookingId !== bookingId));
    setDeleteOpen(false);
    navigate("/admin/reservations");
  };

  const shownCourt = courts.find((c) => c.id === (isEditing ? draft?.courtId : found.courtId)) || null;
  const shownSlots = makeSlots(shownCourt ? shownCourt.priceFrom : 0);

  const sideCourt = shownCourt;
  const sideDate = isEditing ? draft?.date : found.date;
  const sideTime = isEditing ? draft?.time : found.time;

  return (
    <div className="ard-page">
      <div className="ard-shell">
        {/* HEADER */}
        <div className="ard-head">
          <div className="ard-headLeft">
            <div className="ard-hTitle">Admin • Reservation Details</div>
            <div className="ard-hSub">
              Booking ID: <b>{found.bookingId}</b>
              <span className={`ard-badge ${isCancelled ? "off" : "on"}`}>
                {isCancelled ? "Cancelled" : "Reserved"}
              </span>
            </div>
          </div>

          <div className="ard-headActions">
            <button className="ard-btn ard-btnGhost" onClick={() => navigate("/admin/reservations")}>
              ← Back
            </button>

            {!isEditing ? (
              <button className="ard-btn ard-btnPrimary" onClick={() => setIsEditing(true)}>
                Edit Reservation
              </button>
            ) : (
              <>
                <button className="ard-btn ard-btnGhost" onClick={() => setIsEditing(false)}>
                  Cancel Edit
                </button>
                <button className="ard-btn ard-btnPrimary" onClick={save}>
                  Save
                </button>
              </>
            )}
          </div>
        </div>

        {/* LAYOUT */}
        <div className="ard-grid">
          {/* MAIN */}
          <div className="ard-card ard-main">
            {/* Court preview (photo + read-only details) */}
            <div className="ard-courtHero">
              <div
                className="ard-courtImg"
                style={{ backgroundImage: `url(${shownCourt?.image || tropicoCover})` }}
              >
                <div className="ard-courtImgDim" />
                <div className="ard-courtImgText">
                  <div className="ard-courtName">{shownCourt?.name || "Unknown Court"}</div>
                  <div className="ard-courtMeta2">
                    {shownCourt ? `${shownCourt.type} • From ${shownCourt.priceFrom} JD` : "No details"}
                  </div>
                </div>
              </div>

              <div className="ard-courtInfo">
                <div className="ard-infoRow">
                  <div className="ard-infoK">Surface</div>
                  <div className="ard-infoV">{shownCourt?.surface || "-"}</div>
                </div>
                <div className="ard-infoRow">
                  <div className="ard-infoK">Lighting</div>
                  <div className="ard-infoV">{shownCourt?.lighting || "-"}</div>
                </div>
                <div className="ard-infoRow">
                  <div className="ard-infoK">Max Players</div>
                  <div className="ard-infoV">{shownCourt?.maxPlayers || "-"}</div>
                </div>
              </div>
            </div>

            {/* Reservation body */}
            {!isEditing ? (
              <div className="ard-body">
                <div className="ard-section">
                  <div className="ard-secTitle">Reservation Summary</div>
                  <div className="ard-rows">
                    <div className="ard-row"><span>Date</span><b>{found.date}</b></div>
                    <div className="ard-row"><span>Time</span><b>{found.time}</b></div>
                    <div className="ard-row"><span>Total</span><b className="ard-total">{found.cost}</b></div>
                  </div>
                </div>

                <div className="ard-section">
                  <div className="ard-secTitle">Customer</div>
                  <div className="ard-rows">
                    <div className="ard-row"><span>Name</span><b>{found.name}</b></div>
                    <div className="ard-row"><span>Phone</span><b>{found.phone}</b></div>
                  </div>
                </div>

                <div className="ard-section">
                  <div className="ard-secTitle">Players</div>
                  <div className="ard-chips">
                    {(found.players || []).map((p, i) => (
                      <span key={i} className="ard-chip">{p}</span>
                    ))}
                    {(found.players || []).length === 0 && <span className="ard-muted">No players.</span>}
                  </div>
                </div>

                <div className="ard-section">
                  <div className="ard-secTitle">Notes</div>
                  <div className="ard-noteBox">
                    {found.notes ? found.notes : <span className="ard-muted">No notes.</span>}
                  </div>
                </div>
              </div>
            ) : (
              <div className="ard-body">
                <div className="ard-editHint">
                  Edit reservation only (court choice + slot + date + customer + players).
                </div>

                <div className="ard-form">
                  {/* Court */}
                  <div className="ard-field ard-span2">
                    <div className="ard-label">Court</div>
                    <select
                      className="ard-input"
                      value={draft.courtId}
                      onChange={(e) => changeCourt(e.target.value)}
                    >
                      {courts.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} • {c.type}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Date */}
                  <div className="ard-field">
                    <div className="ard-label">Date</div>
                    <input
                      className="ard-input"
                      type="date"
                      value={draft.date}
                      onChange={(e) => update("date", e.target.value)}
                    />
                  </div>

                  {/* Slot cards only (NO dropdown) */}
                  <div className="ard-field ard-span2">
                    <div className="ard-labelRow">
                      <div className="ard-label">Pick a Time Slot</div>

                      <div className="ard-selectedBox">
                        <span className="ard-selectedK">Selected:</span>
                        <b className="ard-selectedV">{draft.time || "-"}</b>
                        <span className="ard-dot">•</span>
                        <b className="ard-selectedPrice">{draft.cost || "-"}</b>
                      </div>
                    </div>

                    <div className="ard-slotCards">
                      {shownSlots.map((s) => {
                        const active = draft.slotId === s.id;
                        return (
                          <button
                            key={s.id}
                            type="button"
                            className={`ard-slotCard ${active ? "isActive" : ""}`}
                            onClick={() => changeSlot(s.id)}
                          >
                            <div className="ard-slotTop">
                              <div className="ard-slotTime">{slotLabel(s)}</div>
                              <div className="ard-slotPrice">{s.price} JD</div>
                            </div>
                            <div className="ard-slotSub">{active ? "Selected" : "Click to select"}</div>
                          </button>
                        );
                      })}
                    </div>

                    <div className="ard-smallHint">
                      Changing the slot updates the reservation time and total automatically.
                    </div>
                  </div>

                  {/* Auto fields */}
                  <div className="ard-field">
                    <div className="ard-label">Time (auto)</div>
                    <input className="ard-input" value={draft.time} readOnly />
                  </div>

                  <div className="ard-field">
                    <div className="ard-label">Total (auto)</div>
                    <input className="ard-input" value={draft.cost} readOnly />
                  </div>

                  {/* Customer */}
                  <div className="ard-field">
                    <div className="ard-label">Customer Name</div>
                    <input className="ard-input" value={draft.name} onChange={(e) => update("name", e.target.value)} />
                  </div>

                  <div className="ard-field">
                    <div className="ard-label">Phone</div>
                    <input className="ard-input" value={draft.phone} onChange={(e) => update("phone", e.target.value)} />
                  </div>

                  <div className="ard-field ard-span2">
                    <div className="ard-label">Players (comma separated)</div>
                    <input
                      className="ard-input"
                      value={draft.playersText}
                      onChange={(e) => update("playersText", e.target.value)}
                    />
                  </div>

                  <div className="ard-field ard-span2">
                    <div className="ard-label">Notes</div>
                    <textarea
                      className="ard-textarea"
                      rows={4}
                      value={draft.notes}
                      onChange={(e) => update("notes", e.target.value)}
                    />
                  </div>

                 
                </div>
              </div>
            )}
          </div>

          {/* SIDE ACTIONS */}
          <div className="ard-card ard-side">
            <div className="ard-sideTitle">Actions</div>

            <div className="ard-sideBox">
              <div className="ard-sideRow"><span>Status</span><b className={isCancelled ? "bad" : "ok"}>{status}</b></div>
              <div className="ard-sideRow"><span>Court</span><b>{sideCourt ? sideCourt.name : (isEditing ? draft?.courtId : found.courtId)}</b></div>
              <div className="ard-sideRow"><span>Date</span><b>{sideDate || "-"}</b></div>
              <div className="ard-sideRow"><span>Time</span><b>{sideTime || "-"}</b></div>
            </div>

            <div className="ard-sideBtns">
              {!isCancelled ? (
                <button className="ard-btn ard-btnWarn" type="button" onClick={() => setCancelOpen(true)}>
                  Cancel Reservation
                </button>
              ) : (
                <button className="ard-btn ard-btnDanger" type="button" onClick={() => setDeleteOpen(true)}>
                  Delete Reservation
                </button>
              )}
            </div>

            <div className="ard-sideHint">
              Reserved → can be cancelled. Cancelled → can be deleted.
            </div>
          </div>
        </div>
      </div>

      {/* CANCEL MODAL */}
      {cancelOpen && (
        <div className="ard-modal" onMouseDown={() => setCancelOpen(false)}>
          <div className="ard-modalBox" onMouseDown={(e) => e.stopPropagation()}>
            <div className="ard-modalTitle">Cancel this reservation?</div>
            <div className="ard-modalSub">
              Booking <b>{found.bookingId}</b> will become <b>Cancelled</b>.
            </div>
            <div className="ard-modalActions">
              <button className="ard-btn ard-btnGhost" onClick={() => setCancelOpen(false)}>Back</button>
              <button className="ard-btn ard-btnWarn" onClick={cancelReservation}>Confirm Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deleteOpen && (
        <div className="ard-modal" onMouseDown={() => setDeleteOpen(false)}>
          <div className="ard-modalBox" onMouseDown={(e) => e.stopPropagation()}>
            <div className="ard-modalTitle">Delete this reservation?</div>
            <div className="ard-modalSub">
              Booking <b>{found.bookingId}</b> will be deleted permanently.
            </div>
            <div className="ard-modalActions">
              <button className="ard-btn ard-btnGhost" onClick={() => setDeleteOpen(false)}>Back</button>
              <button className="ard-btn ard-btnDanger" onClick={deleteReservation}>Confirm Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}