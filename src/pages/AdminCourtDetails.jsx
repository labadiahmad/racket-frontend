import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./adminCourtDetails.css";

import tropicoCover from "../assets/courts/redCourt.jpeg";
import projectCover from "../assets/courts/SCR-20251203-uebn.jpeg";
import wepadelCover from "../assets/courts/wepadel-court-cover.jpg";

function makeDefaultSlots() {
  return [
    { id: "s1", from: "08:00", to: "09:00", price: 30, isReserved: false },
    { id: "s2", from: "09:00", to: "10:00", price: 35, isReserved: true },
    { id: "s3", from: "21:00", to: "22:00", price: 40, isReserved: false },
    { id: "s4", from: "22:00", to: "23:00", price: 40, isReserved: true },
    { id: "s5", from: "23:00", to: "00:00", price: 35, isReserved: false },
  ];
}

function cleanLines(txt) {
  return (txt || "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}
function joinLines(arr) {
  return (arr || []).join("\n");
}

export default function AdminCourtDetails() {
  const navigate = useNavigate();
  const { courtId } = useParams();

  const CLUB = {
    id: "1",
    name: "Tropico Padel Club",
    courts: [
      {
        id: "court1",
        name: "Court 1",
        type: "Outdoor Premium Court",
        about:
          "Outdoor premium court with pro turf and glass walls. Best for evening games with strong lighting and comfortable seating area near the court.",
        surface: "Pro Turf",
        lighting: "LED Night Lighting",
        maxPlayers: 4,
        features: ["Glass walls", "Pro turf", "Outdoor", "Seating area"],
        gallery: [tropicoCover, projectCover, wepadelCover],
        rules: [
          "Arrive 10 minutes early to check in and warm up.",
          "Only court shoes allowed (no running shoes on turf).",
          "Max 4 players per booking (extra players are not allowed).",
          "Your slot ends on time — please leave the court on the hour.",
          "No food or drinks on court (water is allowed).",
          "Respect other players — keep noise reasonable.",
          "Any damage to glass or fence must be reported immediately.",
          "Cancellations must be at least 24 hours before the slot.",
        ],
      },
      {
        id: "court2",
        name: "Court 2",
        type: "Indoor Court",
        about: "Indoor court with AC and premium turf. Great for all-day play in any weather.",
        surface: "Premium Turf",
        lighting: "Indoor Lighting",
        maxPlayers: 4,
        features: ["Indoor", "AC", "Premium turf", "Quiet zone"],
        gallery: [wepadelCover, projectCover, tropicoCover],
        rules: [
          "Indoor is a quiet zone — keep loud calls low.",
          "No wet shoes allowed (keeps turf clean).",
          "Max 4 players per booking.",
          "Do not change AC settings yourself — ask reception.",
          "Finish on time and collect all items before leaving.",
          "Report net/lighting issues immediately.",
          "Cancellations must be at least 24 hours before the slot.",
        ],
      },
      {
        id: "court3",
        name: "Court 3",
        type: "Outdoor Court",
        about: "Outdoor court with fresh air and nice lighting for night games.",
        
        surface: "Pro Turf",
        lighting: "LED Night Lighting",
        maxPlayers: 4,
        features: ["Outdoor", "Pro turf", "Seating area"],
        gallery: [wepadelCover, projectCover, tropicoCover],
        rules: ["Arrive on time.", "Max 4 players per booking."],
      },
      {
        id: "court4",
        name: "Court 4",
        type: "Indoor Training Court",
        about: "Training friendly indoor court with premium turf.",
        
        surface: "Premium Turf",
        lighting: "Indoor Lighting",
        maxPlayers: 4,
        features: ["Indoor", "Training friendly", "Premium turf"],
        gallery: [projectCover, tropicoCover, wepadelCover],
        rules: ["Max 4 players per booking.", "Finish on time and leave the court clean."],
      },
    ],
  };

  const foundCourt = CLUB.courts.find((c) => c.id === String(courtId));
  if (!foundCourt) return <div style={{ padding: 120 }}>Court not found</div>;

  const [isActive, setIsActive] = useState(true);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState({ ...foundCourt });

const [timeSlots, setTimeSlots] = useState(() => makeDefaultSlots());
  const [newSlot, setNewSlot] = useState({
    from: "08:00",
    to: "09:00",
      price: 30,
    isReserved: false,
  });
  const [deleteOpen, setDeleteOpen] = useState(false);

  const confirmDelete = () => {
    console.log("DELETE court:", draft.id); 
    setDeleteOpen(false);
    navigate("/admin/courts");
  };
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  useEffect(() => {
    setDraft({ ...foundCourt });
    setIsEditing(false);

setTimeSlots(makeDefaultSlots());
    setNewSlot({
      from: "08:00",
        price: 30,
      to: "09:00",
      isReserved: false,
    });
  }, [courtId]);

  const update = (key, value) => setDraft((p) => ({ ...p, [key]: value }));

  const updateSlot = (id, key, value) => {
    setTimeSlots((prev) => prev.map((s) => (s.id === id ? { ...s, [key]: value } : s)));
  };
  const deleteSlot = (id) => setTimeSlots((prev) => prev.filter((s) => s.id !== id));
  const addSlot = () => {
    const from = (newSlot.from || "").trim();
    const to = (newSlot.to || "").trim();
    const price = Number(newSlot.price);

    const id = `s_${Date.now()}`;
    if (!from || !to || !Number.isFinite(price)) return;
    setTimeSlots((prev) => [...prev, { id, from, to, price, isReserved: Boolean(newSlot.isReserved) }]);

    setNewSlot((p) => ({ ...p, isReserved: false }));
  };

  const openGalleryAt = (i) => {
    setActiveImg(i || 0);
    setGalleryOpen(true);
  };

  const addPhotos = (files) => {
    const arr = Array.from(files || []);
    if (!arr.length) return;
    const urls = arr.map((f) => URL.createObjectURL(f));
    update("gallery", [...(draft.gallery || []), ...urls]);
  };

  const deletePhoto = (index) => {
    const next = (draft.gallery || []).filter((_, i) => i !== index);
    update("gallery", next);

    setActiveImg((curr) => {
      const maxIndex = Math.max(0, next.length - 1);
      if (curr > maxIndex) return maxIndex;
      if (index < curr) return curr - 1;
      if (index === curr) return 0;
      return curr;
    });
  };

  const movePhoto = (from, to) => {
    const g = [...(draft.gallery || [])];
    if (to < 0 || to >= g.length) return;
    const temp = g[from];
    g[from] = g[to];
    g[to] = temp;
    update("gallery", g);
  };

  const save = () => {
    console.log("SAVE court", { ...draft, isActive, timeSlots });
    setIsEditing(false);
  };

  const badgeText = isActive ? "Active" : "Hidden";

  return (
    <div className="acd-page">
      <div className="acd-shell">
        {/* HERO */}
        <div className="acd-hero">
          <div className="acd-heroLeft">
            <div className="acd-heroTitle">Admin • Court Details</div>
            <div className="acd-heroSub">
              {CLUB.name} • <b>{draft.name}</b> •{" "}
              <span className={`acd-pill ${isActive ? "on" : "off"}`}>{badgeText}</span>
            </div>
          </div>

          <div className="acd-heroActions">
            <button className="acd-btn acd-btnOutline" type="button" onClick={() => navigate("/admin/courts")}>
              ← Back
            </button>

           
 {/* NEW delete button */}
  <button className="acd-btn acd-btnDelete" type="button" onClick={() => setDeleteOpen(true)}>
    🗑️ Delete
  </button>
            {!isEditing ? (
              <button className="acd-btn acd-btnPrimary" type="button" onClick={() => setIsEditing(true)}>
                Edit
              </button>
            ) : (
              <>
                <button className="acd-btn acd-btnOutline" type="button" onClick={() => setIsEditing(false)}>
                  Cancel
                </button>
                <button className="acd-btn acd-btnPrimary" type="button" onClick={save}>
                  Save
                </button>
              </>
            )}
          </div>
        </div>

        {/* LAYOUT */}
        <div className={`acd-layout ${isEditing ? "isEditing" : ""}`}>
          {/* MAIN CARD */}
          <div className="acd-card acd-main">
            {/* cover */}
            <div className="acd-cover" style={{ backgroundImage: `url(${(draft.gallery || [])[0] || tropicoCover})` }}>
              <div className="acd-coverDim" />
              <div className="acd-coverInfo">
                <div className="acd-name">{draft.name}</div>
                <div className="acd-subline">{draft.type}</div>
              </div>
            </div>

            {/* VIEW MODE */}
            {!isEditing ? (
              <div className="acd-body">
                {/* about */}
                <div className="acd-section">
                  <div className="acd-secTitle">About</div>
                  <p className="acd-text">{draft.about}</p>
                </div>

                {/* specs */}
                <div className="acd-section">
                  <div className="acd-secTitle">Specs</div>
                  <div className="acd-specGrid">
                    <div className="acd-spec">
                      <div className="acd-k">Surface</div>
                      <div className="acd-v">{draft.surface}</div>
                    </div>
                    <div className="acd-spec">
                      <div className="acd-k">Lighting</div>
                      <div className="acd-v">{draft.lighting}</div>
                    </div>
                    <div className="acd-spec">
                      <div className="acd-k">Max Players</div>
                      <div className="acd-v">{draft.maxPlayers}</div>
                    </div>
                  </div>
                </div>

                {/* features */}
                <div className="acd-section">
                  <div className="acd-secTitle">Features</div>
                  <div className="acd-chips">
                    {(draft.features || []).map((f, i) => (
                      <span key={i} className="acd-chip">
                        ✅ {f}
                      </span>
                    ))}
                  </div>
                </div>

                {/* gallery view */}
                <div className="acd-section">
                  <div className="acd-secHeadRow">
                    <div>
                      <div className="acd-secTitle">
                        Court Photos <span className="acd-count">({(draft.gallery || []).length})</span>
                      </div>
                      <div className="acd-mutedSmall">Click any photo to view full screen.</div>
                    </div>

                    <button className="acd-linkBtn" type="button" onClick={() => openGalleryAt(0)}>
                      View all
                    </button>
                  </div>

                  <div className="acd-galleryScroll">
                    {(draft.gallery || []).map((img, i) => (
                      <button
                        key={i}
                        type="button"
                        className="acd-thumb"
                        style={{ backgroundImage: `url(${img})` }}
                        onClick={() => openGalleryAt(i)}
                        aria-label={`Open photo ${i + 1}`}
                      />
                    ))}
                  </div>
                </div>

              {/* slots view */}
<div className="acd-section">
  <div className="acd-secTitle">Time Slots</div>
  <div className="acd-mutedSmall">Slots for this court (view only).</div>

  <div className="acd-slotsGrid">
    {timeSlots.map((s) => (
      <div key={s.id} className={`acd-slotCard ${s.isReserved ? "isReserved" : ""}`}>
        <div className="acd-slotTop">
          <div className="acd-slotTime">
            {s.from} <span className="acd-dash">–</span> {s.to}
          </div>
          <span className={`acd-slotBadge ${s.isReserved ? "reserved" : "available"}`}>
            {s.isReserved ? "Reserved" : "Available"}
          </span>
        </div>

        <div className="acd-slotPrice">{s.price} JD</div>
      </div>
    ))}
  </div>
</div>

                {/* rules */}
                <div className="acd-section">
                  <div className="acd-secTitle">Court Rules</div>
                  <ul className="acd-list">
                    {(draft.rules || []).map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              /* EDIT MODE */
              <div className="acd-body">
                <div className="acd-editBanner">
                  Edit mode: update court info + photos + time slots, then press <b>Save</b>.
                </div>

                {/* form */}
                <div className="acd-formGrid">
                  <div>
                    <div className="acd-label">Court Name</div>
                    <input className="acd-input" value={draft.name} onChange={(e) => update("name", e.target.value)} />
                  </div>

                  <div>
                    <div className="acd-label">Type</div>
                    <input className="acd-input" value={draft.type} onChange={(e) => update("type", e.target.value)} />
                  </div>


                  <div>
                    <div className="acd-label">Max Players</div>
                    <input
                      className="acd-input"
                      type="number"
                      value={draft.maxPlayers}
                      onChange={(e) => update("maxPlayers", Number(e.target.value))}
                    />
                  </div>

                  <div>
                    <div className="acd-label">Surface</div>
                    <input
                      className="acd-input"
                      value={draft.surface}
                      onChange={(e) => update("surface", e.target.value)}
                    />
                  </div>

                  <div>
                    <div className="acd-label">Lighting</div>
                    <input
                      className="acd-input"
                      value={draft.lighting}
                      onChange={(e) => update("lighting", e.target.value)}
                    />
                  </div>

                  <div className="acd-span2">
                    <div className="acd-label">About</div>
                    <textarea
                      className="acd-textarea"
                      rows={4}
                      value={draft.about}
                      onChange={(e) => update("about", e.target.value)}
                    />
                  </div>

                  <div className="acd-span2">
                    <div className="acd-label">Features (one per line)</div>
                    <textarea
                      className="acd-textarea"
                      rows={5}
                      value={joinLines(draft.features)}
                      onChange={(e) => update("features", cleanLines(e.target.value))}
                    />
                  </div>

                  <div className="acd-span2">
                    <div className="acd-label">Rules (one per line)</div>
                    <textarea
                      className="acd-textarea"
                      rows={6}
                      value={joinLines(draft.rules)}
                      onChange={(e) => update("rules", cleanLines(e.target.value))}
                    />
                  </div>
                </div>

                {/* gallery manager */}
                <div className="acd-section">
                  <div className="acd-secHeadRow">
                    <div>
                      <div className="acd-secTitle">
                        Gallery Manager <span className="acd-count">({(draft.gallery || []).length})</span>
                      </div>
                      <div className="acd-mutedSmall">Add / delete / reorder photos.</div>
                    </div>

                    <label className="acd-uploadBtn">
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

                  <div className="acd-photoList">
                    {(draft.gallery || []).map((img, i) => (
                      <div key={i} className="acd-photoRow">
                        <div className="acd-photoThumb" style={{ backgroundImage: `url(${img})` }} />
                        <div className="acd-photoInfo">
                          <div className="acd-photoTitle">Photo {i + 1}</div>
                          <div className="acd-photoSub">Press Save to apply changes</div>
                        </div>

                        <div className="acd-photoActions">
                          <button
                            className="acd-miniBtn"
                            type="button"
                            onClick={() => movePhoto(i, i - 1)}
                            disabled={i === 0}
                          >
                            ↑
                          </button>
                          <button
                            className="acd-miniBtn"
                            type="button"
                            onClick={() => movePhoto(i, i + 1)}
                            disabled={i === (draft.gallery || []).length - 1}
                          >
                            ↓
                          </button>
                          <button className="acd-dangerBtn" type="button" onClick={() => deletePhoto(i)}>
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {(draft.gallery || []).length === 0 && <div className="acd-emptyBox">No photos yet. Upload some images.</div>}
                </div>

                {/* slots manager */}
                <div className="acd-section">
                  <div className="acd-secHeadRow">
                    <div>
                      <div className="acd-secTitle">Time Slots Manager</div>
                      <div className="acd-mutedSmall">Add / edit / remove slots for this court.</div>
                    </div>
                  </div>

                  <div className="acd-slotsTable">
                    {timeSlots.map((s) => (
                      <div key={s.id} className="acd-slotRow">
                        <div>
                          <div className="acd-label">From</div>
                          <input
                            className="acd-input"
                            type="time"
                            value={s.from}
                            onChange={(e) => updateSlot(s.id, "from", e.target.value)}
                          />
                        </div>

                        <div>
                          <div className="acd-label">To</div>
                          <input
                            className="acd-input"
                            type="time"
                            value={s.to}
                            onChange={(e) => updateSlot(s.id, "to", e.target.value)}
                          />
                        </div>

                        <div>
                          <div className="acd-label">Price (JD)</div>
                          <input
                            className="acd-input"
                            type="number"
                            value={s.price}
                            onChange={(e) => updateSlot(s.id, "price", Number(e.target.value))}
                          />
                        </div>

                        <label className="acd-check">
                          <input
                            type="checkbox"
                            checked={s.isReserved}
                            onChange={(e) => updateSlot(s.id, "isReserved", e.target.checked)}
                          />
                          <span>Reserved</span>
                        </label>

                        <button className="acd-rowDel" type="button" onClick={() => deleteSlot(s.id)}>
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="acd-addBox">
                    <div className="acd-addTitle">Add new slot</div>

                    <div className="acd-addRow">
                      <div>
                        <div className="acd-label">From</div>
                        <input
                          className="acd-input"
                          type="time"
                          value={newSlot.from}
                          onChange={(e) => setNewSlot((p) => ({ ...p, from: e.target.value }))}
                        />
                      </div>

                      <div>
                        <div className="acd-label">To</div>
                        <input
                          className="acd-input"
                          type="time"
                          value={newSlot.to}
                          onChange={(e) => setNewSlot((p) => ({ ...p, to: e.target.value }))}
                        />
                      </div>

                      <div>
                        <div className="acd-label">Price (JD)</div>
                        <input
                          className="acd-input"
                          type="number"
                          value={newSlot.price}
                          onChange={(e) => setNewSlot((p) => ({ ...p, price: e.target.value }))}
                        />
                      </div>

                      <label className="acd-check">
                        <input
                          type="checkbox"
                          checked={newSlot.isReserved}
                          onChange={(e) => setNewSlot((p) => ({ ...p, isReserved: e.target.checked }))}
                        />
                        <span>Reserved</span>
                      </label>

                      <button className="acd-btn acd-btnPrimary acd-addBtn" type="button" onClick={addSlot}>
                        + Add
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SIDE CARD (only in view mode) */}
          {!isEditing && (
            <div className="acd-card acd-side">
              <div className="acd-sideTitle">Quick Info</div>

              <div className="acd-miniStat">
                <span>Status</span>
                <b className={isActive ? "ok" : "bad"}>{badgeText}</b>
              </div>

             

              <div className="acd-miniStat">
                <span>Type</span>
                <b>{draft.type}</b>
              </div>

              <div className="acd-miniStat">
                <span>Photos</span>
                <b>{(draft.gallery || []).length}</b>
              </div>

              

           <button
  className={`acd-statusToggle ${isActive ? "active" : "hidden"}`}
  type="button"
  onClick={() => setIsActive((v) => !v)}
  aria-pressed={isActive}
>
  <span className="acd-statusIcon">
    {isActive ? "🟢" : "🔴"}
  </span>
  <span className="acd-statusText">
    {isActive ? "Active" : "Hidden"}
  </span>
</button>
            </div>
          )}
        </div>
{/* ✅ DELETE MODAL */}
{deleteOpen && (
  <div className="acd-delModal" onMouseDown={() => setDeleteOpen(false)}>
    <div className="acd-delBox" onMouseDown={(e) => e.stopPropagation()}>
      <div className="acd-delTitle">Delete this court?</div>
      <div className="acd-delText">
        This will remove <b>{draft.name}</b> from your courts list. This action cannot be undone.
      </div>

      <div className="acd-delActions">
        <button className="acd-btn acd-btnOutline" type="button" onClick={() => setDeleteOpen(false)}>
          Cancel
        </button>
        <button className="acd-btn acd-btnDeleteSolid" type="button" onClick={confirmDelete}>
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
)}
        {/* MODAL */}
        {galleryOpen && (
          <div className="acd-modal" onMouseDown={() => setGalleryOpen(false)}>
            <div className="acd-modalInner" onMouseDown={(e) => e.stopPropagation()}>
              <button className="acd-close" type="button" onClick={() => setGalleryOpen(false)}>
                ✕
              </button>

              <button
                className="acd-arrow left"
                type="button"
                onClick={() => setActiveImg((i) => (i - 1 + (draft.gallery || []).length) % (draft.gallery || []).length)}
              >
                ‹
              </button>

              <img className="acd-modalImg" src={(draft.gallery || [])[activeImg]} alt="" />

              <button
                className="acd-arrow right"
                type="button"
                onClick={() => setActiveImg((i) => (i + 1) % (draft.gallery || []).length)}
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}