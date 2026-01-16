import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import "./clubDetails.css";

import tropicoCover from "../assets/courts/redCourt.jpeg";
import tropicoCover2 from "../assets/courts/3.jpeg";
import projectCover from "../assets/courts/SCR-20251203-uebn.jpeg";
import wepadelCover from "../assets/courts/wepadel-court-cover.jpg";

import tropicoLogo from "../assets/clubs/tropico.png";
import projectLogo from "../assets/clubs/project-padel.png";
import wepadelLogo from "../assets/clubs/2.png";
import club364Logo from "../assets/clubs/364.png";

import starIcon from "../assets/clubs/star.png";

const timeSlots = [
  { id: "s1", from: "08:00", to: "09:00", price: 10, soldOut: false },
  { id: "s2", from: "09:00", to: "10:00", price: 20, soldOut: true },
  { id: "s3", from: "21:00", to: "22:00", price: 50, soldOut: false },
  { id: "s4", from: "22:00", to: "23:00", price: 50, soldOut: true },
  { id: "s5", from: "23:00", to: "00:00", price: 50, soldOut: false },
];

export default function ClubDetails({ user, reservationDraft, setReservationDraft }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const clubs = [
    {
      id: "1",
      name: "Tropico Padel Club",
      logo: tropicoLogo,
      rating: 4.9,
      reviews: 120,
       lat: 31.9539,
  lon: 35.9106,
      about:
        "Tropico Padel Club offers modern courts, easy booking, and a fun playing experience for all levels. Enjoy premium facilities and a friendly atmosphere every time you play.",
      address: "Tropico Padel Club Al-Madina Street, District 5, Amman, Jordan",
      mapsUrl: "https://www.google.com/maps",
      whatsapp: "+962 792133190",
      phone: "+962 792133190",
      gallery: [tropicoCover, projectCover, wepadelCover, tropicoCover2, tropicoCover],
      courts: [
        {
          id: "court1",
          name: "Court 1",
          type: "Outdoor Premium Court",
          chips: ["Glass walls & pro turf", "LED night lighting", "Max 4 players", "Free parking & seating area"],
          image: tropicoCover2,
        },
        {
          id: "court2",
          name: "Court 2",
          type: "Indoor Court",
          chips: ["Indoor", "AC", "Max 4 players", "Premium turf"],
          image: tropicoCover,
        },
      ],
      facilities: [
        { icon: "🪑", label: "Sitting area" },
        { icon: "🚿", label: "Changing area" },
        { icon: "🎾", label: "Premium padel courts" },
        { icon: "🅿️", label: "Free parking" },
      ],
    },
    {
      id: "2",
      name: "Project Padel",
      logo: projectLogo,
      rating: 4.7,
      reviews: 83,
       lat: 31.9539,
  lon: 35.9106,
      about:
        "Project Padel is an indoor-focused club with clean courts and modern facilities. Great for competitive players and training sessions.",
      address: "Project Padel, King Hussein Business Park (KHBP), Amman, Jordan",
      mapsUrl: "https://www.google.com/maps",
      whatsapp: "+962 790000000",
      phone: "+962 790000000",
      gallery: [projectCover, wepadelCover, tropicoCover, projectCover],
      courts: [
        {
          id: "court1",
          name: "Court 1",
          type: "Indoor Pro Court",
          chips: ["Indoor", "AC", "LED lighting", "Max 4 players"],
          image: projectCover,
        },
        {
          id: "court2",
          name: "Court 2",
          type: "Indoor Training Court",
          chips: ["Indoor", "Training friendly", "Max 4 players", "Premium turf"],
          image: projectCover,
        },
      ],
      facilities: [
        { icon: "❄️", label: "AC indoor courts" },
        { icon: "🅿️", label: "Parking" },
        { icon: "🧴", label: "Changing rooms" },
        { icon: "☕", label: "Cafe" },
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
      about: "WePadel offers outdoor courts with a friendly vibe. Perfect for casual games and weekend tournaments.",
      address: "WePadel, Khalda, Amman, Jordan",
      mapsUrl: "https://www.google.com/maps",
      whatsapp: "+962 791111111",
      phone: "+962 791111111",
      gallery: [wepadelCover, tropicoCover, projectCover, wepadelCover],
      courts: [
        {
          id: "court1",
          name: "Court 1",
          type: "Outdoor Court",
          chips: ["Outdoor", "Good lighting", "Max 4 players", "Seating area"],
          image: wepadelCover,
        },
      ],
      facilities: [
        { icon: "🌤️", label: "Outdoor courts" },
        { icon: "🪑", label: "Seating" },
        { icon: "🅿️", label: "Parking" },
        { icon: "☕", label: "Cafe" }
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
      about:
        "364 Sports Club is a multi-sport destination with padel courts and frequent tournaments. Strong community and competitive vibes.",
      address: "364 Sports Club, Madaba, Jordan",
      mapsUrl: "https://www.google.com/maps",
      whatsapp: "+962 792222222",
      phone: "+962 792222222",
      gallery: [tropicoCover, projectCover, wepadelCover],
      courts: [
        {
          id: "court1",
          name: "Court 1",
          type: "Outdoor Court",
          chips: ["Outdoor", "Tournament ready", "Max 4 players", "Parking"],
          image: tropicoCover,
        },
      ],
      facilities: [
        { icon: "🏆", label: "Tournaments" },
        { icon: "☕", label: "Cafe" },
        { icon: "🅿️", label: "Parking" },
        { icon: "🪑", label: "Seating area" },
      ],
    },
  ];

  // find club without memo
  let club = null;
  for (let i = 0; i < clubs.length; i++) {
    if (clubs[i].id === String(id)) {
      club = clubs[i];
      break;
    }
  }

  if (!club) return <div style={{ padding: 120 }}>Club not found</div>;

  // booking step
  const [bookStep, setBookStep] = useState("details");
  const isThisClubDraft = reservationDraft?.clubId === String(club.id);

  const [courtId, setCourtId] = useState(() => {
    if (isThisClubDraft && reservationDraft?.courtId) return reservationDraft.courtId;
    return club.courts[0]?.id || "";
  });

  const [pickedDate, setPickedDate] = useState(() => {
    if (isThisClubDraft && reservationDraft?.pickedDateISO) return new Date(reservationDraft.pickedDateISO);
    return null;
  });

  const [pickedSlotId, setPickedSlotId] = useState(() => {
    if (isThisClubDraft && reservationDraft?.pickedSlotId) return reservationDraft.pickedSlotId;
    return null;
  });

  let selectedCourt = club.courts[0] || null;
  for (let i = 0; i < club.courts.length; i++) {
    if (club.courts[i].id === courtId) {
      selectedCourt = club.courts[i];
      break;
    }
  }

  let pickedSlot = null;
  for (let i = 0; i < timeSlots.length; i++) {
    if (timeSlots[i].id === pickedSlotId) {
      pickedSlot = timeSlots[i];
      break;
    }
  }

  useEffect(() => {
    const sameClub = reservationDraft?.clubId === String(id);

    if (sameClub) {
      setCourtId(reservationDraft?.courtId || club.courts[0]?.id || "");
      setPickedDate(reservationDraft?.pickedDateISO ? new Date(reservationDraft.pickedDateISO) : null);
      setPickedSlotId(reservationDraft?.pickedSlotId || null);

      if (location.state?.goToStep === "slots") setBookStep("slots");
      else if (reservationDraft?.pickedSlotId) setBookStep("slots");
      else if (reservationDraft?.pickedDateISO) setBookStep("calendar");
      else setBookStep("details");
    } else {
      setCourtId(club.courts[0]?.id || "");
      setPickedDate(null);
      setPickedSlotId(null);
      setBookStep("details");
    }
  }, [id]);

  useEffect(() => {
    if (location.state?.goToStep) {
      navigate(location.pathname, { replace: true, state: null });
    }
  }, []);

  useEffect(() => {
    if (!setReservationDraft) return;

    setReservationDraft((prev) => ({
      ...prev,
      clubId: String(club.id),
      clubName: club.name,
      clubLogo: club.logo,
      courtId,
      courtName: selectedCourt?.name || "",
      courtImage: selectedCourt?.image || "",
      pickedDateISO: pickedDate ? pickedDate.toISOString() : null,
      pickedSlotId: pickedSlotId || null,
      pickedSlot: pickedSlot ? { id: pickedSlot.id, from: pickedSlot.from, to: pickedSlot.to, price: pickedSlot.price } : null,
    }));
  }, [club.id, club.name, club.logo, courtId, selectedCourt?.name, selectedCourt?.image, pickedDate, pickedSlotId, setReservationDraft, pickedSlot]);

  const [calMonthOffset, setCalMonthOffset] = useState(0);

  const getCalInfo = () => {
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
  };

  const calInfo = getCalInfo();

  const sameDay = (a, b) =>
    a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryShow, setGalleryShow] = useState(false);
  const [activeImg, setActiveImg] = useState(0);

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
      if (e.key === "ArrowRight") setActiveImg((i) => (i + 1) % club.gallery.length);
      if (e.key === "ArrowLeft") setActiveImg((i) => (i - 1 + club.gallery.length) % club.gallery.length);
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [galleryOpen]);

  const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());

