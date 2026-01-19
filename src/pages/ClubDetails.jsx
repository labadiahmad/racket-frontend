import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./clubDetails.css";
import starIcon from "../assets/clubs/star.png";

/* =========================
   CONFIG
========================= */
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5050";
const API = `${API_BASE}/api`;

/* =========================
   HELPERS
========================= */
function safeArr(x) {
  return Array.isArray(x) ? x : [];
}

function fileUrl(p) {
  if (!p) return "";
  if (p.startsWith("http")) return p;
  return `${API_BASE}${p}`; // "/uploads/.." -> "http://localhost:5050/uploads/.."
}

function fmtTime(t) {
  if (!t) return "";
  return String(t).slice(0, 5);
}

function startOfDay(d) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function toISODate(dt) {
  if (!dt) return "";
  const y = dt.getFullYear();
  const m = String(dt.getMonth() + 1).padStart(2, "0");
  const d = String(dt.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function weatherLabel(code) {
  if (code === 0) return { t: "Clear", ic: "☀️" };
  if (code === 1 || code === 2) return { t: "Partly cloudy", ic: "🌤️" };
  if (code === 3) return { t: "Cloudy", ic: "☁️" };
  if (code === 45 || code === 48) return { t: "Fog", ic: "🌫️" };
  if ([51, 53, 55, 56, 57].includes(code)) return { t: "Drizzle", ic: "🌦️" };
  if ([61, 63, 65, 66, 67].includes(code)) return { t: "Rain", ic: "🌧️" };
  if ([71, 73, 75, 77].includes(code)) return { t: "Snow", ic: "❄️" };
  if ([80, 81, 82].includes(code)) return { t: "Rain showers", ic: "🌧️" };
  if ([95, 96, 99].includes(code)) return { t: "Thunderstorm", ic: "⛈️" };
  return { t: "Weather", ic: "🌡️" };
}

function getSavedUser() {
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

function authHeaders(extra = {}) {
  const u = getSavedUser();
  return {
    "Content-Type": "application/json",
    ...(u?.user_id ? { "x-user-id": String(u.user_id) } : {}),
    ...(u?.role ? { "x-role": String(u.role) } : {}),
    ...extra,
  };
}

async function apiGet(path) {
  const res = await fetch(`${API}${path}`);
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || "Request failed");
  return data;
}

async function apiSend(path, options = {}) {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: authHeaders(options.headers || {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || "Request failed");
  return data;
}

/* Upload helper (same backend endpoint you use) */
async function uploadReviewImage(file) {
  const fd = new FormData();
  fd.append("file", file);

  const res = await fetch(`${API_BASE}/api/upload?folder=reviews`, {
    method: "POST",
    body: fd,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Upload failed");
  return data.url; // "/uploads/reviews/xxxx.jpg"
}

/* =========================
   COMPONENT
========================= */
export default function ClubDetails({ user, reservationDraft, setReservationDraft }) {
  const { id } = useParams();
  const clubId = Number(id);

  const navigate = useNavigate();
  const location = useLocation();

  /* ---------- DATA (from DB only) ---------- */
  const [club, setClub] = useState(null);
  const [clubImages, setClubImages] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [courts, setCourts] = useState([]);
  const [reviews, setReviews] = useState([]);

  const [courtId, setCourtId] = useState("");
  const [courtImages, setCourtImages] = useState([]);
  const [slots, setSlots] = useState([]);

  /* ---------- UI state ---------- */
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  /* ---------- booking state ---------- */
  const [bookStep, setBookStep] = useState("details"); // details -> calendar -> slots
  const [pickedDate, setPickedDate] = useState(null);
  const [pickedSlotId, setPickedSlotId] = useState(null);
  const [calMonthOffset, setCalMonthOffset] = useState(0);

  /* ---------- gallery ---------- */
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryShow, setGalleryShow] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  /* ---------- reviews tools ---------- */
  const [rq, setRq] = useState("");
  const [starsFilter, setStarsFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  /* ---------- weather ---------- */
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherErr, setWeatherErr] = useState("");

  /* ---------- add review modal ---------- */
  const [openReview, setOpenReview] = useState(false);
  const [revSaving, setRevSaving] = useState(false);
  const [revErr, setRevErr] = useState("");
  const [revDraft, setRevDraft] = useState({ stars: 5, comment: "", photos: [] });

// ---------- edit review modal ----------
const [editOpen, setEditOpen] = useState(false);
const [editSaving, setEditSaving] = useState(false);
const [editErr, setEditErr] = useState("");
const [editDraft, setEditDraft] = useState({ review_id: null, stars: 5, comment: "" });
 
const closeReview = () => {
    setOpenReview(false);
    setRevErr("");
    setRevDraft({ stars: 5, comment: "", photos: [] });
  };

  /* =========================
     1) LOAD CLUB + RELATED
  ========================= */
  useEffect(() => {
    let alive = true;

    async function loadAll() {
      setLoading(true);
      setErr("");

      try {
        const [clubRes, imgs, facs, crts, revs] = await Promise.all([
          apiGet(`/clubs/${clubId}`),
          apiGet(`/club-images?club_id=${clubId}`).catch(() => []),
          apiGet(`/club-facilities?club_id=${clubId}`).catch(() => []),
          apiGet(`/courts?club_id=${clubId}`).catch(() => []),
          apiGet(`/reviews?club_id=${clubId}`).catch(() => []),
        ]);

        if (!alive) return;

        setClub(clubRes);
        setClubImages(safeArr(imgs));
        setFacilities(safeArr(facs));
        setCourts(safeArr(crts));
        setReviews(safeArr(revs));

        // choose initial court
        const firstCourt = crts?.[0]?.court_id ? String(crts[0].court_id) : "";
        const draftCourt =
          reservationDraft?.clubId === String(clubId) && reservationDraft?.courtId
            ? String(reservationDraft.courtId)
            : "";

        const nextCourtId = draftCourt || firstCourt;
        setCourtId(nextCourtId);

        // restore draft date/slot (optional)
        const draftDate =
          reservationDraft?.clubId === String(clubId) && reservationDraft?.pickedDateISO
            ? new Date(reservationDraft.pickedDateISO)
            : null;

        const draftSlotId =
          reservationDraft?.clubId === String(clubId) && reservationDraft?.pickedSlotId
            ? String(reservationDraft.pickedSlotId)
            : null;

        setPickedDate(draftDate);
        setPickedSlotId(draftSlotId);

        // step logic
        if (location.state?.goToStep === "slots") setBookStep("slots");
        else if (draftSlotId) setBookStep("slots");
        else if (draftDate) setBookStep("calendar");
        else setBookStep("details");
      } catch (e) {
        if (!alive) return;
        setErr(e.message || "Failed to load club");
      } finally {
        if (!alive) return;
        setLoading(false);
      }
    }

    loadAll();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clubId]);

  /* clear route state once */
  useEffect(() => {
    if (location.state?.goToStep) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, [location.pathname, location.state, navigate]);

  /* =========================
     2) LOAD COURT IMAGES + SLOTS
  ========================= */
  useEffect(() => {
    let alive = true;

    async function loadCourtExtras() {
      if (!courtId) {
        setCourtImages([]);
        setSlots([]);
        return;
      }

      try {
        const [ci, sl] = await Promise.all([
          apiGet(`/court-images?court_id=${courtId}`).catch(() => []),
          apiGet(`/slots?court_id=${courtId}`).catch(() => []),
        ]);

        if (!alive) return;
        setCourtImages(safeArr(ci));
        setSlots(safeArr(sl));
      } catch {
        if (!alive) return;
        setCourtImages([]);
        setSlots([]);
      }
    }

    loadCourtExtras();
    return () => {
      alive = false;
    };
  }, [courtId]);

  /* =========================
     SELECTED COURT + SLOT
  ========================= */
  const selectedCourt = courts.find((c) => String(c.court_id) === String(courtId)) || courts[0] || null;
  const pickedSlot = slots.find((s) => String(s.slot_id) === String(pickedSlotId)) || null;

  /* =========================
     CALENDAR HELPERS
  ========================= */
  function getCalInfo() {
    const base = new Date();
    const first = new Date(base.getFullYear(), base.getMonth() + calMonthOffset, 1);
    const year = first.getFullYear();
    const month = first.getMonth();
    const monthName = first.toLocaleString("en-US", { month: "long" });

    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = new Date(year, month, 1).getDay();

    const cells = [];
    for (let i = 0; i < startDay; i++) cells.push(null);
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
    while (cells.length % 7 !== 0) cells.push(null);

    return { year, monthName, cells };
  }

  const calInfo = getCalInfo();

  function sameDay(a, b) {
    return a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  function isSelectableDate(dt) {
    if (!dt) return false;
    const today = startOfDay(new Date());
    const max = new Date(today);
    max.setDate(max.getDate() + 15);
    const x = startOfDay(dt);
    return x >= today && x <= max;
  }

  useEffect(() => {
    if (pickedDate && !isSelectableDate(pickedDate)) {
      setPickedDate(null);
      setPickedSlotId(null);
      setWeather(null);
      setWeatherErr("");
    }
  }, [calMonthOffset]); // eslint-disable-line

  /* =========================
     GALLERY
  ========================= */
const galleryList = (() => {
  const out = [];

  const add = (p) => {
    if (!p) return;
    out.push(p);
  };

  add(club?.cover_url);

  safeArr(clubImages).forEach((x) => {
    if (typeof x === "string") return add(x);
    add(x.image_url);
    add(x.url);
    add(x.path);
    add(x.image);
    add(x.cover_url);
  });

  // remove duplicates + remove empty
  return Array.from(new Set(out)).filter(Boolean);
})();


  const openGallery = (index = 0) => {
    setActiveImg(index);
    setGalleryOpen(true);
  };

  const closeGallery = () => {
    setGalleryShow(false);
    setTimeout(() => setGalleryOpen(false), 180);
  };

  useEffect(() => {
    if (!galleryOpen) return;

    requestAnimationFrame(() => setGalleryShow(true));

    const onKey = (e) => {
      if (e.key === "Escape") closeGallery();
      if (e.key === "ArrowRight") setActiveImg((i) => (i + 1) % (galleryList.length || 1));
      if (e.key === "ArrowLeft") setActiveImg((i) => (i - 1 + (galleryList.length || 1)) % (galleryList.length || 1));
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [galleryOpen, galleryList.length]);

  /* =========================
     WEATHER (open-meteo)
  ========================= */
  useEffect(() => {
    if (!pickedDate) {
      setWeather(null);
      setWeatherErr("");
      return;
    }

    if (!club?.lat || !club?.lon) {
      setWeatherErr("No location for this club yet.");
      setWeather(null);
      return;
    }

    const dateKey = toISODate(pickedDate);
    setWeatherLoading(true);
    setWeatherErr("");

    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${club.lat}&longitude=${club.lon}` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
      `&timezone=auto&forecast_days=16`;

    fetch(url)
      .then((r) => r.json())
      .then((data) => {
        const days = data?.daily?.time || [];
        const idx = days.indexOf(dateKey);

        if (idx === -1) {
          setWeather(null);
          setWeatherErr("Weather not available for this date.");
          return;
        }

        const code = data.daily.weather_code[idx];
        const tMax = data.daily.temperature_2m_max[idx];
        const tMin = data.daily.temperature_2m_min[idx];
        const rain = data.daily.precipitation_probability_max?.[idx];

        setWeather({ dateKey, code, tMax, tMin, rain });
      })
      .catch(() => setWeatherErr("Failed to load weather."))
      .finally(() => setWeatherLoading(false));
  }, [pickedDate, club?.lat, club?.lon]);

  /* =========================
     REVIEWS: FILTER + SORT
  ========================= */
  let filteredReviews = safeArr(reviews).slice();

  const query = rq.trim().toLowerCase();
  if (query) {
    filteredReviews = filteredReviews.filter((x) => (x.comment || "").toLowerCase().includes(query));
  }

  if (starsFilter !== "All") {
    filteredReviews = filteredReviews.filter((x) => Number(x.stars) === Number(starsFilter));
  }

const currentUserId = String(user?.user_id || user?.id || getSavedUser()?.user_id || "");
const isAdmin = String(user?.role || getSavedUser()?.role || "").toLowerCase() === "admin";


  filteredReviews.sort((a, b) => {
    const aDate = (a.created_at || "").toString();
    const bDate = (b.created_at || "").toString();
    if (sortBy === "Newest") return bDate.localeCompare(aDate);
    if (sortBy === "Oldest") return aDate.localeCompare(bDate);
    if (sortBy === "Highest") return Number(b.stars) - Number(a.stars);
    if (sortBy === "Lowest") return Number(a.stars) - Number(b.stars);
    return 0;
  });

  const hasReviews = filteredReviews.length > 0;
  const avgRating = hasReviews
    ? Math.round((filteredReviews.reduce((sum, r) => sum + Number(r.stars || 0), 0) / filteredReviews.length) * 10) / 10
    : 0;

  /* =========================
     ADD REVIEW + UPLOAD PHOTOS
  ========================= */
  const onPickPhotos = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const left = 6 - (revDraft.photos?.length || 0);
    const chosen = files.slice(0, Math.max(left, 0));

    const urls = [];
    try {
      for (const f of chosen) {
        const url = await uploadReviewImage(f);
        urls.push(url);
      }
      setRevDraft((p) => ({ ...p, photos: [...(p.photos || []), ...urls].slice(0, 6) }));
    } catch (err) {
      setRevErr(err.message || "Upload failed");
    } finally {
      e.target.value = "";
    }
  };

  const removePickedPhoto = (url) => {
    setRevDraft((p) => ({ ...p, photos: (p.photos || []).filter((x) => x !== url) }));
  };

  async function reloadReviews() {
    const revs = await apiGet(`/reviews?club_id=${clubId}`).catch(() => []);
    setReviews(safeArr(revs));
  }

function openEditReview(r) {
  setEditErr("");
  setEditDraft({
    review_id: r.review_id,
    stars: Number(r.stars || 5),
    comment: r.comment || "",
  });
  setEditOpen(true);
}

function closeEditReview() {
  setEditOpen(false);
  setEditErr("");
  setEditDraft({ review_id: null, stars: 5, comment: "" });
}

async function saveEditReview() {
  if (!editDraft.comment.trim()) {
    setEditErr("Write a comment first.");
    return;
  }

  try {
    setEditSaving(true);
    setEditErr("");

    await apiSend(`/reviews/${editDraft.review_id}`, {
      method: "PUT",
      body: JSON.stringify({
        stars: Number(editDraft.stars),
        comment: editDraft.comment,
      }),
    });

    await reloadReviews();
    closeEditReview();
  } catch (err) {
    setEditErr(err.message || "Failed to update review");
  } finally {
    setEditSaving(false);
  }
}

async function deleteReview(reviewId) {
  const ok = window.confirm("Delete this review?");
  if (!ok) return;

  try {
    await apiSend(`/reviews/${reviewId}`, { method: "DELETE" });
    await reloadReviews();
  } catch (err) {
    alert(err.message || "Failed to delete review");
  }
}

  const submitReview = async () => {
    if (!revDraft.comment.trim()) {
      setRevErr("Write a comment first.");
      return;
    }

    const userId = user?.id || user?.user_id || getSavedUser()?.user_id;
    if (!userId) {
      setRevErr("Login required");
      return;
    }

    try {
      setRevSaving(true);
      setRevErr("");

      // 1) create review
      const created = await apiSend("/reviews", {
        method: "POST",
        body: JSON.stringify({
          club_id: clubId,
          stars: Number(revDraft.stars),
          comment: revDraft.comment,
        }),
      });

      const reviewId = created.review_id;

      // 2) save images
      const photos = safeArr(revDraft.photos);
      for (let i = 0; i < photos.length; i++) {
        await apiSend("/review-images", {
          method: "POST",
          body: JSON.stringify({
            review_id: Number(reviewId),
            image_url: photos[i],
            position: i,
          }),
        });
      }

      await reloadReviews();
      closeReview();
    } catch (err) {
      setRevErr(err.message || "Failed to add review");
    } finally {
      setRevSaving(false);
    }
  };

  /* =========================
     BOOKING CONFIRM PAYLOAD
  ========================= */
  const goBackStep = () => {
    if (bookStep === "calendar") setBookStep("details");
    else if (bookStep === "slots") setBookStep("calendar");
  };

  const goConfirm = () => {
    if (!pickedDate || !pickedSlot || !selectedCourt || !club) return;

    const payload = {
      clubId: String(club.club_id),
      clubName: club.name,
      clubLogo: club.logo_url || "",
      courtId: String(selectedCourt.court_id),
      courtName: selectedCourt.name || `Court ${selectedCourt.court_id}`,
      courtImage: courtImages?.[0]?.image_url || "",
      pickedDateISO: pickedDate.toISOString(),
      pickedSlotId: String(pickedSlot.slot_id),
      pickedSlot: {
        id: String(pickedSlot.slot_id),
        from: fmtTime(pickedSlot.time_from),
        to: fmtTime(pickedSlot.time_to),
        price: pickedSlot.price,
      },
      returnTo: location.pathname,
    };

    if (setReservationDraft) setReservationDraft((prev) => ({ ...prev, ...payload }));
    navigate("/confirm-reservation", { state: payload });
  };

  useEffect(() => {
    if (!setReservationDraft || !club) return;

    setReservationDraft((prev) => ({
      ...prev,
      clubId: String(club.club_id),
      clubName: club.name,
      clubLogo: club.logo_url || "",
      courtId: courtId || "",
      courtName: selectedCourt?.name || "",
      courtImage: courtImages?.[0]?.image_url || "",
      pickedDateISO: pickedDate ? pickedDate.toISOString() : null,
      pickedSlotId: pickedSlotId || null,
      pickedSlot: pickedSlot
        ? {
            id: String(pickedSlot.slot_id),
            from: fmtTime(pickedSlot.time_from),
            to: fmtTime(pickedSlot.time_to),
            price: pickedSlot.price,
          }
        : null,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [club, courtId, selectedCourt?.name, courtImages.length, pickedDate, pickedSlotId]);

  /* =========================
     UI STATES
  ========================= */
  if (loading) return <div style={{ padding: 120 }}>Loading...</div>;
  if (err) return <div style={{ padding: 120 }}>{err}</div>;
  if (!club) return <div style={{ padding: 120 }}>Club not found</div>;

  /* =========================
     RENDER
  ========================= */
  const topRating = Number(club.avg_rating || 0);
  const topReviewsCount = Number(club.reviews_count || 0);

  const heroImg = galleryList[0] || club.cover_url || "";

  return (
    <div className="cd-page">
      <div className="cd-shell">
        {/* TOP BAR */}
        <div className="cd-topBar">
          <button className="cd-topBackBtn" type="button" onClick={() => navigate(-1)}>
            <span className="cd-topBackIc">←</span>
            <span>Back</span>
          </button>

          <div className="cd-breadcrumb">
            <div className="cd-clubCrumb">
              {club.logo_url ? (
                <img className="cd-clubLogo" src={fileUrl(club.logo_url)} alt={`${club.name} logo`} />
              ) : (
                <div className="cd-clubLogo" />
              )}
              <button className="cd-link" type="button">{club.name}</button>
            </div>
          </div>

          <div className="cd-rating">
            <span className="cd-stars">
              {Array.from({ length: Math.round(topRating) }).map((_, i) => (
                <img key={i} src={starIcon} className="cd-star" alt="star" />
              ))}
            </span>
            <span className="cd-rev">{topReviewsCount}</span>
          </div>
        </div>

        {/* TOP GRID */}
        <div className="cd-topGrid">
          <div className="cd-leftStack">
            <section className="cd-card">
              <div className="cd-cardTitle">About The Club</div>
              <p className="cd-cardText">{club.about || "No description yet."}</p>
            </section>

            <section className="cd-card">
              <div className="cd-cardTitle">Contact Info</div>

              {club.whatsapp && (
                <a
                  className="cd-contactRow cd-wa"
                  href={`https://wa.me/${String(club.whatsapp).replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="cd-contactIc">💬</span>
                  <div className="cd-contactBody">
                    <div className="cd-contactLabel">WhatsApp</div>
                    <div className="cd-contactVal">{club.whatsapp}</div>
                  </div>
                </a>
              )}

              {club.phone_number && (
                <a className="cd-contactRow cd-ph" href={`tel:${club.phone_number}`}>
                  <span className="cd-contactIc">📞</span>
                  <div className="cd-contactBody">
                    <div className="cd-contactLabel">Phone Number</div>
                    <div className="cd-contactVal">{club.phone_number}</div>
                  </div>
                </a>
              )}
            </section>
          </div>

          {/* main image */}
         <div
  className="cd-galleryOne"
  style={heroImg ? { backgroundImage: `url(${fileUrl(heroImg)})` } : {}}
  role="button"
  tabIndex={0}
  onClick={() => openGallery(0)}
  onKeyDown={(e) => {
    if (e.key === "Enter") openGallery(0);
  }}
>
  <div className="cd-galleryOverlay">
    <button
      className="cd-viewAllBtn"
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        openGallery(0);
      }}
    >
      {galleryList.length > 1 ? "View All" : "View Photo"}
    </button>
  </div>
</div>
        </div>

        {/* BOOK YOUR COURT */}
        <section className="cd-card cd-bookFull">
          <div className="cd-bookHead">
            <div>
              <div className="cd-cardTitle">Book Your Court</div>
              <div className="cd-smallMuted">
                {bookStep === "details" && "Pick A Court"}
                {bookStep === "calendar" && "Pick A Date"}
                {bookStep === "slots" && "Pick A Time Slot"}
              </div>
            </div>

            {bookStep === "details" && (
              <select
                className="cd-select"
                value={courtId}
                onChange={(e) => {
                  setCourtId(e.target.value);
                  setPickedDate(null);
                  setPickedSlotId(null);
                }}
              >
                {courts.map((c) => (
                  <option key={c.court_id} value={String(c.court_id)}>
                    {c.name || `Court ${c.court_id}`}
                  </option>
                ))}
              </select>
            )}

            {bookStep !== "details" && (
              <button className="cd-backBtn" type="button" onClick={goBackStep}>
                ← Back
              </button>
            )}
          </div>

          {/* STEP 1 */}
          {bookStep === "details" && (
            <div className="cd-bookGrid">
              <div className="cd-detailBox">
                <div className="cd-detailTitle">Court Details</div>
                <div className="cd-chipSolid">{selectedCourt?.court_type || "Court"}</div>

                <div className="cd-chipGrid">
                  {safeArr(selectedCourt?.features)
                    .map(String)
                    .filter(Boolean)
                    .slice(0, 8)
                    .map((x, i) => (
                      <div key={i} className="cd-chip">{x}</div>
                    ))}
                </div>

                <button
                  className="cd-ghostBtn"
                  type="button"
                  onClick={() => navigate(`/clubs/${club.club_id}/courts/${courtId}`)}
                >
                  View Court Details
                </button>
              </div>

              <div className="cd-courtVisual">
                {courtImages?.[0]?.image_url ? (
                  <img className="cd-courtImg" src={fileUrl(courtImages[0].image_url)} alt="Court" />
                ) : (
                  <div className="cd-courtImg" />
                )}

                <button className="cd-nextBtn" type="button" onClick={() => setBookStep("calendar")}>
                  Next
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {bookStep === "calendar" && (
            <div className="cd-calWrap">
              <div className="cd-calCard">
                <div className="cd-calTop">
                  <button type="button" className="cd-calNav" onClick={() => setCalMonthOffset((v) => v - 1)}>
                    <span className="cd-calArrow">‹</span>
                  </button>

                  <div className="cd-calMonth">
                    {calInfo.monthName} <span className="cd-calYear">{calInfo.year}</span>
                  </div>

                  <button type="button" className="cd-calNav" onClick={() => setCalMonthOffset((v) => v + 1)}>
                    <span className="cd-calArrow">›</span>
                  </button>
                </div>

                <div className="cd-calDow">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
                    <div key={d}>{d}</div>
                  ))}
                </div>

                <div className="cd-calGrid">
                  {calInfo.cells.map((dt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`cd-day ${dt ? "" : "isEmpty"} ${sameDay(dt, pickedDate) ? "isSelected" : ""}`}
                      disabled={!dt || !isSelectableDate(dt)}
                      onClick={() => {
                        setPickedDate(dt);
                        setWeatherErr("");
                      }}
                    >
                      {dt ? dt.getDate() : ""}
                    </button>
                  ))}
                </div>
              </div>

              <div className="cd-calActions">
                <div className="cd-picked">
                  {pickedDate ? `Selected: ${pickedDate.toLocaleDateString()}` : "Select a date to continue"}
                </div>

                <div className="cd-weatherBox">
                  {!pickedDate && <div className="cd-weatherMuted">Pick a date to see the weather.</div>}

                  {pickedDate && weatherLoading && (
                    <div className="cd-weatherMuted">
                      Loading weather...
                      <span className="cd-weatherLoadingBar" />
                    </div>
                  )}

                  {pickedDate && !weatherLoading && weatherErr && <div className="cd-weatherErr">{weatherErr}</div>}

                  {pickedDate && !weatherLoading && weather && (
                    <div className="cd-weatherRow">
                      <div className="cd-weatherLeft">
                        <div className="cd-weatherIcon">{weatherLabel(weather.code).ic}</div>
                        <div>
                          <div className="cd-weatherTitle">{weatherLabel(weather.code).t}</div>
                          <div className="cd-weatherSub">{weather.dateKey}</div>
                        </div>
                      </div>

                      <div className="cd-weatherRight">
                        <div className="cd-weatherTemp">
                          {Math.round(weather.tMax)}° / {Math.round(weather.tMin)}°
                        </div>
                        {typeof weather.rain === "number" && <div className="cd-weatherRain">💧 {weather.rain}%</div>}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  className="cd-nextBtn cd-confirmBtn"
                  type="button"
                  disabled={!pickedDate}
                  onClick={() => {
                    setPickedSlotId(null);
                    setBookStep("slots");
                  }}
                >
                  Next
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 */}
          {bookStep === "slots" && (
            <div className="cd-slotsWrap">
              <div className="cd-slotsCard">
                <div className="cd-slotsTitle">Pick A Time Slot</div>

                {slots.length === 0 ? (
                  <div style={{ padding: 14 }}>No time slots for this court yet.</div>
                ) : (
                  <div className="cd-slotsGrid">
                    {slots.map((sl) => {
                      const active = String(pickedSlotId) === String(sl.slot_id);
                      const disabled = sl.is_active === false;

                      return (
                        <button
                          key={sl.slot_id}
                          type="button"
                          className={`cd-slot ${active ? "isActive" : ""} ${disabled ? "isDisabled" : ""}`}
                          onClick={() => !disabled && setPickedSlotId(String(sl.slot_id))}
                          disabled={disabled}
                        >
                          <span className="cd-slotTime">
                            {fmtTime(sl.time_from)} <span className="cd-slotDash">–</span> {fmtTime(sl.time_to)}
                          </span>

                          <span className="cd-slotRight">
                            {disabled ? <span className="cd-soldOut">Sold out</span> : <span className="cd-slotPrice">{Number(sl.price)}JD</span>}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="cd-slotsActions">
                <div className="cd-summaryBox">
                  <div className="cd-sumLine">
                    <span>Court</span>
                    <strong>{selectedCourt?.name || "-"}</strong>
                  </div>

                  <div className="cd-sumLine">
                    <span>Date</span>
                    <strong>{pickedDate ? pickedDate.toLocaleDateString() : "-"}</strong>
                  </div>

                  <div className="cd-sumLine">
                    <span>Time</span>
                    <strong>
                      {pickedSlot ? `${fmtTime(pickedSlot.time_from)} – ${fmtTime(pickedSlot.time_to)}` : "Choose a slot"}
                    </strong>
                  </div>

                  <div className="cd-sumTotal">
                    <span>Total</span>
                    <strong>{pickedSlot ? `${pickedSlot.price}JD` : "--"}</strong>
                  </div>
                </div>

                <button className="cd-nextBtn cd-confirmBtn" type="button" disabled={!pickedSlotId} onClick={goConfirm}>
                  Confirm
                </button>
              </div>
            </div>
          )}
        </section>

        {/* FACILITIES + LOCATION */}
        <div className="cd-midRow">
          <section className="cd-card">
            <div className="cd-cardTitle">Facilities</div>
            {facilities.length === 0 ? (
              <div style={{ padding: 14 }}>No facilities yet.</div>
            ) : (
              <div className="cd-facGrid">
                {facilities.map((f) => (
                  <div key={f.facility_id} className="cd-facItem">
                    <span className="cd-facIc">{f.icon || "✅"}</span>
                    <span className="cd-facText">{f.label}</span>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="cd-card cd-loc">
            <div className="cd-cardTitle">Location Details</div>
            <div className="cd-locAddressCard">{club.address}</div>
            <div className="cd-mapWrap" aria-label="Google Map" />
            {club.maps_url && (
              <a className="cd-mapsBtn" href={club.maps_url} target="_blank" rel="noreferrer">
                <span className="cd-pinEmoji">📍</span>
                <span>Open in Google Maps</span>
                <span className="cd-openIc2">↗</span>
              </a>
            )}
          </section>
        </div>

        {/* REVIEWS */}
        <section className="cd-card cd-revSec">
          <div className="cd-revHead">
            <div>
              <div className="cd-cardTitle">Reviews</div>
              <div className="cd-revSub">
                <span className="cd-revAvg">{avgRating}</span>
                <span className="cd-revStars">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <img
                      key={i}
                      src={starIcon}
                      className={`cd-revStar ${i < Math.round(avgRating) ? "on" : "off"}`}
                      alt="star"
                    />
                  ))}
                </span>
                <span className="cd-revCount">({filteredReviews.length} reviews)</span>
              </div>
            </div>

            <button className="cd-addReviewBtn" type="button" onClick={() => setOpenReview(true)}>
              + Add Review
            </button>
          </div>

          <div className="cd-revTools">
            <div className="cd-revSearch">
              <span>🔎</span>
              <input value={rq} onChange={(e) => setRq(e.target.value)} placeholder="Search in reviews..." />
            </div>

            <select className="cd-revSelect" value={starsFilter} onChange={(e) => setStarsFilter(e.target.value)}>
              <option value="All">All stars</option>
              <option value="5">5</option>
              <option value="4">4</option>
              <option value="3">3</option>
              <option value="2">2</option>
              <option value="1">1</option>
            </select>

            <select className="cd-revSelect" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="Newest">Newest</option>
              <option value="Oldest">Oldest</option>
              <option value="Highest">Highest</option>
              <option value="Lowest">Lowest</option>
            </select>
          </div>

          {filteredReviews.length === 0 ? (
            <div className="cd-empty">
              <div>
                <h3 className="cd-emptyTitle">No reviews yet</h3>
                <p className="cd-emptySub">Be the first one to leave a review for {club.name}.</p>
              </div>
            </div>
          ) : (
            <div className="cd-revListWrap">
              <div className="cd-revList2">
                {filteredReviews.map((r) => (
                  <article key={r.review_id} className="cd-revCard">
                    <div className="cd-revTopRow">
                      <div className="cd-revUser">
                        <div className="cd-revAvatar">{String(r.user_id || "U").charAt(0)}</div>
                        <div className="cd-revUserMeta">
                          <div className="cd-revName">User #{r.user_id}</div>
                          <div className="cd-revDateInline">
                            {r.created_at ? new Date(r.created_at).toLocaleDateString() : ""}
                          </div>
                        </div>
                      </div>

                 <div className="cd-revRight">
  <div className="cd-revStarsSm">
    {Array.from({ length: 5 }).map((_, i) => (
      <img
        key={i}
        src={starIcon}
        className={`cd-revStarSm ${i < Number(r.stars || 0) ? "on" : ""}`}
        alt="star"
      />
    ))}
  </div>

  {(isAdmin || String(r.user_id) === String(currentUserId)) && (
    <div className="cd-revMiniActions">
      <button
        type="button"
        className="cd-revMiniBtn"
        onClick={() => openEditReview(r)}
      >
        Edit
      </button>

      <button
        type="button"
        className="cd-revMiniBtn danger"
        onClick={() => deleteReview(r.review_id)}
      >
        Delete
      </button>
    </div>
  )}
</div>
                    </div>

                    <div className="cd-revText">{r.comment}</div>

                    {Array.isArray(r.images) && r.images.length > 0 && (
                      <div className="cd-revPhotosGrid">
                        {r.images.slice(0, 6).map((img) => (
                          <button key={img.image_id} type="button" className="cd-revPhotoItem">
                            <img className="cd-revPhotoImg" src={fileUrl(img.image_url)} alt="" />
                          </button>
                        ))}
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* ADD REVIEW MODAL */}
        {openReview && (
          <div className="cd-rModal" onMouseDown={closeReview}>
            <div className="cd-rModalInner" onMouseDown={(e) => e.stopPropagation()}>
              <div className="cd-rHead">
                <div className="cd-rHeadLeft">
                  <div className="cd-rBadge">★</div>
                  <div>
                    <div className="cd-rTitle">Add Review</div>
                    <div className="cd-rSub">Share your experience</div>
                  </div>
                </div>

                <button className="cd-rX" type="button" onClick={closeReview} aria-label="Close">
                  ✕
                </button>
              </div>

              {revErr && <div style={{ padding: "0 18px", color: "#c0392b" }}>{revErr}</div>}

              <div className="cd-rField">
                <label>Rating</label>
                <div className="cd-rStarsCenter">
                  {Array.from({ length: 5 }).map((_, i) => {
                    const n = i + 1;
                    const active = revDraft.stars >= n;
                    return (
                      <button
                        key={n}
                        type="button"
                        className={`cd-rStarBox ${active ? "active" : ""}`}
                        onClick={() => setRevDraft((p) => ({ ...p, stars: n }))}
                      >
                        <img src={starIcon} alt="star" />
                      </button>
                    );
                  })}
                </div>
                <div className="cd-rStarValue">{revDraft.stars}/5</div>
              </div>

              <div className="cd-rField">
                <label>Comment</label>
                <textarea
                  value={revDraft.comment}
                  onChange={(e) => setRevDraft((p) => ({ ...p, comment: e.target.value }))}
                  placeholder="Write your review..."
                />
              </div>

              <div className="cd-rField">
                <label>Photos (optional)</label>

                <div className="cd-rUploadRow">
                  <label className="cd-rUploadBtn">
                    <input type="file" accept="image/*" multiple onChange={onPickPhotos} />
                    <span>+ Upload photos</span>
                    <span className="cd-rUploadHint"> (max 6)</span>
                  </label>

                  <div className="cd-rUploadInfo">{(revDraft.photos || []).length} selected</div>
                </div>

                {(revDraft.photos || []).length > 0 && (
                  <div className="cd-rPreviewGrid">
                    {revDraft.photos.map((url) => (
                      <div key={url} className="cd-rPrevItem2">
                        <img src={fileUrl(url)} alt="" />
                        <button type="button" className="cd-rPrevRemove" onClick={() => removePickedPhoto(url)}>
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="cd-rActions">
                <button className="cd-rCancel" type="button" onClick={closeReview} disabled={revSaving}>
                  Cancel
                </button>

                <button className="cd-nextBtn cd-rSave" type="button" onClick={submitReview} disabled={revSaving}>
                  {revSaving ? "Saving..." : "Save"}
                </button>
              </div>
            </div>
          </div>
        )}
{/* EDIT REVIEW MODAL */}
{editOpen && (
  <div className="cd-rModal" onMouseDown={closeEditReview}>
    <div className="cd-rModalInner" onMouseDown={(e) => e.stopPropagation()}>
      <div className="cd-rHead">
        <div className="cd-rHeadLeft">
          <div className="cd-rBadge">✏️</div>
          <div>
            <div className="cd-rTitle">Edit Review</div>
            <div className="cd-rSub">Update your rating and comment</div>
          </div>
        </div>

        <button className="cd-rX" type="button" onClick={closeEditReview} aria-label="Close">
          ✕
        </button>
      </div>

      {editErr && <div style={{ padding: "0 18px", color: "#c0392b" }}>{editErr}</div>}

      <div className="cd-rField">
        <label>Rating</label>

        <div className="cd-rStarsCenter">
          {Array.from({ length: 5 }).map((_, i) => {
            const n = i + 1;
            const active = editDraft.stars >= n;

            return (
              <button
                key={n}
                type="button"
                className={`cd-rStarBox ${active ? "active" : ""}`}
                onClick={() => setEditDraft((p) => ({ ...p, stars: n }))}
              >
                <img src={starIcon} alt="star" />
              </button>
            );
          })}
        </div>

        <div className="cd-rStarValue">{editDraft.stars}/5</div>
      </div>

      <div className="cd-rField">
        <label>Comment</label>
        <textarea
          value={editDraft.comment}
          onChange={(e) => setEditDraft((p) => ({ ...p, comment: e.target.value }))}
          placeholder="Update your review..."
        />
      </div>

      <div className="cd-rActions">
        <button className="cd-rCancel" type="button" onClick={closeEditReview} disabled={editSaving}>
          Cancel
        </button>

        <button className="cd-nextBtn cd-rSave" type="button" onClick={saveEditReview} disabled={editSaving}>
          {editSaving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  </div>
)}
        {/* GALLERY MODAL */}
        {galleryOpen && galleryList.length > 0 && (
  <div className={`cd-modal ${galleryShow ? "show" : ""}`} onMouseDown={closeGallery}>
    <div className="cd-modalInner" onMouseDown={(e) => e.stopPropagation()}>
      <button className="cd-modalClose" type="button" onClick={closeGallery}>
        ✕
      </button>

      <div className="cd-modalStage">
        <button
          className="cd-galArrow left"
          type="button"
          onClick={() => setActiveImg((i) => (i - 1 + galleryList.length) % galleryList.length)}
        >
          ‹
        </button>

        <img className="cd-modalImg" src={fileUrl(galleryList[activeImg])} alt="club" />

        <button
          className="cd-galArrow right"
          type="button"
          onClick={() => setActiveImg((i) => (i + 1) % galleryList.length)}
        >
          ›
        </button>
      </div>

      <div className="cd-modalThumbs">
        {galleryList.map((img, i) => (
          <button
            key={i}
            type="button"
            className={`cd-thumb ${i === activeImg ? "active" : ""}`}
            onClick={() => setActiveImg(i)}
            style={{ backgroundImage: `url(${fileUrl(img)})` }}
          />
        ))}
      </div>
    </div>
  </div>
)}
      </div>
    </div>
  );
}
