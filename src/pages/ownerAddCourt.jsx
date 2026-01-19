import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ownerAddCourt.css";

import tropicoCover from "../assets/courts/redCourt.jpeg";

function cleanLines(txt) {
  return (txt || "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}
function joinLines(arr) {
  return (arr || []).join("\n");
}

export default function AddCourt() {
  const navigate = useNavigate();

  const CLUB_NAME = "Tropico Padel Club";

const [court, setCourt] = useState({
  name: "",
  type: "",
  about: "",
  surface: "",
  lighting: "",
  maxPlayers: 4,
  features: [],
  rules: [],
  gallery: [],
});

  const [timeSlots, setTimeSlots] = useState([
    { id: "s1", from: "08:00", to: "09:00", price: 30, isReserved: false },
    { id: "s2", from: "09:00", to: "10:00", price: 50, isReserved: false },
  ]);

  const [newSlot, setNewSlot] = useState({
    from: "10:00",
    to: "11:00",
    price: 30,
    isReserved: false,
  });



  const update = (key, value) => setCourt((p) => ({ ...p, [key]: value }));

  const addPhotos = (files) => {
    const arr = Array.from(files || []);
    if (!arr.length) return;
    const urls = arr.map((f) => URL.createObjectURL(f));
    update("gallery", [...(court.gallery || []), ...urls]);
  };

  const removePhoto = (index) => {
    update(
      "gallery",
      (court.gallery || []).filter((_, i) => i !== index)
    );
  };

  const updateSlot = (id, key, value) => {
    setTimeSlots((prev) => prev.map((s) => (s.id === id ? { ...s, [key]: value } : s)));
  };

  const deleteSlot = (id) => {
    setTimeSlots((prev) => prev.filter((s) => s.id !== id));
  };

  const addSlot = () => {
    const from = (newSlot.from || "").trim();
    const to = (newSlot.to || "").trim();
    const price = Number(newSlot.price);

    if (!from || !to || !Number.isFinite(price)) return;

    const id = `s_${Date.now()}`;
    setTimeSlots((prev) => [...prev, { id, from, to, price, isReserved: Boolean(newSlot.isReserved) }]);

    setNewSlot((p) => ({ ...p, isReserved: false }));
  };

  const validate = () => {
    if (!court.name.trim()) return "Court name is required.";
    if (!court.type.trim()) return "Court type is required.";
    if (!court.about.trim()) return "About is required.";
    if (!timeSlots.length) return "Add at least one time slot.";
    return null;
  };

  const handleCreate = () => {
    const err = validate();
    if (err) {
      alert(err);
      return;
    }

    const payload = {
      ...court,
      timeSlots,
    };

    console.log("CREATE COURT:", payload);
    navigate("/admin/courts");
  };

  const cover = (court.gallery || [])[0] || tropicoCover;

  return (
    <div className="acp-page">
      <div className="acp-shell">
        {/* HERO */}
        <div className="acp-hero">
          <div className="acp-heroLeft">
            <div className="acp-title">Admin • Add New Court</div>
            <div className="acp-sub">
              {CLUB_NAME} • Fill the details then press <b>Create</b>.
            </div>
          </div>

          <div className="acp-actions">
            <button className="acp-btn acp-btnGhost" type="button" onClick={() => navigate("/admin/courts")}>
              ← Back
            </button>

           
          </div>
        </div>

        {/* CONTENT */}
        <div className="acp-layout">
          {/* MAIN */}
          <div className="acp-card">
            {/* COVER PREVIEW */}
            <div className="acp-cover" style={{ backgroundImage: `url(${cover})` }}>
              <div className="acp-coverDim" />
              <div className="acp-coverInfo">
                <div className="acp-coverName">{court.name || "New Court"}</div>
                <div className="acp-coverLine">
  {court.type || "Court Type"}
</div>
              </div>
            </div>

            <div className="acp-body">
              {/* BASIC INFO */}
              <div className="acp-section">
                <div className="acp-secTitle">Court Info</div>

                <div className="acp-grid">
                  <div>
                    <div className="acp-label">Court Name</div>
                    <input
                      className="acp-input"
                      value={court.name}
                      onChange={(e) => update("name", e.target.value)}
                      placeholder="e.g. Court 1"
                    />
                  </div>

                  <div>
                    <div className="acp-label">Type</div>
                    <input
                      className="acp-input"
                      value={court.type}
                      onChange={(e) => update("type", e.target.value)}
                      placeholder="e.g. Outdoor Premium Court"
                    />
                  </div>

                  

                  <div>
                    <div className="acp-label">Max Players</div>
                    <input
                      className="acp-input"
                      type="number"
                      value={court.maxPlayers}
                      onChange={(e) => update("maxPlayers", Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <div className="acp-label">Surface</div>
                    <input
                      className="acp-input"
                      value={court.surface}
                      onChange={(e) => update("surface", e.target.value)}
                      placeholder="e.g. Pro Turf"
                    />
                  </div>

                  <div>
                    <div className="acp-label">Lighting</div>
                    <input
                      className="acp-input"
                      value={court.lighting}
                      onChange={(e) => update("lighting", e.target.value)}
                      placeholder="e.g. LED Night Lighting"
                    />
                  </div>

                  <div className="acp-span2">
                    <div className="acp-label">About</div>
                    <textarea
                      className="acp-textarea"
                      rows={4}
                      value={court.about}
                      onChange={(e) => update("about", e.target.value)}
                      placeholder="Write a short description about the court..."
                    />
                  </div>
                </div>
              </div>

              {/* FEATURES + RULES */}
              <div className="acp-section">
                <div className="acp-secTitle">Features & Rules</div>

                <div className="acp-grid">
                  <div className="acp-span2">
                    <div className="acp-label">Features (one per line)</div>
                    <textarea
                      className="acp-textarea"
                      rows={5}
                      value={joinLines(court.features)}
                      onChange={(e) => update("features", cleanLines(e.target.value))}
                      placeholder={"Glass walls\nPro turf\nOutdoor"}
                    />
                  </div>

                  <div className="acp-span2">
                    <div className="acp-label">Rules (one per line)</div>
                    <textarea
                      className="acp-textarea"
                      rows={6}
                      value={joinLines(court.rules)}
                      onChange={(e) => update("rules", cleanLines(e.target.value))}
                      placeholder={"Arrive 10 minutes early\nMax 4 players\nNo food on court"}
                    />
                  </div>
                </div>
              </div>

              {/* PHOTOS */}
              <div className="acp-section">
                <div className="acp-secHead">
                  <div>
                    <div className="acp-secTitle">Court Photos</div>
                    <div className="acp-muted">Upload photos to show the court.</div>
                  </div>

                  <label className="acp-upload">
                    + Upload
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => {
                        addPhotos(e.target.files);
                        e.target.value = "";
                      }}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>

                {(court.gallery || []).length === 0 ? (
                  <div className="acp-empty">No photos yet. Upload at least 1 photo (optional).</div>
                ) : (
                  <div className="acp-photoGrid">
                    {(court.gallery || []).map((img, i) => (
                      <div key={i} className="acp-photo">
                        <div className="acp-photoThumb" style={{ backgroundImage: `url(${img})` }} />
                        <button className="acp-photoDel" type="button" onClick={() => removePhoto(i)}>
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* TIME SLOTS */}
              <div className="acp-section">
                <div className="acp-secTitle">Time Slots</div>
                <div className="acp-muted">Add / edit / delete slots. (New courts usually start as Available.)</div>

                <div className="acp-slotsTable">
                  {timeSlots.map((s) => (
                    <div key={s.id} className="acp-slotRow">
                      <div>
                        <div className="acp-label">From</div>
                        <input
                          className="acp-input"
                          type="time"
                          value={s.from}
                          onChange={(e) => updateSlot(s.id, "from", e.target.value)}
                        />
                      </div>

                      <div>
                        <div className="acp-label">To</div>
                        <input
                          className="acp-input"
                          type="time"
                          value={s.to}
                          onChange={(e) => updateSlot(s.id, "to", e.target.value)}
                        />
                      </div>

                      <div>
                        <div className="acp-label">Price (JD)</div>
                        <input
                          className="acp-input"
                          type="number"
                          value={s.price}
                          onChange={(e) => updateSlot(s.id, "price", Number(e.target.value))}
                        />
                      </div>

                      <label className="acp-check">
                        <input
                          type="checkbox"
                          checked={s.isReserved}
                          onChange={(e) => updateSlot(s.id, "isReserved", e.target.checked)}
                        />
                        <span>Reserved</span>
                      </label>

                      <button className="acp-rowDel" type="button" onClick={() => deleteSlot(s.id)}>
                        Delete
                      </button>
                    </div>
                  ))}
                </div>

                <div className="acp-addBox">
                  <div className="acp-addTitle">Add new slot</div>

                  <div className="acp-addRow">
                    <div>
                      <div className="acp-label">From</div>
                      <input
                        className="acp-input"
                        type="time"
                        value={newSlot.from}
                        onChange={(e) => setNewSlot((p) => ({ ...p, from: e.target.value }))}
                      />
                    </div>

                    <div>
                      <div className="acp-label">To</div>
                      <input
                        className="acp-input"
                        type="time"
                        value={newSlot.to}
                        onChange={(e) => setNewSlot((p) => ({ ...p, to: e.target.value }))}
                      />
                    </div>

                    <div>
                      <div className="acp-label">Price (JD)</div>
                      <input
                        className="acp-input"
                        type="number"
                        value={newSlot.price}
                        onChange={(e) => setNewSlot((p) => ({ ...p, price: e.target.value }))}
                      />
                    </div>

                    <label className="acp-check">
                      <input
                        type="checkbox"
                        checked={newSlot.isReserved}
                        onChange={(e) => setNewSlot((p) => ({ ...p, isReserved: e.target.checked }))}
                      />
                      <span>Reserved</span>
                    </label>

                    <button className="acp-btn acp-btnPrimary acp-addBtn" type="button" onClick={addSlot}>
                      + Add
                    </button>
                  </div>
                </div>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="acp-footerActions">
                <button className="acp-btn acp-btnGhost" type="button" onClick={() => navigate("/admin/courts")}>
                  Cancel
                </button>
                <button className="acp-btn acp-btnPrimary" type="button" onClick={handleCreate}>
                   Add Court
                </button>
              </div>
            </div>
          </div>

          {/* SIDE CARD */}
          <div className="acp-side">
            <div className="acp-sideCard">
              <div className="acp-sideTitle">Quick Preview</div>

              <div className="acp-stat">
                <span>Name</span>
                <b>{court.name || "—"}</b>
              </div>

              <div className="acp-stat">
                <span>Type</span>
                <b>{court.type || "—"}</b>
              </div>

              

              <div className="acp-stat">
                <span>Photos</span>
                <b>{(court.gallery || []).length}</b>
              </div>

              <div className="acp-stat">
                <span>Slots</span>
                <b>{timeSlots.length}</b>
              </div>

              <div className="acp-hint">
                Tip: Add at least <b>1 time slot</b> so users can book.
              </div>

              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}