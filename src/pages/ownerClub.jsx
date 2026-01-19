import { useMemo, useState } from "react";
import "./ownerClub.css";

import tropicoCover from "../assets/courts/redCourt.jpeg";
import tropicoCover2 from "../assets/courts/3.jpeg";
import projectCover from "../assets/courts/SCR-20251203-uebn.jpeg";
import wepadelCover from "../assets/courts/wepadel-court-cover.jpg";
import tropicoLogo from "../assets/clubs/tropico.png";

export default function AdminClub() {
  const initialClub = useMemo(
    () => ({
      id: "1",
      name: "Tropico Padel Club",
      logo: tropicoLogo,
      rating: 4.9,
      reviews: 120,
      about:
        "Tropico Padel Club offers modern courts, easy booking, and a fun playing experience for all levels.",
      address: "Tropico Padel Club Al-Madina Street, District 5, Amman, Jordan",
      mapsUrl: "https://www.google.com/maps",
      whatsapp: "+962 792133190",
      phone: "+962 792133190",
      gallery: [tropicoCover, projectCover, wepadelCover, tropicoCover2],
      facilities: ["Parking", "Café", "Lockers", "Bathrooms", "Seating area", "Shop"],
      clubRules: [
        "Free cancellation up to 24 hours before the slot.",
        "Late arrivals do not extend the booking time.",
        "No-shows may be charged the full amount.",
        "Refunds (if any) are processed within 3–5 working days.",
      ],
      courts: [
        { id: "court1", name: "Court 1", type: "Outdoor Premium Court", priceFrom: 30 },
        { id: "court2", name: "Court 2", type: "Indoor Court", priceFrom: 35 },
      ],
    }),
    []
  );

  const [club, setClub] = useState(initialClub);

  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(initialClub);

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const viewClub = isEditing ? draft : club;

  const update = (key, value) => setDraft((p) => ({ ...p, [key]: value }));

  const joinLines = (arr) => (arr || []).join("\n");
  const splitLines = (text) =>
    (text || "")
      .split("\n")
      .map((x) => x.trim())
      .filter(Boolean);

  const startEdit = () => {
    setDraft(club);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraft(club);
    setIsEditing(false);
  };

  const saveEdit = () => {
    setClub(draft);
    setIsEditing(false);
    console.log("save", draft);
  };

  const deletePhoto = (index) => {
    setDraft((p) => {
      const nextGallery = (p.gallery || []).filter((_, i) => i !== index);

      setActiveImg((curr) => {
        const maxIndex = Math.max(0, nextGallery.length - 1);
        if (curr > maxIndex) return maxIndex;
        if (index < curr) return curr - 1;
        if (index === curr) return 0;
        return curr;
      });

      return { ...p, gallery: nextGallery };
    });
  };

  const openGalleryAt = (i) => {
    setActiveImg(i);
    setGalleryOpen(true);
  };

  return (
    <div className="ac-page">
      <div className="ac-shell">
        {/* HERO */}
        <div className="ac-hero">
          <div>
            <div className="ac-heroTitle">Admin • Club</div>
            <div className="ac-heroSub">
              {isEditing
                ? "Edit mode: update the info then press Save."
                : "View mode: this is the same club data that users see."}
            </div>
          </div>

          <div className="ac-heroRight">
            {!isEditing ? (
              <>
                
                <button className="ac-btn ac-btnPrimary" type="button" onClick={startEdit}>
                  Edit
                </button>
              </>
            ) : (
              <>
                <button className="ac-btn ac-btnOutline" type="button" onClick={cancelEdit}>
                  Cancel
                </button>
                <button className="ac-btn ac-btnPrimary" type="button" onClick={saveEdit}>
                  Save
                </button>
              </>
            )}
          </div>
        </div>

        {/* GRID */}
        <div className={`ac-grid ${isEditing ? "is-editing" : ""}`}>
          {/* CLUB CARD (always visible) */}
          <div className="ac-card ac-clubCard">
            <div className="ac-cardHead">
              <div className="ac-cardTitle">Club Details</div>

              
              
            </div>

            {/* Top Preview Row */}
            <div className="ac-clubTop">
              <div className="ac-clubLogoWrap">
                <img className="ac-clubLogo" src={viewClub.logo} alt="club logo" />
              </div>

              <div>
                <div className="ac-clubName">{viewClub.name}</div>

                {!isEditing && (
                  <>
                    <div className="ac-clubMeta">
                      ⭐ {viewClub.rating} • {viewClub.reviews} reviews • {viewClub.courts.length} courts
                    </div>
                    <div className="ac-clubAbout">{viewClub.about}</div>

                    <div className="ac-actions">
                    
                    </div>
                  </>
                )}

                {isEditing && (
                  <div className="ac-miniNote">
                    Tip: Fill the fields below. Press <b>Save</b> on the top right.
                  </div>
                )}
              </div>
            </div>

            {/* EDIT UI */}
            {isEditing && (
              <div className="ac-editWrap">
                <div className="ac-editBanner">
                  <div className="ac-editTitle">Editing Club Information</div>
                  <div className="ac-editSub">Update details, then press Save (top right).</div>
                </div>

                {/* Basic Info */}
                <div className="ac-section">
                  <div className="ac-sectionHead">
                    <div className="ac-sectionTitle">Basic Info</div>
                    <div className="ac-sectionHint">Name, address, contact links</div>
                  </div>

                  <div className="ac-sectionBody ac-2col">
                    <div>
                      <div className="ac-fieldLabel">Club Name</div>
                      <input
                        className="ac-input"
                        value={draft.name}
                        onChange={(e) => update("name", e.target.value)}
                        placeholder="Enter club name"
                      />
                    </div>

                    <div>
                      <div className="ac-fieldLabel">Phone</div>
                      <input
                        className="ac-input"
                        value={draft.phone}
                        onChange={(e) => update("phone", e.target.value)}
                        placeholder="+962 ..."
                      />
                    </div>

                    <div className="ac-span2">
                      <div className="ac-fieldLabel">Address</div>
                      <input
                        className="ac-input"
                        value={draft.address}
                        onChange={(e) => update("address", e.target.value)}
                        placeholder="Full address"
                      />
                    </div>

                    <div>
                      <div className="ac-fieldLabel">Maps URL</div>
                      <input
                        className="ac-input"
                        value={draft.mapsUrl}
                        onChange={(e) => update("mapsUrl", e.target.value)}
                        placeholder="https://maps.google.com/..."
                      />
                    </div>

                    <div>
                      <div className="ac-fieldLabel">WhatsApp</div>
                      <input
                        className="ac-input"
                        value={draft.whatsapp}
                        onChange={(e) => update("whatsapp", e.target.value)}
                        placeholder="+962 ..."
                      />
                    </div>

                    <div className="ac-span2">
                      <div className="ac-fieldLabel">About</div>
                      <textarea
                        className="ac-textarea"
                        rows={4}
                        value={draft.about}
                        onChange={(e) => update("about", e.target.value)}
                        placeholder="Short description of the club..."
                      />
                    </div>
                  </div>
                </div>

                {/* Rules + Facilities */}
                <div className="ac-section">
                  <div className="ac-sectionHead">
                    <div className="ac-sectionTitle">Rules & Facilities</div>
                    <div className="ac-sectionHint">One item per line</div>
                  </div>

                  <div className="ac-sectionBody ac-2col">
                    <div>
                      <div className="ac-fieldLabel">Facilities</div>
                      <textarea
                        className="ac-textarea"
                        rows={6}
                        value={joinLines(draft.facilities)}
                        onChange={(e) => update("facilities", splitLines(e.target.value))}
                        placeholder={"Parking\nCafé\nLockers"}
                      />
                    </div>

                    <div>
                      <div className="ac-fieldLabel">Club Rules</div>
                      <textarea
                        className="ac-textarea"
                        rows={6}
                        value={joinLines(draft.clubRules)}
                        onChange={(e) => update("clubRules", splitLines(e.target.value))}
                        placeholder={"Free cancellation up to 24 hours...\nNo-shows may be charged..."}
                      />
                    </div>
                  </div>
                </div>

                {/* Gallery Manager */}
                <div className="ac-section">
                  <div className="ac-sectionHead">
                    <div className="ac-sectionTitle">Gallery Manager</div>
                    <div className="ac-sectionHint">{(draft.gallery || []).length} photos</div>
                  </div>

                  <div className="ac-sectionBody">
                    <div className="ac-photoTools">
                      <label className="ac-uploadBtn">
                        + Upload Photos
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={(e) => {
                            const files = Array.from(e.target.files || []);
                            if (!files.length) return;

                            setDraft((p) => ({
                              ...p,
                              gallery: [...(p.gallery || []), ...files.map((f) => URL.createObjectURL(f))],
                            }));

                            e.target.value = "";
                          }}
                          style={{ display: "none" }}
                        />
                      </label>

                      <div className="ac-uploadHint">Tip: upload multiple images at once.</div>
                    </div>

                    <div className="ac-photoListNice">
                      {(draft.gallery || []).map((img, i) => (
                        <div key={i} className="ac-photoRowNice">
                          <div className="ac-photoThumbLg" style={{ backgroundImage: `url(${img})` }} />
                          <div className="ac-photoInfo">
                            <div className="ac-photoTitle">Photo {i + 1}</div>
                            <div className="ac-photoSub">Press Save to apply changes</div>
                          </div>
                          <button className="ac-delBtn" type="button" onClick={() => deletePhoto(i)}>
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* VIEW MODE ONLY: RIGHT + BOTTOM CARDS */}
          {!isEditing && (
            <>
              {/* STATS */}
              <div className="ac-card ac-stats">
                <div className="ac-cardTitle">Quick Stats</div>

                <div className="ac-statGrid">
                  <div className="ac-stat">
                    <div className="ac-statNum">{viewClub.courts.length}</div>
                    <div className="ac-statLabel">Courts</div>
                  </div>
                  <div className="ac-stat">
                    <div className="ac-statNum">{viewClub.rating}</div>
                    <div className="ac-statLabel">Rating</div>
                  </div>
                  <div className="ac-stat">
                    <div className="ac-statNum">{viewClub.reviews}</div>
                    <div className="ac-statLabel">Reviews</div>
                  </div>
                </div>

                <div className="ac-statBtns">
                  <button className="ac-btn ac-btnPrimary" type="button">
                    Manage Courts
                  </button>
                </div>
              </div>

              {/* GALLERY */}
              <div className="ac-card ac-gallery">
                <div className="ac-cardHead">
                  <div className="ac-cardTitle">
                    Gallery <span className="ac-count">({(viewClub.gallery || []).length} photos)</span>
                  </div>
                  <button className="ac-link" type="button" onClick={() => setGalleryOpen(true)}>
                    View all
                  </button>
                </div>

                <div className="ac-galleryScroll">
                  {(viewClub.gallery || []).map((img, i) => (
                    <div
                      key={i}
                      className="ac-thumb ac-thumbWide"
                      style={{ backgroundImage: `url(${img})` }}
                      onClick={() => openGalleryAt(i)}
                      role="button"
                      tabIndex={0}
                    />
                  ))}
                </div>

                <div className="ac-galleryHint">Scroll to see more →</div>
              </div>

              {/* CONTACT */}
              <div className="ac-card ac-contact">
                <div className="ac-cardTitle">Contact</div>

                <div className="ac-row">
                  <div className="ac-k">WhatsApp</div>
                  <div className="ac-v">{viewClub.whatsapp}</div>
                </div>

                <div className="ac-row">
                  <div className="ac-k">Phone</div>
                  <div className="ac-v">{viewClub.phone}</div>
                </div>

                <a className="ac-mapBtn" href={viewClub.mapsUrl} target="_blank" rel="noreferrer">
                  📍 Open Maps
                </a>
              </div>

              {/* FACILITIES */}
              <div className="ac-card ac-fac">
                <div className="ac-cardHead">
                  <div className="ac-cardTitle">Facilities</div>
                </div>

                <div className="ac-facGrid">
                  {(viewClub.facilities || []).map((f, i) => (
                    <div key={i} className="ac-pill">
                      ✅ {f}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* CLUB RULES */}
<div className="ac-card ac-rules">
  <div className="ac-cardHead">
    <div>
      <div className="ac-cardTitle">Club Rules</div>
      <div className="ac-cardSub">What players must follow</div>
    </div>
  </div>

  <ul className="ac-bulletList">
    {(viewClub.clubRules || []).map((r, i) => (
      <li key={i}>{r}</li>
    ))}
  </ul>
</div>

        {/* MODAL (view mode only is fine, but keeping it working always) */}
        {galleryOpen && (
          <div className="ac-modal" onMouseDown={() => setGalleryOpen(false)}>
            <div className="ac-modalInner" onMouseDown={(e) => e.stopPropagation()}>
              <button className="ac-close" type="button" onClick={() => setGalleryOpen(false)}>
                ✕
              </button>

              <button
                className="ac-arrow left"
                type="button"
                onClick={() =>
                  setActiveImg((i) => (i - 1 + (viewClub.gallery || []).length) % (viewClub.gallery || []).length)
                }
              >
                ‹
              </button>

              <img className="ac-modalImg" src={(viewClub.gallery || [])[activeImg]} alt="" />

              <button
                className="ac-arrow right"
                type="button"
                onClick={() => setActiveImg((i) => (i + 1) % (viewClub.gallery || []).length)}
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