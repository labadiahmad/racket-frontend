import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./courtDetails.css";
import starIcon from "../assets/clubs/star.png";

/* =========================
   CONFIG
========================= */
const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5050";
const API = `${API_BASE}/api`;
const DRAFT_KEY = "reservationDraft";

/* =========================
   HELPERS
========================= */
function safeArr(x) {
  return Array.isArray(x) ? x : [];
}

function fileUrl(p) {
  if (!p) return "";
  if (String(p).startsWith("http")) return p;
  return `${API_BASE}${p}`;
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

function parseMaybeArray(val) {
  if (!val) return [];
  if (Array.isArray(val)) return val;

  if (typeof val === "string") {
    const s = val.trim();
    if (!s) return [];
    try {
      const j = JSON.parse(s);
      return Array.isArray(j) ? j : [];
    } catch {
      return s
        .split(",")
        .map((x) => x.trim())
        .filter(Boolean);
    }
  }

  return [];
}

/* ----- localStorage draft ----- */
function getDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setDraft(nextDraft) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(nextDraft));
  return nextDraft;
}

/* ----- auth + api ----- */
function getSavedUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
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
  const res = await fetch(`${API}${path}`, { headers: authHeaders() });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || data.error || "Request failed");
  return data;
}

/* =========================
   COMPONENT
========================= */
export default function CourtDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clubId, courtId } = useParams();

  /* ---------- DB DATA ---------- */
  const [club, setClub] = useState(null);
  const [courts, setCourts] = useState([]);
  const [court, setCourt] = useState(null);

  const [courtImages, setCourtImages] = useState([]);
  const [slots, setSlots] = useState([]);

  /* ---------- UI ---------- */
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  /* ---------- Booking ---------- */
  const [bookStep, setBookStep] = useState("calendar"); // "calendar" | "slots"
  const [pickedDate, setPickedDate] = useState(null);
  const [pickedSlotId, setPickedSlotId] = useState(null);
  const [bookedSlotIds, setBookedSlotIds] = useState([]);

  /* ---------- Calendar ---------- */
  const [calMonthOffset, setCalMonthOffset] = useState(0);

  /* ---------- Gallery ---------- */
  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryShow, setGalleryShow] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  /* ---------- Weather ---------- */
  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherErr, setWeatherErr] = useState("");

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

  function featureEmoji(label) {
    const k = String(label || "").toLowerCase();
    if (k.includes("glass")) return "🪟";
    if (k.includes("turf")) return "🌿";
    if (k.includes("outdoor")) return "🌤️";
    if (k.includes("indoor")) return "🏟️";
    if (k.includes("ac")) return "❄️";
    if (k.includes("seating")) return "🪑";
    if (k.includes("quiet")) return "🤫";
    return "✅";
  }

  /* =========================
     1) LOAD CLUB + COURTS + SELECT COURT
  ========================= */
  useEffect(() => {
    let alive = true;

    async function loadAll() {
      setLoading(true);
      setErr("");

      try {
        const [clubRes, courtsRes] = await Promise.all([
          apiGet(`/clubs/${clubId}`),
          apiGet(`/courts?club_id=${clubId}`).catch(() => []),
        ]);

        const list = safeArr(courtsRes);
        const found =
          list.find((c) => String(c.court_id) === String(courtId)) ||
          list[0] ||
          null;

        if (!alive) return;

        setClub(clubRes);
        setCourts(list);
        setCourt(found);
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
  }, [clubId, courtId]);

  /* =========================
     2) LOAD COURT IMAGES + SLOTS
  ========================= */
  useEffect(() => {
    let alive = true;

    async function loadExtras() {
      if (!court?.court_id) {
        setCourtImages([]);
        setSlots([]);
        return;
      }

      try {
        const [imgs, sl] = await Promise.all([
          apiGet(`/court-images?court_id=${court.court_id}`).catch(() => []),
          apiGet(`/slots?court_id=${court.court_id}`).catch(() => []),
        ]);

        if (!alive) return;
        setCourtImages(safeArr(imgs));
        setSlots(safeArr(sl));
      } catch {
        if (!alive) return;
        setCourtImages([]);
        setSlots([]);
      }
    }

    loadExtras();
    return () => {
      alive = false;
    };
  }, [court?.court_id]);

  /* =========================
     3) RESTORE DRAFT (localStorage)
     - only if draft matches this club+court
     - also support return from confirm page: state.goToStep === "slots"
  ========================= */
  useEffect(() => {
    if (!club?.club_id || !court?.court_id) return;

    const d = getDraft();
    const same =
      String(d?.clubId) === String(club.club_id) &&
      String(d?.courtId) === String(court.court_id);

    if (!same) {
      setBookStep("calendar");
      setPickedDate(null);
      setPickedSlotId(null);
      return;
    }

    setPickedDate(d?.pickedDateISO ? new Date(d.pickedDateISO) : null);
    setPickedSlotId(d?.pickedSlotId ? String(d.pickedSlotId) : null);

    if (location.state?.goToStep === "slots") setBookStep("slots");
    else if (d?.pickedSlotId) setBookStep("slots");
    else setBookStep("calendar");
  }, [club?.club_id, court?.court_id, location.state]);

  /* Clear route state once (to avoid infinite re-trigger) */
  useEffect(() => {
    if (location.state?.goToStep) {
      navigate(location.pathname, { replace: true, state: null });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =========================
     4) LOAD BOOKED SLOTS when date changes
  ========================= */
  useEffect(() => {
    async function loadBooked() {
      if (!pickedDate || !court?.court_id) {
        setBookedSlotIds([]);
        return;
      }

      try {
        const d = String(pickedDate.toISOString()).slice(0, 10);
        const res = await apiGet(
          `/reservations/booked-slots?court_id=${court.court_id}&date_iso=${d}`
        );

        const arr =
          Array.isArray(res) ? res :
          Array.isArray(res.booked) ? res.booked :
          Array.isArray(res.bookedSlots) ? res.bookedSlots :
          [];

        const ids = arr
          .map((x) => Number(x?.slot_id ?? x))
          .filter((n) => Number.isFinite(n));

        setBookedSlotIds(ids);
      } catch {
        setBookedSlotIds([]);
      }
    }

    loadBooked();
  }, [pickedDate, court?.court_id]);

  /* =========================
     5) CALENDAR DATA
  ========================= */
  const today = startOfDay(new Date());
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 15);

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

  function sameDay(a, b) {
    return (
      a &&
      b &&
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  function isSelectableDate(dt) {
    if (!dt) return false;
    const x = startOfDay(dt);
    return x >= today && x <= maxDate;
  }

  /* if month changes and current pickedDate is no longer valid */
  useEffect(() => {
    if (pickedDate && !isSelectableDate(pickedDate)) {
      setPickedDate(null);
      setPickedSlotId(null);
      setWeather(null);
      setWeatherErr("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calMonthOffset]);

  /* =========================
     6) GALLERY
  ========================= */
  const galleryList = safeArr(courtImages)
    .map((x) => x.image_url || x.url || x.path || "")
    .filter(Boolean);

  const heroImg = galleryList[0] || "";

  function openGallery(index = 0) {
    setActiveImg(index);
    setGalleryOpen(true);
  }

  function closeGallery() {
    setGalleryShow(false);
    setTimeout(() => setGalleryOpen(false), 180);
  }

  useEffect(() => {
    if (!galleryOpen) return;

    requestAnimationFrame(() => setGalleryShow(true));

    const onKey = (e) => {
      if (e.key === "Escape") closeGallery();
      if (e.key === "ArrowRight") {
        setActiveImg((i) => (i + 1) % (galleryList.length || 1));
      }
      if (e.key === "ArrowLeft") {
        setActiveImg((i) => (i - 1 + (galleryList.length || 1)) % (galleryList.length || 1));
      }
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [galleryOpen, galleryList.length]);

  /* =========================
     7) WEATHER (open-meteo)
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
     8) ACTIONS
  ========================= */
  function goBack() {
    navigate(-1);
  }

  function goToClub() {
    if (!club?.club_id) return;
    navigate(`/clubs/${club.club_id}`);
  }

  function switchCourt(nextCourtId) {
    if (!club?.club_id) return;
    navigate(`/clubs/${club.club_id}/courts/${nextCourtId}`);
  }

  function goConfirm() {
    if (!pickedDate || !pickedSlotId || !club || !court) return;

    const pickedSlot = slots.find((s) => String(s.slot_id) === String(pickedSlotId));
    if (!pickedSlot) return;

    const payload = {
      clubId: String(club.club_id),
      clubName: club.name,
      clubLogo: club.logo_url || "",
      courtId: String(court.court_id),
      courtName: court.name || `Court ${court.court_id}`,
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

    setDraft(payload);
    navigate("/confirm-reservation", { state: payload });
  }

  /* =========================
     9) UI GUARDS
  ========================= */
  if (loading) return <div style={{ padding: 120 }}>Loading...</div>;
  if (err) return <div style={{ padding: 120 }}>{err}</div>;
  if (!club) return <div style={{ padding: 120 }}>Club not found</div>;
  if (!court) return <div style={{ padding: 120 }}>Court not found</div>;

  /* =========================
     10) UI READY DATA
  ========================= */
  const clubRating = Number(club.avg_rating || club.rating || 0);
  const clubReviewsCount = Number(club.reviews_count || club.reviews || 0);

  const courtType = court.court_type || court.type || "Court";
  const courtAbout = court.about || court.description || "";
  const courtSurface = court.surface || "-";
  const courtLighting = court.lighting || "-";
  const courtPlayers = court.max_players || court.maxPlayers || 4;

  const courtFeatures = parseMaybeArray(court.features);
  const courtRules = parseMaybeArray(court.rules);

 const selectedSlot = pickedSlotId
  ? slots.find((s) => String(s.slot_id) === String(pickedSlotId))
  : null;

const selectedTimeText = selectedSlot
  ? `${fmtTime(selectedSlot.time_from)} – ${fmtTime(selectedSlot.time_to)}`
  : "-";

const selectedPriceText = selectedSlot
  ? `${Number(selectedSlot.price)}JD`
  : "-";
  return (
    <div className="ct-page">
      <div className="ct-shell">
        {/* TOP BAR */}
        <div className="ct-topBar">
          <button className="ct-topBackBtn" type="button" onClick={goBack}>
            <span className="ct-topBackIc">←</span>
            <span>Back</span>
          </button>

          <div className="ct-breadcrumb">
            <button className="ct-link ct-clubCrumb" type="button" onClick={goToClub}>
              {club.logo_url ? (
                <img
                  className="ct-clubLogo"
                  src={fileUrl(club.logo_url)}
                  alt={`${club.name} logo`}
                />
              ) : (
                <div className="ct-clubLogo" />
              )}
              <span>{club.name}</span>
            </button>

            <span className="ct-sep">•</span>
            <span className="ct-current">{court.name || `Court ${court.court_id}`}</span>
          </div>

          <div className="ct-rating">
            <span className="ct-stars">
              {Array.from({ length: Math.round(clubRating) }).map((_, i) => (
                <img key={i} src={starIcon} className="ct-star" alt="star" />
              ))}
            </span>
            <span className="ct-rev">{clubReviewsCount}</span>
          </div>
        </div>

        {/* TOP GRID */}
        <div className="ct-topGrid">
          <div className="ct-infoStack">
            {/* OVERVIEW */}
            <section className="ct-card ct-overviewCard">
              <div className="ct-overHead">
                <div>
                  <div className="ct-title">{court.name || `Court ${court.court_id}`}</div>
                  <div className="ct-sub">
                    {courtType} • <span className="ct-subLink">{club.name}</span>
                  </div>
                </div>
              </div>

              <p className="ct-text">{courtAbout || "No description yet."}</p>
            </section>

            {/* SPECS */}
            <section className="ct-card">
              <div className="ct-cardTitle">Court Specs</div>

              <div className="ct-specGrid">
                <div className="ct-specCard">
                  <div className="ct-specLabel">Surface</div>
                  <div className="ct-specVal">{courtSurface}</div>
                </div>

                <div className="ct-specCard">
                  <div className="ct-specLabel">Lighting</div>
                  <div className="ct-specVal">{courtLighting}</div>
                </div>

                <div className="ct-specCard">
                  <div className="ct-specLabel">Max Players</div>
                  <div className="ct-specVal">{courtPlayers}</div>
                </div>
              </div>
            </section>

            {/* FEATURES */}
            <section className="ct-card">
              <div className="ct-cardTitle">Features</div>

              {courtFeatures.length === 0 ? (
                <div style={{ padding: 14 }}>No features yet.</div>
              ) : (
                <div className="ct-chipGrid">
                  {courtFeatures.map((x, i) => (
                    <div key={i} className="ct-chip">
                      <span className="ct-chipEmoji">{featureEmoji(x)}</span>
                      <span>{x}</span>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* PHOTO */}
          <div
            className="ct-galleryOne"
            style={heroImg ? { backgroundImage: `url(${fileUrl(heroImg)})` } : {}}
            onClick={() => galleryList.length > 0 && openGallery(0)}
            role="button"
            tabIndex={0}
          >
            <div className="ct-galleryOverlay">
              {galleryList.length > 0 && (
                <button
                  className="ct-viewAllBtn"
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    openGallery(0);
                  }}
                >
                  View Gallery
                </button>
              )}
            </div>
          </div>
        </div>

        {/* OTHER COURTS */}
        <section className="ct-card">
          <div className="ct-cardTitle">Other courts in {club.name}</div>
          <div className="ct-muted">Quick switch without going back</div>

          <div className="ct-otherList">
            {courts.map((c) => {
              const active = String(c.court_id) === String(court.court_id);
              const typeText = String(c.court_type || c.type || "").toLowerCase();
              const isIndoor = typeText.includes("indoor");

              return (
                <div
                  key={c.court_id}
                  className={`ct-otherRow ${active ? "isActive" : ""}`}
                  onClick={() => !active && switchCourt(c.court_id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="ct-otherLeft">
                    <div
                      className="ct-otherThumb"
                      style={{ backgroundImage: `url(${fileUrl(c.cover_url)})` }}
                      aria-hidden="true"
                    />

                    <div className="ct-otherInfo">
                      <div className="ct-otherTopLine">
                        <div className="ct-otherName">{c.name || `Court ${c.court_id}`}</div>
                        <span className={`ct-typePill ${isIndoor ? "isIndoor" : "isOutdoor"}`}>
                          {isIndoor ? "Indoor" : "Outdoor"}
                        </span>
                      </div>

                      <div className="ct-otherSub">{c.court_type || c.type || "Court"}</div>
                    </div>
                  </div>

                  {active ? (
                    <span className="ct-currentPill">Current</span>
                  ) : (
                    <span className="ct-goBtn">↗</span>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* LOCATION */}
        <section className="ct-card ct-location">
          <div className="ct-locTop">
            <div>
              <div className="ct-cardTitle">Location</div>
              <div className="ct-muted">
                Court is inside <strong>{club.name}</strong>
              </div>
            </div>

            {club.maps_url && (
              <a className="ct-mapsBtn" href={club.maps_url} target="_blank" rel="noreferrer">
                <span className="ct-pin">📍</span>
                <span>Open Maps</span>
                <span className="ct-openIc">↗</span>
              </a>
            )}
          </div>

          <div className="ct-locCard">
            <div className="ct-locIcon">🧭</div>

            <div className="ct-locText">
              <div className="ct-locMain">{club.name}</div>
              <div className="ct-locSub">{club.address || "No address yet."}</div>
            </div>
          </div>
        </section>

        {/* RESERVE */}
        <section className="ct-reserveFull">
          <div className="ct-reserveHead">
            <div>
              <div className="ct-cardTitle">Reserve this court</div>
              <div className="ct-muted">
                {bookStep === "calendar"
                  ? "Step 1 of 2 • Pick a date"
                  : "Step 2 of 2 • Pick a time slot"}
              </div>
            </div>

            {bookStep === "slots" && (
              <button
                className="ct-backBtn"
                type="button"
                onClick={() => {
                  setPickedSlotId(null);
                  setBookStep("calendar");
                }}
              >
                ← Back
              </button>
            )}
          </div>

          {/* CALENDAR */}
          {bookStep === "calendar" && (
            <div className="cd-calWrap">
              <div className="cd-calCard">
                <div className="cd-calTop">
                  <button type="button" className="cd-calNav" onClick={() => setCalMonthOffset((v) => v - 1)}>
                    <span className="cd-calArrow">‹</span>
                  </button>

                  <div className="cd-calMonth">
                    {monthName} <span className="cd-calYear">{year}</span>
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
                  {cells.map((dt, idx) => (
                    <button
                      key={idx}
                      type="button"
                      className={`cd-day ${dt ? "" : "isEmpty"} ${sameDay(dt, pickedDate) ? "isSelected" : ""}`}
                      disabled={!dt || !isSelectableDate(dt)}
                      onClick={() => {
                        setPickedDate(dt);
                        setPickedSlotId(null);
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
                  className="ct-primaryBtn"
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

          {/* SLOTS */}
          {bookStep === "slots" && (
            <div className="ct-slotsWrap">
              <div className="ct-slotsCard">
                <div className="ct-slotsTitle">Pick a time slot</div>

                {slots.length === 0 ? (
                  <div style={{ padding: 14 }}>No slots yet for this court.</div>
                ) : (
                  <div className="ct-slotsGrid">
                    {slots.map((sl) => {
                      const active = String(pickedSlotId) === String(sl.slot_id);
                      const disabled =
                        sl.is_active === false || bookedSlotIds.includes(Number(sl.slot_id));

                      return (
                        <button
                          key={sl.slot_id}
                          type="button"
                          className={`ct-slot ${active ? "isActive" : ""} ${disabled ? "isDisabled" : ""}`}
                          onClick={() => !disabled && setPickedSlotId(String(sl.slot_id))}
                          disabled={disabled}
                        >
                          <span className="ct-slotTime">
                            {fmtTime(sl.time_from)} <span className="ct-slotDash">–</span> {fmtTime(sl.time_to)}
                          </span>

                          <span className="ct-slotRight">
                            {disabled ? (
                              <span className="ct-soldOut">Sold out</span>
                            ) : (
                              <span className="ct-slotPrice">{Number(sl.price)}JD</span>
                            )}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="ct-slotsActions">
                <div className="ct-summaryBox">
                  <div className="ct-sumLine">
                    <span>Club</span>
                    <strong>{club.name}</strong>
                  </div>

                  <div className="ct-sumLine">
                    <span>Court</span>
                    <strong>{court.name || `Court ${court.court_id}`}</strong>
                  </div>

                  <div className="ct-sumLine">
                    <span>Date</span>
                    <strong>{pickedDate ? pickedDate.toLocaleDateString() : "-"}</strong>
                  </div>

                  <div className="ct-sumLine">
  <span>Time</span>
  <strong>{pickedSlotId ? selectedTimeText : "Choose a slot"}</strong>
</div>

<div className="ct-sumLine">
  <span>Total</span>
  <strong>{pickedSlotId ? selectedPriceText : "-"}</strong>
</div>
                </div>

                <button className="ct-primaryBtn" type="button" disabled={!pickedSlotId} onClick={goConfirm}>
                  Confirm
                </button>
              </div>
            </div>
          )}
        </section>

        {/* COURT RULES */}
        <section className="ct-card ct-rules">
          <div className="ct-rulesHead">
            <div>
              <div className="ct-rulesTitle">Court Rules</div>
              <div className="ct-muted">Quick notes to avoid confusion.</div>
            </div>

            <div className="ct-rulesBadge">Important</div>
          </div>

          {courtRules.length === 0 ? (
            <div style={{ padding: 14 }}>No rules yet.</div>
          ) : (
            <div className="ct-rulesGrid">
              {courtRules.map((r, i) => (
                <div key={i} className="ct-ruleItem">
                  <span className="ct-ruleIc">📌</span>
                  <span className="ct-ruleText">{r}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* MODAL GALLERY */}
        {galleryOpen && galleryList.length > 0 && (
          <div className={`ct-modal ${galleryShow ? "show" : ""}`} onMouseDown={closeGallery}>
            <div className="ct-modalInner" onMouseDown={(e) => e.stopPropagation()}>
              <button className="ct-modalClose" type="button" onClick={closeGallery}>
                ✕
              </button>

              <div className="ct-modalStage">
                <button
                  className="ct-galArrow left"
                  type="button"
                  onClick={() => setActiveImg((i) => (i - 1 + galleryList.length) % galleryList.length)}
                >
                  ‹
                </button>

                <img className="ct-modalImg" src={fileUrl(galleryList[activeImg])} alt="court" />

                <button
                  className="ct-galArrow right"
                  type="button"
                  onClick={() => setActiveImg((i) => (i + 1) % galleryList.length)}
                >
                  ›
                </button>
              </div>

              <div className="ct-modalThumbs">
                {galleryList.map((img, i) => (
                  <button
                    key={`${img}-${i}`}
                    type="button"
                    className={`ct-thumb ${i === activeImg ? "active" : ""}`}
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