const isSelectableDate = (dt) => {
  if (!dt) return false;

  const today = startOfDay(new Date());
  const max = new Date(today);
  max.setDate(max.getDate() + 15); 

  const x = startOfDay(dt);
  return x >= today && x <= max;
};
  const goBackStep = () => {
    if (bookStep === "calendar") setBookStep("details");
    else if (bookStep === "slots") setBookStep("calendar");
  };

  const goConfirm = () => {
    if (!pickedDate || !pickedSlot || !selectedCourt) return;

    const payload = {
      clubId: String(club.id),
      clubName: club.name,
      clubLogo: club.logo,
      courtId: selectedCourt.id,
      courtName: selectedCourt.name,
      courtImage: selectedCourt.image || "",
      pickedDateISO: pickedDate.toISOString(),
      pickedSlotId: pickedSlot.id,
      pickedSlot,
      returnTo: location.pathname,
    };

    if (setReservationDraft) setReservationDraft((prev) => ({ ...prev, ...payload }));
    navigate("/confirm-reservation", { state: payload });
  };

const baseReviews = [
  { id: "r1", clubId: "1", userId: "u1", name: "Ahmad", stars: 5, comment: "...", photos: [], dateISO: new Date().toISOString() },
  { id: "r2", clubId: "1", userId: "u2", name: "Lina",  stars: 4, comment: "...", photos: [], dateISO: new Date().toISOString() },
];

  const [reviews, setReviews] = useState(() => baseReviews.filter((x) => x.clubId === String(id)));

  useEffect(() => {
    setReviews(baseReviews.filter((x) => x.clubId === String(id)));
  }, [id]);

  const [rq, setRq] = useState("");
  const [starsFilter, setStarsFilter] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");

  const [openReview, setOpenReview] = useState(false);
