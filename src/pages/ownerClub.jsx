import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ownerClub.css";

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

function authHeaders(json = true) {
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

async function apiGet(path) {
  const res = await fetch(`${API}${path}`, { headers: authHeaders(false) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || "Request failed");
  return data;
}

async function apiPost(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: authHeaders(true),
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || "Request failed");
  return data;
}

async function apiPut(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: "PUT",
    headers: authHeaders(true),
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || "Request failed");
  return data;
}

async function apiDelete(path) {
  const res = await fetch(`${API}${path}`, {
    method: "DELETE",
    headers: authHeaders(false),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || "Request failed");
  return data;
}

async function uploadFile(file, folder = "clubs") {
  const o = getOwner();
  if (!o?.user_id) throw new Error("Owner session missing");

  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API}/upload?folder=${folder}`, {
    method: "POST",
    headers: {
      "x-role": "owner",
      "x-user-id": String(o.user_id),
    },
    body: form,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || "Upload failed");
  return data.url;
}

function joinLines(arr) {
  return (arr || []).join("\n");
}

function splitLines(text) {
  return (text || "")
    .split("\n")
    .map((x) => x.trim())
    .filter(Boolean);
}

export default function OwnerClub() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  const [club, setClub] = useState(null);
  const [clubImages, setClubImages] = useState([]);
  const [facilities, setFacilities] = useState([]);

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");

  const [deletingId, setDeletingId] = useState(null);

  const [draft, setDraft] = useState({
    name: "",
    city: "",
    address: "",
    about: "",
    phone_number: "",
    maps_url: "",
    whatsapp: "",
    rules: "",
    is_active: true,
    logo_url: "",
    cover_url: "",
    facilitiesText: "",
  });

  useEffect(() => {
    const o = getOwner();
    if (!o?.user_id) {
      navigate("/login", { replace: true });
      return;
    }

    let alive = true;

    async function loadAll() {
      try {
        setLoading(true);
        setErr("");
        setMsg("");

        const dash = await apiGet("/owner/dashboard");
        const myClub = dash.club;

        if (!myClub) throw new Error("No club found for this owner.");

        const [imgs, facs] = await Promise.all([
          apiGet(`/club-images?club_id=${myClub.club_id}`),
          apiGet(`/club-facilities?club_id=${myClub.club_id}`),
        ]);

        if (!alive) return;

        const imgsArr = Array.isArray(imgs) ? imgs : [];
        const facsArr = Array.isArray(facs) ? facs : [];

        setClub(myClub);
        setClubImages(imgsArr);
        setFacilities(facsArr);

        setDraft({
          name: myClub.name || "",
          city: myClub.city || "",
          address: myClub.address || "",
          about: myClub.about || "",
          phone_number: myClub.phone_number || "",
          maps_url: myClub.maps_url || "",
          whatsapp: myClub.whatsapp || "",
          rules: myClub.rules || "",
          is_active: myClub.is_active ?? true,
          logo_url: myClub.logo_url || "",
          cover_url: myClub.cover_url || "",
          facilitiesText: joinLines(facsArr.map((f) => f.label)),
        });
      } catch (e) {
        if (!alive) return;
        setErr(e.message || "Failed to load");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    loadAll();
    return () => {
      alive = false;
    };
  }, [navigate]);

  function onDraft(k, v) {
    setDraft((p) => ({ ...p, [k]: v }));
  }

  async function handleLogoChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setErr("");
      setMsg("");
      const url = await uploadFile(file, "clubs");
      onDraft("logo_url", url);
      setMsg("Logo uploaded. Click Save to apply.");
    } catch (e2) {
      setErr(e2.message || "Logo upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleCoverChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      setErr("");
      setMsg("");
      const url = await uploadFile(file, "clubs");
      onDraft("cover_url", url);
      setMsg("Cover uploaded. Click Save to apply.");
    } catch (e2) {
      setErr(e2.message || "Cover upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleAddGalleryImages(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length || !club?.club_id) return;

    try {
      setUploading(true);
      setErr("");
      setMsg("");

      const createdList = [];
      for (const f of files) {
        const url = await uploadFile(f, "clubs");
        const created = await apiPost("/club-images", {
          club_id: club.club_id,
          image_url: url,
          position: 0,
        });
        createdList.push(created);
      }

      setClubImages((prev) => [...prev, ...createdList]);
      setMsg("Gallery updated ✅");
    } catch (e2) {
      setErr(e2.message || "Gallery upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function deleteGalleryImage(image_id) {
    if (!image_id) return;

    const ok = window.confirm("Delete this image?");
    if (!ok) return;

    setErr("");
    setMsg("");

    const before = clubImages;
    setClubImages((prev) => prev.filter((x) => x.image_id !== image_id));

    try {
      setDeletingId(image_id);
      await apiDelete(`/club-images/${image_id}`);
      setMsg("Image deleted ✅");
    } catch (e) {
      setClubImages(before);
      setErr(e.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  }

  async function handleSave() {
    if (!club?.club_id) return;

    try {
      setSaving(true);
      setErr("");
      setMsg("");

      const payload = {
        name: draft.name.trim(),
        city: draft.city.trim(),
        address: draft.address.trim(),
        about: draft.about?.trim() || null,
        phone_number: draft.phone_number?.trim() || null,
        maps_url: draft.maps_url?.trim() || null,
        whatsapp: draft.whatsapp?.trim() || null,
        rules: draft.rules?.trim() || null,
        is_active: !!draft.is_active,
        logo_url: draft.logo_url || null,
        cover_url: draft.cover_url || null,
      };

      if (!payload.name || !payload.city || !payload.address) {
        setErr("Please fill Club Name, City, and Address.");
        return;
      }

      const updated = await apiPut(`/clubs/${club.club_id}`, payload);
      const fresh = updated.club || updated;

      const wantedLabels = splitLines(draft.facilitiesText);

      for (const f of facilities) {
        await apiDelete(`/club-facilities/${f.facility_id}`);
      }

      const newFacilities = [];
      for (const label of wantedLabels) {
        const created = await apiPost("/club-facilities", {
          club_id: club.club_id,
          label,
          icon: "✅",
        });
        newFacilities.push(created);
      }

      setClub(fresh);
      setFacilities(newFacilities);
      setEditing(false);
      setMsg("Saved successfully ✅");
    } catch (e) {
      setErr(e.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="oc-state">Loading...</div>;
  if (err && !club) return <div className="oc-state oc-stateErr">{err}</div>;
  if (!club) return <div className="oc-state">No club found.</div>;

  const logoSrc = draft.logo_url ? fileUrl(draft.logo_url) : "";
  const coverSrc = draft.cover_url ? fileUrl(draft.cover_url) : "";

  return (
    <div className="oc-page">
      <div className="oc-shell">

        {/* Top bar */}
        <div className={`oc-hero ${editing ? "isEditing" : ""}`}>
          <div className="oc-heroLeft">
            <div className="oc-title">My Club</div>
            <div className="oc-sub">View and edit your club details.</div>
          </div>

          <div className="oc-heroActions">
            {!editing ? (
              <button className="oc-btn oc-btnPrimary" onClick={() => setEditing(true)}>
                Edit
              </button>
            ) : (
              <>
                <button
                  className="oc-btn oc-btnGhost"
                  onClick={() => setEditing(false)}
                  disabled={saving || uploading}
                >
                  Cancel
                </button>
                <button
                  className="oc-btn oc-btnPrimary"
                  onClick={handleSave}
                  disabled={saving || uploading}
                >
                  {saving ? "Saving..." : "Save"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* messages */}
        {(err || msg) && (
          <div className={`oc-alert ${err ? "isErr" : "isOk"}`}>
            {err ? err : msg}
          </div>
        )}

        {/* Cover card */}
        {!editing && coverSrc && (
          <div className="oc-cover">
            <img className="oc-coverImg" src={coverSrc} alt="Club cover" />
            <div className="oc-coverOverlay" />

            <div className="oc-coverContent">
              <div>
                <div className="oc-coverTitle">{club.name}</div>
                <div className="oc-coverMeta">📍 {club.city} • {club.address}</div>
              </div>
            </div>
          </div>
        )}

        {/* Main layout */}
        <div className={`oc-grid ${editing ? "isEditing" : ""}`}>

          {/* Left column */}
          <div className="oc-col">

            {/* Overview */}
            <div className="oc-card">
              <div className="oc-cardHead">
                <div>
                  <div className="oc-cardTitle">Club Overview</div>
                  <div className="oc-cardSub">Owner view for your club info and images.</div>
                </div>

                {!editing && (
                  <div className="oc-quickBtns">
                    <button className="oc-btn oc-btnSmall" onClick={() => navigate("/admin/courts")}>
                      Manage Courts
                    </button>
                    <button className="oc-btn oc-btnSmall" onClick={() => navigate("/admin/reservations")}>
                      Manage Reservations
                    </button>
                  </div>
                )}
              </div>

              <div className="oc-overview">
                <div className="oc-logoBox">
                  {logoSrc ? (
                    <img className="oc-logo" src={logoSrc} alt="Club logo" />
                  ) : (
                    <div className="oc-logoFallback">🏟️</div>
                  )}
                </div>

                <div className="oc-info">
                  {!editing ? (
                    <>
                      <div className="oc-name">{club.name}</div>
                      <div className="oc-meta">📍 {club.city} • {club.address}</div>
                      <div className="oc-about">{club.about || "No description yet."}</div>
                    </>
                  ) : (
                    <div className="oc-form">
                      <div className="oc-formRow">
                        <div>
                          <div className="oc-label">Club Name *</div>
                          <input className="oc-input" value={draft.name} onChange={(e) => onDraft("name", e.target.value)} />
                        </div>
                        <div>
                          <div className="oc-label">City *</div>
                          <input className="oc-input" value={draft.city} onChange={(e) => onDraft("city", e.target.value)} />
                        </div>
                      </div>

                      <div>
                        <div className="oc-label">Address *</div>
                        <input className="oc-input" value={draft.address} onChange={(e) => onDraft("address", e.target.value)} />
                      </div>

                      <div>
                        <div className="oc-label">About</div>
                        <textarea className="oc-textarea" value={draft.about} onChange={(e) => onDraft("about", e.target.value)} />
                      </div>

                      <div className="oc-formRow">
                        <div>
                          <div className="oc-label">Phone</div>
                          <input className="oc-input" value={draft.phone_number} onChange={(e) => onDraft("phone_number", e.target.value)} />
                        </div>
                        <div>
                          <div className="oc-label">WhatsApp</div>
                          <input className="oc-input" value={draft.whatsapp} onChange={(e) => onDraft("whatsapp", e.target.value)} />
                        </div>
                      </div>

                      <div>
                        <div className="oc-label">Maps URL</div>
                        <input className="oc-input" value={draft.maps_url} onChange={(e) => onDraft("maps_url", e.target.value)} />
                      </div>

                      <div>
                        <div className="oc-label">Rules</div>
                        <textarea className="oc-textarea" value={draft.rules} onChange={(e) => onDraft("rules", e.target.value)} />
                      </div>

                      <div className="oc-formRow">
                        <div>
                          <div className="oc-label">Visibility</div>
                          <select
                            className="oc-input"
                            value={draft.is_active ? "true" : "false"}
                            onChange={(e) => onDraft("is_active", e.target.value === "true")}
                          >
                            <option value="true">Active</option>
                            <option value="false">Hidden</option>
                          </select>
                        </div>

                        <div>
                          <div className="oc-label">Facilities (one per line)</div>
                          <textarea
                            className="oc-textarea"
                            rows={4}
                            value={draft.facilitiesText}
                            onChange={(e) => onDraft("facilitiesText", e.target.value)}
                            placeholder={"Parking\nCafe\nBathrooms"}
                          />
                        </div>
                      </div>

                      <div className="oc-uploadRow">
                        <label className="oc-uploadBtn">
                          {uploading ? "Uploading..." : "Upload Logo"}
                          <input type="file" accept="image/*" onChange={handleLogoChange} disabled={uploading} />
                        </label>

                        <label className="oc-uploadBtn">
                          {uploading ? "Uploading..." : "Upload Cover"}
                          <input type="file" accept="image/*" onChange={handleCoverChange} disabled={uploading} />
                        </label>
                      </div>

                      {draft.cover_url && (
                        <div className="oc-preview">
                          <img className="oc-previewImg" src={fileUrl(draft.cover_url)} alt="Cover preview" />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Gallery */}
            {!editing && (
              <div className="oc-card">
                <div className="oc-cardHead">
                  <div>
                    <div className="oc-cardTitle">Gallery ({clubImages.length})</div>
                    <div className="oc-cardSub">Upload or delete club images.</div>
                  </div>

                  <label className="oc-uploadBtn">
                    {uploading ? "Uploading..." : "+ Upload"}
                    <input type="file" accept="image/*" multiple onChange={handleAddGalleryImages} disabled={uploading} />
                  </label>
                </div>

                {clubImages.length === 0 ? (
                  <div className="oc-empty">No gallery images yet.</div>
                ) : (
                  <div className="oc-gallery">
                    {clubImages.map((img) => (
                      <div key={img.image_id} className="oc-imgCard">
                        <img className="oc-img" src={fileUrl(img.image_url)} alt="Gallery" />
                        <div className="oc-imgActions">
                          <button
                            className="oc-delBtn"
                            type="button"
                            onClick={() => deleteGalleryImage(img.image_id)}
                            disabled={deletingId === img.image_id}
                          >
                            {deletingId === img.image_id ? "Deleting..." : "Delete"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right column */}
          {!editing && (
            <div className="oc-side">
              <div className="oc-card">
                <div className="oc-cardHead">
                  <div>
                    <div className="oc-cardTitle">Facilities</div>
                    <div className="oc-cardSub">What your club provides.</div>
                  </div>
                </div>

                {facilities.length === 0 ? (
                  <div className="oc-empty">No facilities yet.</div>
                ) : (
                  <div className="oc-pills">
                    {facilities.map((f) => (
                      <span key={f.facility_id} className="oc-pill">
                        ✅ {f.label}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="oc-card">
                <div className="oc-cardHead">
                  <div>
                    <div className="oc-cardTitle">Contact</div>
                    <div className="oc-cardSub">Quick links for your customers.</div>
                  </div>
                </div>

                <div className="oc-kv">
                  <div className="oc-k">Phone</div>
                  <div className="oc-v">{club.phone_number || "—"}</div>
                </div>
                <div className="oc-kv">
                  <div className="oc-k">WhatsApp</div>
                  <div className="oc-v">{club.whatsapp || "—"}</div>
                </div>
                <div className="oc-kv">
                  <div className="oc-k">Maps</div>
                  <div className="oc-v">
                    {club.maps_url ? (
                      <a className="oc-link" href={club.maps_url} target="_blank" rel="noreferrer">
                        Open
                      </a>
                    ) : (
                      "—"
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}