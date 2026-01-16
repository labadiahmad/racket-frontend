import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./adminAddReservation.css";

import tropicoCover from "../assets/courts/redCourt.jpeg";
import projectCover from "../assets/courts/SCR-20251203-uebn.jpeg";
import wepadelCover from "../assets/courts/wepadel-court-cover.jpg";

function cleanPlayers(txt) {
  return (txt || "")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
}

function slotLabel(s) {
  return `${s.from} - ${s.to}`;
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

export default function AdminAddReservation() {
  const navigate = useNavigate();

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
    },
  ]);

  const firstCourt = courts[0];
  const firstSlots = makeSlots(firstCourt.priceFrom);
  const firstSlot = firstSlots[0];

  const [draft, setDraft] = useState({
    bookingId: `BK-${Math.floor(10000 + Math.random() * 90000)}`,
    courtId: firstCourt.id,
    date: new Date().toISOString().slice(0, 10),
    slotId: firstSlot.id,
    time: slotLabel(firstSlot),
    cost: `${firstSlot.price} JD`,
    name: "",
    phone: "",
    playersText: "",
    notes: "",
    status: "Reserved", 
  });

  const court = courts.find((c) => c.id === draft.courtId) || firstCourt;
  const slots = makeSlots(court.priceFrom);

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
    const s = slots.find((x) => x.id === newSlotId);
    if (!s) return;

    setDraft((p) => ({
      ...p,
      slotId: newSlotId,
      time: slotLabel(s),
      cost: `${s.price} JD`,
    }));
  };

  const isValid =
    String(draft.name || "").trim().length >= 2 &&
    String(draft.phone || "").trim().length >= 8 &&
    String(draft.date || "").trim() &&
    String(draft.slotId || "").trim();

  const save = () => {
    if (!isValid) return;

    const payload = {
      ...draft,
      players: cleanPlayers(draft.playersText),
    };
    delete payload.playersText;

    console.log("ADD RESERVATION:", payload);
    navigate("/admin/reservations");
  };

  return (
    <div className="aar-page">
      <div className="aar-shell">
        {/* HEADER */}
        <div className="aar-head">
          <div className="aar-headLeft">
            <div className="aar-breadcrumb">Admin / Reservations /</div>
            <div className="aar-title">Add Reservation</div>
            <div className="aar-sub">
              Create a reservation manually. Status is <b>Reserved</b> by default.
            </div>
          </div>

          <div className="aar-actions">
            <button
              className="aar-btn aar-ghost"
              type="button"
              onClick={() => navigate("/admin/reservations")}
            >
              ← Back
            </button>

            <button
              className={`aar-btn aar-primary ${!isValid ? "isDisabled" : ""}`}
              type="button"
              onClick={save}
              disabled={!isValid}
              title={!isValid ? "Fill customer name + phone first" : "Save reservation"}
            >
              Save
            </button>
          </div>
        </div>

        {/* LAYOUT */}
        <div className="aar-grid">
          {/* MAIN */}
          <div className="aar-card aar-main">
            {/* Court preview */}
            <div className="aar-courtHero">
              <div className="aar-courtImg" style={{ backgroundImage: `url(${court.image})` }}>
                <div className="aar-courtDim" />
                <div className="aar-courtText">
                  <div className="aar-courtName">{court.name}</div>
                  <div className="aar-courtMeta">
                    {court.type} • From <b>{court.priceFrom} JD</b>
                  </div>
                </div>
              </div>

              <div className="aar-courtQuick">
                <div className="aar-quickTitle">Court Specs</div>

                <div className="aar-infoRow">
                  <span>Surface</span>
                  <b>{court.surface}</b>
                </div>
                <div className="aar-infoRow">
                  <span>Lighting</span>
                  <b>{court.lighting}</b>
                </div>
                <div className="aar-infoRow">
                  <span>Max Players</span>
                  <b>{court.maxPlayers}</b>
                </div>
              </div>
            </div>

            {/* FORM */}
            <div className="aar-form">
              <div className="aar-sectionTitle">Reservation Info</div>

              <div className="aar-field aar-span2">
                <div className="aar-label">Court</div>
                <select className="aar-input" value={draft.courtId} onChange={(e) => changeCourt(e.target.value)}>
                  {courts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} • {c.type}
                    </option>
                  ))}
                </select>
              </div>

              <div className="aar-field">
                <div className="aar-label">Date</div>
                <input
                  className="aar-input"
                  type="date"
                  value={draft.date}
                  onChange={(e) => update("date", e.target.value)}
                />
              </div>

             

              {/* SLOT CARDS */}
              <div className="aar-field aar-span2">
                <div className="aar-labelRow">
                  <div>
                    <div className="aar-label">Pick a Time Slot</div>
                  </div>
                </div>

                <div className="aar-slotGrid">
                  {slots.map((s) => {
                    const active = draft.slotId === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        className={`aar-slotCard ${active ? "isActive" : ""}`}
                        onClick={() => changeSlot(s.id)}
                      >
                        <div className="aar-slotTop">
                          <div className="aar-slotTime">{slotLabel(s)}</div>
                          <div className="aar-slotPrice">{s.price} JD</div>
                        </div>

                        <div className="aar-slotBottom">
                          <div className={`aar-chip ${active ? "on" : ""}`}>
                            {active ? "✓ Selected" : "Select"}
                          </div>
                          <div className="aar-slotMini">Tap to choose</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

       

              <div className="aar-sectionTitle">Customer Info</div>

              <div className="aar-field">
                <div className="aar-label">Customer Name</div>
                <input
                  className={`aar-input ${String(draft.name || "").trim().length < 2 ? "isWarn" : ""}`}
                  value={draft.name}
                  onChange={(e) => update("name", e.target.value)}
                  placeholder="Full name"
                />
              </div>

              <div className="aar-field">
                <div className="aar-label">Phone</div>
                <input
                  className={`aar-input ${String(draft.phone || "").trim().length < 8 ? "isWarn" : ""}`}
                  value={draft.phone}
                  onChange={(e) => update("phone", e.target.value)}
                  placeholder="07xxxxxxxx"
                />
              </div>

              <div className="aar-field aar-span2">
                <div className="aar-label">Players (comma separated)</div>
                <input
                  className="aar-input"
                  value={draft.playersText}
                  onChange={(e) => update("playersText", e.target.value)}
                  placeholder="Nour, Ahmad, Majd, Omar"
                />
              </div>

              <div className="aar-field aar-span2">
                <div className="aar-label">Notes</div>
                <textarea
                  className="aar-textarea"
                  rows={4}
                  value={draft.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  placeholder="Optional notes..."
                />
              </div>
            </div>
          </div>

          {/* SIDE */}
          <div className="aar-card aar-side">
            <div className="aar-sideTitle">Summary</div>

            <div className="aar-summaryTop">
              <div className="aar-summaryBig">{draft.cost}</div>
              <div className="aar-summarySmall">Estimated total for selected slot</div>
            </div>

            <div className="aar-summaryBox">
              <div className="aar-sRow"><span>Booking ID</span><b>{draft.bookingId}</b></div>
              <div className="aar-sRow"><span>Court</span><b>{court.name}</b></div>
              <div className="aar-sRow"><span>Date</span><b>{draft.date}</b></div>
              <div className="aar-sRow"><span>Time</span><b>{draft.time}</b></div>
              <div className="aar-sRow"><span>Customer</span><b>{draft.name || "-"}</b></div>
              <div className="aar-sRow"><span>Phone</span><b>{draft.phone || "-"}</b></div>
            </div>

            <div className="aar-sideHint">
              Tip: Fill <b>Customer Name</b> and <b>Phone</b> to enable Save.
            </div>

            <button
              className={`aar-btn aar-primary aar-sideBtn ${!isValid ? "isDisabled" : ""}`}
              type="button"
              onClick={save}
              disabled={!isValid}
            >
              Save Reservation
            </button>

            {!isValid && (
              <div className="aar-warning">
                Please enter a valid <b>name</b> and <b>phone</b>.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}