const [deleteOpen, setDeleteOpen] = useState(false);
const [deleteTarget, setDeleteTarget] = useState(null);

const openDelete = (review) => {
  setDeleteTarget(review);
  setDeleteOpen(true);
};

const closeDelete = () => {
  setDeleteOpen(false);
  setDeleteTarget(null);
};

const confirmDelete = () => {
  if (!deleteTarget) return;

  (deleteTarget.photos || []).forEach((p) => {
    if (typeof p === "string" && p.startsWith("blob:")) URL.revokeObjectURL(p);
  });

  setReviews((prev) => prev.filter((x) => x.id !== deleteTarget.id));
  closeDelete();
};
  const [revDraft, setRevDraft] = useState({
    name: `${user?.firstName || "User"} ${user?.lastName || ""}`.trim(),
    stars: 5,
    comment: "",
    photos: [],
  });

  const closeReview = () => {
    setOpenReview(false);
      setEditingId(null); 

    setRevDraft({
      name: `${user?.firstName || "User"} ${user?.lastName || ""}`.trim(),
      stars: 5,
      comment: "",
      photos: [],
    });
  };

  const addReview = () => {
    if (!revDraft.comment.trim()) return;

    const newOne = {
      id: `r_${Date.now()}`,
      clubId: String(id),
          userId: user?.id || "guest",  
      name: revDraft.name || "User",
      stars: revDraft.stars,
      comment: revDraft.comment,
      photos: revDraft.photos,
      dateISO: new Date().toISOString(),
    };

    setReviews((prev) => [newOne, ...(prev || [])]);
    closeReview();
  };

  let filteredReviews = (reviews || []).slice();

  const q = rq.trim().toLowerCase();
