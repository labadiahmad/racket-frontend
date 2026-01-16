import { useEffect, useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "./courtDetails.css";

import tropicoCover from "../assets/courts/redCourt.jpeg";
import projectCover from "../assets/courts/SCR-20251203-uebn.jpeg";
import wepadelCover from "../assets/courts/wepadel-court-cover.jpg";
import wepadelLogo from "../assets/clubs/2.png";
import club364Logo from "../assets/clubs/364.png";
import tropicoLogo from "../assets/clubs/tropico.png";
import projectPadelLogo from "../assets/clubs/project-padel.png";
import starIcon from "../assets/clubs/star.png";

export default function CourtDetails({ reservationDraft, setReservationDraft }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { clubId, courtId } = useParams();

  const CLUBS = [
    {
      id: "1",
      name: "Tropico Padel Club",
      logo: tropicoLogo,
      rating: 4.9,
      lat: 31.9539,
      lon: 35.9106,
      reviews: 120,
      address: "Tropico Padel Club Al-Madina Street, District 5, Amman, Jordan",
      mapsUrl: "https://www.google.com/maps",
      gallery: [tropicoCover, projectCover, wepadelCover, tropicoCover],
      facilities: ["Parking", "Café", "Lockers", "Bathrooms", "Seating area", "Shop"],
      clubRules: [
        "Free cancellation up to 24 hours before the slot.",
        "Late arrivals do not extend the booking time.",
        "No-shows may be charged the full amount.",
        "Refunds (if any) are processed within 3–5 working days.",
      ],
      courts: [
        {
          id: "court1",
          name: "Court 1",
          type: "Outdoor Premium Court",
          about:
            "Outdoor premium court with pro turf and glass walls. Best for evening games with strong lighting and comfortable seating area near the court.",
          priceFrom: 30,
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
          lat: 31.9539,
          lon: 35.9106,
          about: "Indoor court with AC and premium turf. Great for all-day play in any weather.",
          priceFrom: 35,
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
      ],
    },

    {
      id: "2",
      name: "Project Padel",
      logo: projectPadelLogo,
      rating: 4.7,
      reviews: 88,
        lat: 31.9539,
      lon: 35.9106,
      address: "Project Padel, KHBP, Amman, Jordan",
      mapsUrl: "https://www.google.com/maps",
      gallery: [projectCover, tropicoCover, wepadelCover],
      facilities: ["Parking", "Reception", "Bathrooms", "Seating area"],
      clubRules: ["Cancellations must be at least 24 hours before the slot."],
      courts: [
        {
          id: "court1",
          name: "Court 1",
          type: "Indoor Court",
          about: "Indoor court with clean lighting and comfortable playing space.",
          priceFrom: 25,
          surface: "Premium Turf",
          lighting: "Indoor Lighting",
          maxPlayers: 4,
          features: ["Indoor", "Premium turf", "Reception nearby"],
          gallery: [projectCover, tropicoCover, wepadelCover],
          rules: ["Max 4 players per booking.", "Finish on time and leave the court clean."],
        },
        {
          id: "court2",
          name: "Court 2",
          type: "Indoor Training Court",
          about: "Training friendly indoor court with premium turf.",
          priceFrom: 25,
          surface: "Premium Turf",
          lighting: "Indoor Lighting",
          maxPlayers: 4,
          features: ["Indoor", "Training friendly", "Premium turf"],
          gallery: [projectCover, tropicoCover, wepadelCover],
          rules: ["Max 4 players per booking.", "Finish on time and leave the court clean."],
        },
      ],
    },

    {
      id: "3",
      name: "WePadel",
      logo: wepadelLogo,
      rating: 4.5,
      reviews: 61,
        lat: 31.9539,
      lon: 35.9106,
      address: "WePadel, Khalda, Amman, Jordan",
      mapsUrl: "https://www.google.com/maps",
      gallery: [wepadelCover, tropicoCover, projectCover],
      facilities: ["Parking", "Bathrooms", "Seating area"],
      clubRules: ["Cancellations must be at least 24 hours before the slot."],
      courts: [
        {
          id: "court1",
          name: "Court 1",
          type: "Outdoor Court",
          about: "Outdoor court with fresh air and nice lighting for night games.",
          priceFrom: 20,
          surface: "Pro Turf",
          lighting: "LED Night Lighting",
          maxPlayers: 4,
          features: ["Outdoor", "Pro turf", "Seating area"],
          gallery: [wepadelCover, projectCover, tropicoCover],
          rules: ["Arrive on time.", "Max 4 players per booking."],
        },
      ],
    },

    {
      id: "4",
      name: "364 Sports Club",
      logo: club364Logo,
      rating: 4.6,
      reviews: 130,
        lat: 31.9539,
      lon: 35.9106,
      address: "364 Sports Club, Madaba, Jordan",
      mapsUrl: "https://www.google.com/maps",
      gallery: [tropicoCover, projectCover, wepadelCover],
      facilities: ["Parking", "Bathrooms", "Seating area", "Tournaments"],
      clubRules: ["Cancellations must be at least 24 hours before the slot."],
      courts: [
        {
          id: "court1",
          name: "Court 1",
          type: "Outdoor Court",
          about: "Outdoor court made for tournaments with good lighting and space.",
          priceFrom: 20,
          surface: "Pro Turf",
          lighting: "LED Night Lighting",
          maxPlayers: 4,
          features: ["Outdoor", "Tournament ready", "Pro turf", "Seating area"],
          gallery: [tropicoCover, projectCover, wepadelCover],
          rules: ["Arrive on time.", "Max 4 players per booking.", "Finish on time."],
        },
      ],
    },
  ];

  const club = CLUBS.find((c) => c.id === String(clubId));
  if (!club) return <div style={{ padding: 120 }}>Club not found</div>;

  const court = club.courts.find((c) => c.id === String(courtId)) || club.courts[0];
  if (!court) return <div style={{ padding: 120 }}>Court not found</div>;

  const timeSlots = [
    { id: "s1", from: "08:00", to: "09:00", price: court.priceFrom, soldOut: false },
    { id: "s2", from: "09:00", to: "10:00", price: court.priceFrom + 20, soldOut: true },
    { id: "s3", from: "21:00", to: "22:00", price: court.priceFrom + 20, soldOut: false },
    { id: "s4", from: "22:00", to: "23:00", price: court.priceFrom + 20, soldOut: true },
    { id: "s5", from: "23:00", to: "00:00", price: court.priceFrom + 20, soldOut: false },
  ];

  const [bookStep, setBookStep] = useState("calendar"); 
  const [pickedDate, setPickedDate] = useState(null);
  const [pickedSlot, setPickedSlot] = useState(null);

  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

  const [calMonthOffset, setCalMonthOffset] = useState(0);

  const base = new Date();
  const first = new Date(base.getFullYear(), base.getMonth() + calMonthOffset, 1);
  const year = first.getFullYear();
  const month = first.getMonth();
  const monthName = first.toLocaleString("en-US", { month: "long" });

  const today = startOfDay(new Date());
  const maxDate = new Date(today);
  maxDate.setDate(maxDate.getDate() + 15); 

  const prevMonthEnd = new Date(year, month, 0);

  const nextMonthStart = new Date(year, month + 1, 1);

  const canGoPrev = prevMonthEnd >= today;
  const canGoNext = nextMonthStart <= maxDate;

  const isSelectableDate = (dt) => {
    if (!dt) return false;
    const x = startOfDay(dt);
    return x >= today && x <= maxDate;
  };

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);

  const sameDay = (a, b) => {
    if (!a || !b) return false;
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  };

  useEffect(() => {
    const same = reservationDraft?.clubId === club.id && reservationDraft?.courtId === court.id;

    if (same) {
      setPickedDate(reservationDraft?.pickedDateISO ? new Date(reservationDraft.pickedDateISO) : null);
      setPickedSlot(reservationDraft?.pickedSlot || null);

      if (location.state?.goToStep === "slots") setBookStep("slots");
      else if (reservationDraft?.pickedSlot) setBookStep("slots");
      else setBookStep("calendar");
    } else {
      setBookStep("calendar");
      setPickedDate(null);
      setPickedSlot(null);
    }
  }, [club.id, court.id]);

  useEffect(() => {
    if (location.state?.goToStep) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, []);

  useEffect(() => {
    if (pickedDate && !isSelectableDate(pickedDate)) {
      setPickedDate(null);
      setWeather(null);
      setWeatherErr("");
    }
  }, [calMonthOffset]);

  const featureEmoji = (label) => {
    const k = (label || "").toLowerCase();
    if (k.includes("glass")) return "🪟";
    if (k.includes("turf")) return "🌿";
    if (k.includes("outdoor")) return "🌤️";
    if (k.includes("indoor")) return "🏟️";
    if (k.includes("ac")) return "❄️";
    if (k.includes("seating")) return "🪑";
    if (k.includes("quiet")) return "🤫";
    return "✅";
  };

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryShow, setGalleryShow] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

  const openGallery = (index) => {
    setActiveImg(index || 0);
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
      if (e.key === "ArrowRight") setActiveImg((i) => (i + 1) % court.gallery.length);
      if (e.key === "ArrowLeft") setActiveImg((i) => (i - 1 + court.gallery.length) % court.gallery.length);
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [galleryOpen, court.gallery.length]);

  const goBack = () => navigate(-1);
  const goToClub = () => navigate(`/clubs/${club.id}`);
  const switchCourt = (id) => navigate(`/clubs/${club.id}/courts/${id}`);

  const goConfirm = () => {
    if (!pickedDate || !pickedSlot) return;

    const payload = {
      clubId: club.id,
      clubName: club.name,
      clubLogo: club.logo,
      courtId: court.id,
      courtName: court.name,
      courtImage: (court.gallery && court.gallery[0]) || (club.gallery && club.gallery[0]) || "",
      pickedDateISO: pickedDate.toISOString(),
      pickedSlotId: pickedSlot.id,
      pickedSlot,
      returnTo: location.pathname,
    };

    if (setReservationDraft) setReservationDraft((prev) => ({ ...prev, ...payload }));

    navigate("/confirm-reservation", { state: payload });
  };

  const [weather, setWeather] = useState(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherErr, setWeatherErr] = useState("");

  const toISODate = (dt) => {
    if (!dt) return "";
    const y = dt.getFullYear();
    const m = String(dt.getMonth() + 1).padStart(2, "0");
    const d = String(dt.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  const weatherLabel = (code) => {
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
  };

  useEffect(() => {
    if (!pickedDate) {
      setWeather(null);
      setWeatherErr("");
      return;
    }

    if (!club.lat || !club.lon) {
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
  }, [pickedDate, club.lat, club.lon]);
const calInfo = { monthName, year, cells };
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
              <img className="ct-clubLogo" src={club.logo} alt={`${club.name} logo`} />
              <span>{club.name}</span>
            </button>

            <span className="ct-sep">•</span>
            <span className="ct-current">{court.name}</span>
          </div>

          <div className="ct-rating">
            <span className="ct-stars">
              {Array.from({ length: Math.round(club.rating) }).map((_, i) => (
                <img key={i} src={starIcon} className="ct-star" alt="star" />
              ))}
            </span>
            <span className="ct-rev">{club.reviews}</span>
          </div>
        </div>

        {/* TOP GRID */}
        <div className="ct-topGrid">
          <div className="ct-infoStack">
            {/* OVERVIEW */}
            <section className="ct-card ct-overviewCard">
              <div className="ct-overHead">
                <div>
                  <div className="ct-title">{court.name}</div>
                  <div className="ct-sub">
                    {court.type} • <span className="ct-subLink">{club.name}</span>
                  </div>
                </div>

                <div className="ct-priceBox">
                  <div className="ct-priceTop">💰 From</div>
                  <div className="ct-priceVal">{court.priceFrom} JD</div>
                </div>
              </div>

              <p className="ct-text">{court.about}</p>
            </section>

            {/* SPECS */}
            <section className="ct-card">
              <div className="ct-cardTitle">Court Specs</div>

              <div className="ct-specGrid">
                <div className="ct-specCard">
                  <div className="ct-specLabel">Surface</div>
                  <div className="ct-specVal">{court.surface}</div>
                </div>

                <div className="ct-specCard">
                  <div className="ct-specLabel">Lighting</div>
                  <div className="ct-specVal">{court.lighting}</div>
                </div>

                <div className="ct-specCard">
                  <div className="ct-specLabel">Max Players</div>
                  <div className="ct-specVal">{court.maxPlayers}</div>
                </div>
              </div>
            </section>

            {/* FEATURES */}
            <section className="ct-card">
              <div className="ct-cardTitle">Features</div>

              <div className="ct-chipGrid">
                {court.features.map((x, i) => (
                  <div key={i} className="ct-chip">
                    <span className="ct-chipEmoji">{featureEmoji(x)}</span>
                    <span>{x}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* PHOTO */}
          <div
            className="ct-galleryOne"
            style={{ backgroundImage: `url(${court.gallery[0]})` }}
            onClick={() => openGallery(0)}
            role="button"
            tabIndex={0}
          >
            <div className="ct-galleryOverlay">
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
            </div>
          </div>
        </div>

        {/* OTHER COURTS */}
        <section className="ct-card">
          <div className="ct-cardTitle">Other courts in {club.name}</div>
          <div className="ct-muted">Quick switch without going back</div>

          <div className="ct-otherList">
            {club.courts.map((c) => {
              const active = c.id === court.id;
              const isIndoor = c.type.toLowerCase().includes("indoor");

              return (
                <div
                  key={c.id}
                  className={`ct-otherRow ${active ? "isActive" : ""}`}
                  onClick={() => !active && switchCourt(c.id)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="ct-otherLeft">
                    <div
                      className="ct-otherThumb"
                      style={{
                        backgroundImage: `url(${(c.gallery && c.gallery[0]) || (club.gallery && club.gallery[0])})`,
                      }}
                      aria-hidden="true"
                    />

                    <div className="ct-otherInfo">
                      <div className="ct-otherTopLine">
                        <div className="ct-otherName">{c.name}</div>
                        <span className={`ct-typePill ${isIndoor ? "isIndoor" : "isOutdoor"}`}>
                          {isIndoor ? "Indoor" : "Outdoor"}
                        </span>
                      </div>

                      <div className="ct-otherSub">
                        {c.type} • <strong>from {c.priceFrom} JD</strong>
                      </div>
                    </div>
                  </div>

                  {active ? <span className="ct-currentPill">Current</span> : <span className="ct-goBtn">↗</span>}
                </div>
              );
            })}
          </div>
        </section>

        {/* MINI CLUB SNAPSHOT */}
        <section className="ct-card ct-miniClub">
          <div className="ct-miniTop">
            <div className="ct-miniBrand">
              <div className="ct-miniLogoWrap">
                <img className="ct-miniLogo" src={club.logo} alt={`${club.name} logo`} />
              </div>

              <div className="ct-miniBrandText">
                <div className="ct-miniTitle">About {club.name}</div>

                <div className="ct-miniRating">
                  <span className="ct-miniStars">
                    {Array.from({ length: Math.round(club.rating) }).map((_, i) => (
                      <img key={i} src={starIcon} className="ct-star" alt="star" />
                    ))}
                  </span>
                  <span className="ct-miniRateNum">{club.rating}</span>
                  <span className="ct-miniRev">({club.reviews} reviews)</span>
                </div>
              </div>
            </div>

            <button className="ct-miniBtn" type="button" onClick={goToClub}>
              View Club <span className="ct-miniBtnIc">→</span>
            </button>
          </div>

          <div className="ct-miniGrid">
            <div className="ct-miniStat">
              <div className="ct-miniLabel">Courts</div>
              <div className="ct-miniValue">{club.courts.length}</div>
            </div>

            <div className="ct-miniStat">
              <div className="ct-miniLabel">Location</div>
              <div className="ct-miniValue">Amman</div>
            </div>

            <div className="ct-miniStat">
              <div className="ct-miniLabel">Facilities</div>
              <div className="ct-miniValue">{club.facilities.length}+</div>
            </div>
          </div>

          <div className="ct-miniChips">
            {club.facilities.slice(0, 6).map((f, i) => (
              <span key={i} className="ct-miniChip">
                ✅ {f}
              </span>
            ))}
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

            <a className="ct-mapsBtn" href={club.mapsUrl} target="_blank" rel="noreferrer">
              <span className="ct-pin">📍</span>
              <span>Open Maps</span>
              <span className="ct-openIc">↗</span>
            </a>
          </div>

          <div className="ct-locCard">
            <div className="ct-locIcon">🧭</div>

            <div className="ct-locText">
              <div className="ct-locMain">{club.name}</div>
              <div className="ct-locSub">{club.address}</div>
            </div>
          </div>
        </section>

        {/* RESERVE */}
        <section className="ct-reserveFull">
          <div className="ct-reserveHead">
            <div>
              <div className="ct-cardTitle">Reserve this court</div>
              <div className="ct-muted">
                {bookStep === "calendar" ? "Step 1 of 2 • Pick a date" : "Step 2 of 2 • Pick a time slot"}
              </div>
            </div>

            {bookStep === "slots" && (
              <button
                className="ct-backBtn"
                type="button"
                onClick={() => {
                  setPickedSlot(null);
                  setBookStep("calendar");
                }}
              >
                ← Back
              </button>
            )}
          </div>

          {/* CALENDAR */}
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

  {/*  WEATHER BOX */}
  <div className="cd-weatherBox">
    {!pickedDate && <div className="cd-weatherMuted">Pick a date to see the weather.</div>}

{pickedDate && weatherLoading && (
  <div className="cd-weatherMuted">
    Loading weather...
    <span className="cd-weatherLoadingBar" />
  </div>
)}
    {pickedDate && !weatherLoading && weatherErr && (
      <div className="cd-weatherErr">{weatherErr}</div>
    )}

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

          {typeof weather.rain === "number" && (
            <div className="cd-weatherRain">💧 {weather.rain}%</div>
          )}
        </div>
      </div>
    )}
  </div>

  <button
    className="cd-nextBtn cd-confirmBtn"
    type="button"
    disabled={!pickedDate}
    onClick={() => {
      setPickedSlot(null);
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

                <div className="ct-slotsGrid">
                  {timeSlots.map((s) => {
                    const active = pickedSlot && pickedSlot.id === s.id;
                    const disabled = s.soldOut;

                    return (
                      <button
                        key={s.id}
                        type="button"
                        className={`ct-slot ${active ? "isActive" : ""} ${disabled ? "isDisabled" : ""}`}
                        onClick={() => !disabled && setPickedSlot(s)}
                        disabled={disabled}
                      >
                        <span className="ct-slotTime">
                          {s.from} <span className="ct-slotDash">–</span> {s.to}
                        </span>

                        <span className="ct-slotRight">
                          {disabled ? (
                            <span className="ct-soldOut">Sold out</span>
                          ) : (
                            <span className="ct-slotPrice">{s.price}JD</span>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="ct-slotsActions">
                <div className="ct-summaryBox">
                  <div className="ct-sumLine">
                    <span>Club</span>
                    <strong>{club.name}</strong>
                  </div>

                  <div className="ct-sumLine">
                    <span>Court</span>
                    <strong>{court.name}</strong>
                  </div>

                  <div className="ct-sumLine">
                    <span>Date</span>
                    <strong>{pickedDate ? pickedDate.toLocaleDateString() : "-"}</strong>
                  </div>

                  <div className="ct-sumLine">
                    <span>Time</span>
                    <strong>{pickedSlot ? `${pickedSlot.from} – ${pickedSlot.to}` : "Choose a slot"}</strong>
                  </div>

                  <div className="ct-sumTotal">
                    <span>Total</span>
                    <strong>{pickedSlot ? `${pickedSlot.price}JD` : "--"}</strong>
                  </div>
                </div>

                <button className="ct-primaryBtn" type="button" disabled={!pickedSlot} onClick={goConfirm}>
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
              <div className="ct-muted">Quick notes to avoid any confusion.</div>
            </div>

            <div className="ct-rulesBadge">Important</div>
          </div>

          <div className="ct-rulesGrid">
            {(court.rules || []).map((r, i) => (
              <div key={i} className="ct-ruleItem">
                <span className="ct-ruleIc">📌</span>
                <span className="ct-ruleText">{r}</span>
              </div>
            ))}
          </div>

          {club.clubRules && club.clubRules.length > 0 && (
            <div className="ct-rulesFoot">
              <div className="ct-rulesFootTitle">Booking policy highlights</div>

              <div className="ct-policyGrid">
                {club.clubRules.map((x, i) => (
                  <div key={i} className="ct-policyItem">
                    <span className="ct-policyIc">🛡️</span>
                    <span>{x}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* MODAL GALLERY */}
        {galleryOpen && (
          <div className={`ct-modal ${galleryShow ? "show" : ""}`} onMouseDown={closeGallery}>
            <div className="ct-modalInner" onMouseDown={(e) => e.stopPropagation()}>
              <button className="ct-modalClose" type="button" onClick={closeGallery}>
                ✕
              </button>

              <div className="ct-modalStage">
                <button
                  className="ct-galArrow left"
                  type="button"
                  onClick={() => setActiveImg((i) => (i - 1 + court.gallery.length) % court.gallery.length)}
                >
                  ‹
                </button>

                <img className="ct-modalImg" src={court.gallery[activeImg]} alt="" />

                <button
                  className="ct-galArrow right"
                  type="button"
                  onClick={() => setActiveImg((i) => (i + 1) % court.gallery.length)}
                >
                  ›
                </button>
              </div>

              <div className="ct-modalThumbs">
                {court.gallery.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`ct-thumb ${i === activeImg ? "active" : ""}`}
                    onClick={() => setActiveImg(i)}
                    style={{ backgroundImage: `url(${img})` }}
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