if (q) {
  filteredReviews = filteredReviews.filter((x) => {
    const name = (x.name || "").toLowerCase();
    const comment = (x.comment || "").toLowerCase();
    return name.includes(q) || comment.includes(q);
  });
}
  if (starsFilter !== "All") filteredReviews = filteredReviews.filter((x) => x.stars === Number(starsFilter));

  filteredReviews.sort((a, b) => {
    if (sortBy === "Newest") return b.dateISO.localeCompare(a.dateISO);
    if (sortBy === "Oldest") return a.dateISO.localeCompare(b.dateISO);
    if (sortBy === "Highest") return b.stars - a.stars;
    if (sortBy === "Lowest") return a.stars - b.stars;
    return 0;
  });

 const hasReviews = filteredReviews.length > 0;

const avgRating = hasReviews
  ? Math.round(
      (filteredReviews.reduce((sum, r) => sum + r.stars, 0) /
        filteredReviews.length) * 10
    ) / 10
  : 0;
  const onPickPhotos = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const urls = files.map((f) => URL.createObjectURL(f));

    setRevDraft((p) => ({
      ...p,
      photos: [...(p.photos || []), ...urls].slice(0, 6),
    }));

    e.target.value = "";
  };

  const removePickedPhoto = (url) => {
    URL.revokeObjectURL(url);
    setRevDraft((p) => ({
      ...p,
      photos: (p.photos || []).filter((x) => x !== url),
    }));
  };
const [editingId, setEditingId] = useState(null);

const startEdit = (review) => {
  if (review.userId !== (user?.id || "guest")) return; 

  setEditingId(review.id);

  setRevDraft({
    name: `${user?.firstName || "User"} ${user?.lastName || ""}`.trim(), // keep logged user name
    stars: review.stars || 5,
    comment: review.comment || "",
    photos: review.photos || [],
  });

  setOpenReview(true);
};

const saveEdit = () => {
  if (!revDraft.comment.trim()) return;

  setReviews((prev) =>
    prev.map((x) =>
      x.id === editingId
        ? {
            ...x,
            stars: revDraft.stars,
            comment: revDraft.comment,
            photos: revDraft.photos,
            dateISO: new Date().toISOString(),
          }
        : x
    )
  );

  setEditingId(null);
  closeReview();
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
useEffect(() => {
  if (pickedDate && !isSelectableDate(pickedDate)) {
    setPickedDate(null);
    setWeather(null);
    setWeatherErr("");
  }
}, [calMonthOffset]);
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
              <img className="cd-clubLogo" src={club.logo} alt={`${club.name} logo`} />
              <button className="cd-link" type="button" onClick={() => navigate(`/clubs/${club.id}`)}>
                {club.name}
              </button>
            </div>
          </div>

          <div className="cd-rating">
            <span className="cd-stars">
              {Array.from({ length: Math.round(club.rating) }).map((_, i) => (
                <img key={i} src={starIcon} className="cd-star" alt="star" />
              ))}
            </span>
            <span className="cd-rev">{club.reviews}</span>
          </div>
        </div>

        {/* TOP GRID */}
        <div className="cd-topGrid">
          <div className="cd-leftStack">
            <section className="cd-card">
              <div className="cd-cardTitle">About The Club</div>
              <p className="cd-cardText">{club.about}</p>
            </section>

            <section className="cd-card">
              <div className="cd-cardTitle">Contact Info</div>

              <a
                className="cd-contactRow cd-wa"
                href={`https://wa.me/${(club.whatsapp || "").replace(/\D/g, "")}`}
                target="_blank"
                rel="noreferrer"
              >
                <span className="cd-contactIc">💬</span>
                <div className="cd-contactBody">
                  <div className="cd-contactLabel">WhatsApp</div>
                  <div className="cd-contactVal">{club.whatsapp}</div>
                </div>
              </a>

              <a className="cd-contactRow cd-ph" href={`tel:${club.phone}`}>
                <span className="cd-contactIc">📞</span>
                <div className="cd-contactBody">
                  <div className="cd-contactLabel">Phone Number</div>
                  <div className="cd-contactVal">{club.phone}</div>
                </div>
              </a>
            </section>
          </div>

          <div
            className="cd-galleryOne"
            style={{ backgroundImage: `url(${club.gallery[0]})` }}
            onClick={() => openGallery(0)}
            role="button"
            tabIndex={0}
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
                View All
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
                {club.courts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
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
                <div className="cd-chipSolid">{selectedCourt?.type}</div>

                <div className="cd-chipGrid">
                  {(selectedCourt?.chips || []).map((x, i) => (
                    <div key={i} className="cd-chip">
                      {x}
                    </div>
                  ))}
                </div>

                <button className="cd-ghostBtn" type="button" onClick={() => navigate(`/clubs/${club.id}/courts/${courtId}`)}>
                  View Court Details
                </button>
              </div>

              <div className="cd-courtVisual">
                <img className="cd-courtImg" src={selectedCourt?.image} alt={selectedCourt?.name || "Court"} />
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
        setWeatherErr(""); // optional
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

  {/* WEATHER BOX */}
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

                <div className="cd-slotsGrid">
                  {timeSlots.map((sl) => {
                    const active = pickedSlotId === sl.id;
                    const disabled = sl.soldOut;

                    return (
                      <button
                        key={sl.id}
                        type="button"
                        className={`cd-slot ${active ? "isActive" : ""} ${disabled ? "isDisabled" : ""}`}
                        onClick={() => !disabled && setPickedSlotId(sl.id)}
                        disabled={disabled}
                      >
                        <span className="cd-slotTime">
                          {sl.from} <span className="cd-slotDash">–</span> {sl.to}
                        </span>

                        <span className="cd-slotRight">
                          {disabled ? <span className="cd-soldOut">Sold out</span> : <span className="cd-slotPrice">{sl.price}JD</span>}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="cd-slotsActions">
                <div className="cd-summaryBox">
                  <div className="cd-sumLine">
                    <span>Court</span>
                    <strong>{selectedCourt?.name}</strong>
                  </div>

                  <div className="cd-sumLine">
                    <span>Date</span>
                    <strong>{pickedDate ? pickedDate.toLocaleDateString() : "-"}</strong>
                  </div>

                  <div className="cd-sumLine">
                    <span>Time</span>
                    <strong>{pickedSlot ? `${pickedSlot.from} – ${pickedSlot.to}` : "Choose a slot"}</strong>
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
            <div className="cd-facGrid">
              {(club.facilities || []).map((f, i) => (
                <div key={i} className="cd-facItem">
                  <span className="cd-facIc">{f.icon}</span>
                  <span className="cd-facText">{f.label}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="cd-card cd-loc">
            <div className="cd-cardTitle">Location Details</div>
            <div className="cd-locAddressCard">{club.address}</div>
            <div className="cd-mapWrap" aria-label="Google Map" />
            <a className="cd-mapsBtn" href={club.mapsUrl} target="_blank" rel="noreferrer">
              <span className="cd-pinEmoji">📍</span>
              <span>Open in Google Maps</span>
              <span className="cd-openIc2">↗</span>
            </a>
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
                    <img key={i} src={starIcon} className={`cd-revStar ${i < Math.round(avgRating) ? "on" : "off"}`} alt="star" />
                  ))}
                </span>
                <span className="cd-revCount">({filteredReviews.length} reviews)</span>
              </div>
            </div>

            <button
              className="cd-addReviewBtn"
              type="button"
              onClick={() => {
                setEditingId(null);
                setRevDraft((p) => ({
                  ...p,
                  name: `${user?.firstName || "User"} ${user?.lastName || ""}`.trim(),
                }));
                setOpenReview(true);
              }}
            >
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
      <article key={r.id} className="cd-revCard">
  <div className="cd-revTopRow">
    <div className="cd-revUser">
      <div className="cd-revAvatar">{(r.name || "U").charAt(0)}</div>

      <div className="cd-revUserMeta">
        <div className="cd-revName">{r.name}</div>
        <div className="cd-revDateInline">{new Date(r.dateISO).toLocaleDateString()}</div>
      </div>
    </div>

    <div className="cd-revRight">
      <div className="cd-revStarsSm">
        {Array.from({ length: 5 }).map((_, i) => (
          <img
            key={i}
            src={starIcon}
            className={`cd-revStarSm ${i < r.stars ? "on" : ""}`}
            alt="star"
          />
        ))}
      </div>

      {r.userId === (user?.id || "guest") && (
        <div className="cd-revMiniActions">
          <button type="button" className="cd-revMiniBtn" onClick={() => startEdit(r)}>
            Edit
          </button>
          <button type="button" className="cd-revMiniBtn danger" onClick={() => openDelete(r)}>
          Delete
          </button>
        </div>
      )}
    </div>
  </div>

  <div className="cd-revText">{r.comment}</div>

  {r.photos && r.photos.length > 0 && (
    <div className="cd-revPhotosGrid">
      {r.photos.slice(0, 6).map((p, idx) => (
        <button key={idx} type="button" className="cd-revPhotoItem">
          <img className="cd-revPhotoImg" src={p.url || p} alt="" />
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
<div className="cd-rTitle">{editingId ? "Edit Review" : "Add Review"}</div>                
    <div className="cd-rSub">{editingId ? "Update your review in seconds" : "Share your experience in 10 seconds"}

    </div>
                  </div>
                </div>

                <button className="cd-rX" type="button" onClick={closeReview} aria-label="Close">
                  ✕
                </button>
              </div>

              <div className="cd-rUser">
                <div className="cd-rAvatar">{revDraft.name.charAt(0)}</div>
                <div className="cd-rUserName">{revDraft.name}</div>
              </div>

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
                        <img src={url} alt="" />
                        <button
                          type="button"
                          className="cd-rPrevRemove"
                          onClick={() => removePickedPhoto(url)}
                          aria-label="Remove photo"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="cd-rActions">
                <button className="cd-rCancel" type="button" onClick={closeReview}>
                  Cancel
                </button>
                <button
  className="cd-nextBtn cd-rSave"
  type="button"
  onClick={() => (editingId ? saveEdit() : addReview())}
>
  Save
</button>
              </div>
            </div>
          </div>
        )}
{deleteOpen && (
  <div className="cd-delModal" onMouseDown={closeDelete}>
    <div className="cd-delModalInner" onMouseDown={(e) => e.stopPropagation()}>
      <div className="cd-rHead">
        <div className="cd-rHeadLeft">
          <div className="cd-rBadge danger">!</div>
          <div>
            <div className="cd-rTitle">Delete Review</div>
            <div className="cd-rSub">This action cannot be undone</div>
          </div>
        </div>

        <button className="cd-rX" type="button" onClick={closeDelete} aria-label="Close">
          ✕
        </button>
      </div>

      <div className="cd-delBody">
        <p className="cd-delText">
          Are you sure you want to delete your review?
        </p>

        {deleteTarget && (
          <div className="cd-delPreview">
            <div className="cd-delName">{deleteTarget.name}</div>
            <div className="cd-delComment">{deleteTarget.comment}</div>
          </div>
        )}
      </div>

      <div className="cd-rActions">
        <button className="cd-rCancel" type="button" onClick={closeDelete}>
          Cancel
        </button>
        <button className="cd-nextBtn cd-rSave dangerBtn" type="button" onClick={confirmDelete}>
          Delete
        </button>
      </div>
    </div>
  </div>
)}
        {/* GALLERY MODAL */}
        {galleryOpen && (
          <div className={`cd-modal ${galleryShow ? "show" : ""}`} onMouseDown={closeGallery}>
            <div className="cd-modalInner" onMouseDown={(e) => e.stopPropagation()}>
              <button className="cd-modalClose" type="button" onClick={closeGallery}>
                ✕
              </button>

              <div className="cd-modalStage">
                <button
                  className="cd-galArrow left"
                  type="button"
                  onClick={() => setActiveImg((i) => (i - 1 + club.gallery.length) % club.gallery.length)}
                >
                  ‹
                </button>

                <img className="cd-modalImg" src={club.gallery[activeImg]} alt="" />

                <button
                  className="cd-galArrow right"
                  type="button"
                  onClick={() => setActiveImg((i) => (i + 1) % club.gallery.length)}
                >
                  ›
                </button>
              </div>

              <div className="cd-modalThumbs">
                {club.gallery.map((img, i) => (
                  <button
                    key={i}
                    type="button"
                    className={`cd-thumb ${i === activeImg ? "active" : ""}`}
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