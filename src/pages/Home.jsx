import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../api";

import laithImg from "../assets/players/laith.jpg";
import saraImg from "../assets/players/sara.jpg";
import omarImg from "../assets/players/omar.jpg";

import starIcon from "../assets/clubs/star.png";
import heroVideo from "../assets/hero/vid1.mp4";

import "./home.css";

export default function Home() {
  const navigate = useNavigate();

  const [homeLocation, setHomeLocation] = useState("Khalda");
  const [homeDate, setHomeDate] = useState("");
  const [homeType, setHomeType] = useState("All");

  const onHomeSearch = () => {
    const params = new URLSearchParams();
    if (homeLocation && homeLocation !== "All") params.set("location", homeLocation);
    if (homeDate) params.set("date", homeDate);
    if (homeType && homeType !== "All") params.set("type", homeType);
    navigate(`/courts?${params.toString()}`);
  };

  const [courts, setCourts] = useState([]);
  const [featuredClubs, setFeaturedClubs] = useState([]);

  const API_BASE = "http://localhost:5050";
  const fixUrl = (url) => {
    if (!url) return "";
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    if (url.startsWith("/uploads")) return API_BASE + url; // <-- fix here
    return url;
  };

  useEffect(() => {
    async function loadHomeData() {
      try {
        const clubsData = await apiFetch("/clubs");
        const courtsData = await apiFetch("/courts");

        setFeaturedClubs(
          (clubsData || []).map((c) => ({
            id: String(c.club_id),
            name: c.name,
            cover: fixUrl(c.cover_url),
            logo: fixUrl(c.logo_url),
            location: c.address || c.city || "",
            rating: Math.round(Number(c.avg_rating ?? c.club_rating ?? 0)) || 0,
            reviews: Number(c.reviews_count ?? c.club_reviews ?? 0) || 0,
          }))
        );

        setCourts(
          (courtsData || []).map((ct) => ({
            clubId: String(ct.club_id),
            courtId: String(ct.court_id),
            name: ct.club_name || ct.name,
            type: ct.type || ct.court_type || "",
            img: fixUrl(ct.cover_url || ct.image_url || ""),
            location: ct.club_address || ct.club_city || "",
          }))
        );
      } catch (err) {
        console.error("Home API error:", err);
      }
    }

    loadHomeData();
  }, []);

  const testimonials = [
    { name: "Laith M.", role: "Player", rating: 5, img: laithImg, text: "I booked a court at Tropico using this website and it was super easy." },
    { name: "Sara A.", role: "Beginner", rating: 5, img: saraImg, text: "The UI is clean and premium. Smooth experience." },
    { name: "Omar H.", role: "Competitive", rating: 5, img: omarImg, text: "Tournaments are organized and easy to join." },
  ];

  const [tIndex, setTIndex] = useState(0);
  const prevTest = () => setTIndex((i) => (i - 1 + testimonials.length) % testimonials.length);
  const nextTest = () => setTIndex((i) => (i + 1) % testimonials.length);

  const COURTS_PER_PAGE = 3;
  const CLUBS_PER_PAGE = 3;

  const [courtsPage, setCourtsPage] = useState(0);
  const [clubsPage, setClubsPage] = useState(0);

  const courtsPages = Math.max(1, Math.ceil(courts.length / COURTS_PER_PAGE));
  const clubsPages = Math.max(1, Math.ceil(featuredClubs.length / CLUBS_PER_PAGE));

  const courtsView = courts.slice(courtsPage * COURTS_PER_PAGE, courtsPage * COURTS_PER_PAGE + COURTS_PER_PAGE);
  const clubsView = featuredClubs.slice(clubsPage * CLUBS_PER_PAGE, clubsPage * CLUBS_PER_PAGE + CLUBS_PER_PAGE);

  const prevCourts = () => setCourtsPage((p) => (p - 1 + courtsPages) % courtsPages);
  const nextCourts = () => setCourtsPage((p) => (p + 1) % courtsPages);

  const prevClubs = () => setClubsPage((p) => (p - 1 + clubsPages) % clubsPages);
  const nextClubs = () => setClubsPage((p) => (p + 1) % clubsPages);

  return (
    <div className="rk-page">
      {/* HERO */}
      <section className="rk-hero">
        <div className="rk-hero-card rk-reveal">
          <video className="rk-hero-video" src={heroVideo} autoPlay muted loop playsInline />
          <div className="rk-hero-overlay" />

          <div className="rk-hero-center rk-container">
            <div className="rk-hero-pill">
              <span className="rk-pill-dot">🎾</span>
              Book your court in seconds
            </div>

            <h1 className="rk-hero-title">Racket</h1>
            <p className="rk-hero-sub">Built for Champs</p>
          </div>

          {/* Search */}
          <div className="rk-search-float">
            <div className="rk-container">
              <div className="rk-search-grid">
                <div className="rk-field">
                  <div className="rk-field-label">Location</div>
                  <div className="rk-pill-input">
                    <span className="rk-field-ic">📍</span>
                    <select value={homeLocation} onChange={(e) => setHomeLocation(e.target.value)}>
                      <option>All</option>
                      <option>Khalda</option>
                      <option>Abdoun</option>
                      <option>Tabarbour</option>
                      <option>Shmeisani</option>
                      <option>KHBP</option>
                    </select>
                  </div>
                </div>

                <div className="rk-field">
                  <div className="rk-field-label">Date</div>
                  <div className="rk-pill-input">
                    <span className="rk-field-ic">🗓️</span>
                    <input value={homeDate} onChange={(e) => setHomeDate(e.target.value)} type="date" />
                  </div>
                </div>

                <div className="rk-field">
                  <div className="rk-field-label">Court Type</div>
                  <div className="rk-pill-input">
                    <span className="rk-field-ic">🎾</span>
                    <select value={homeType} onChange={(e) => setHomeType(e.target.value)}>
                      <option>All</option>
                      <option>Indoor</option>
                      <option>Outdoor</option>
                    </select>
                  </div>
                </div>

                <button className="rk-search-btn rk-press" type="button" onClick={onHomeSearch}>
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="rk-stats">
        <div className="rk-container rk-stats-grid rk-reveal">
          <div className="rk-stat">
            <div className="rk-stat-num">20+</div>
            <div className="rk-stat-sub">Monthly Tournaments</div>
          </div>

          <div className="rk-stat">
            <div className="rk-stat-num">50+</div>
            <div className="rk-stat-sub">Weekly Court Bookings</div>
          </div>

          <div className="rk-stat">
            <div className="rk-stat-num">150+</div>
            <div className="rk-stat-sub">Weekly Players</div>
          </div>
        </div>
      </section>

      {/* COURTS */}
      <section className="rk-section">
        <div className="rk-container">
          <div className="rk-head-row rk-reveal">
            <div className="rk-head">
              <h2>Currently Available Courts</h2>
              <p>Pick Your Court</p>
            </div>

            <div className="rk-rightTools">
              {courtsPages > 1 && (
                <div className="rk-navBtns">
                  <button className="rk-navBtn" type="button" onClick={prevCourts} aria-label="Previous courts">
                    ‹
                  </button>
                  <button className="rk-navBtn" type="button" onClick={nextCourts} aria-label="Next courts">
                    ›
                  </button>
                </div>
              )}

              <a href="/courts" className="rk-seeall">
                See All <span className="rk-seeall-ic">→</span>
              </a>
            </div>
          </div>

          <div className="rk-courts rk-reveal">
            {courtsView.map((c) => (
              <article
                className="rk-court-card rk-hover"
                key={`${c.clubId}-${c.courtId}`}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/clubs/${c.clubId}/courts/${c.courtId}`)}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/clubs/${c.clubId}/courts/${c.courtId}`)}
              >
                <div className="rk-court-media" style={{ backgroundImage: `url(${c.img})` }}>
                  <div className="rk-court-titleblock">
                    <div className="rk-court-title">{c.name}</div>
                    <div className="rk-court-sub">{c.type}</div>
                  </div>

                  <div className="rk-court-chips">
                    <span className="rk-chip">
                      <span className="rk-chip-ic">📍</span> {c.location}
                    </span>
                   
                  </div>
                </div>
              </article>
            ))}
          </div>

          {courtsPages > 1 && (
            <div className="rk-dots rk-reveal">
              {Array.from({ length: courtsPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`rk-dot ${i === courtsPage ? "active" : ""}`}
                  onClick={() => setCourtsPage(i)}
                  aria-label={`Courts page ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* WHY RACKET */}
      <section className="rk-why">
        <div className="rk-container">
          <div className="rk-why-head rk-reveal">
            <h2 className="rk-why-title">Why players choose Racket</h2>
            <p className="rk-why-sub">Everything you need to book courts and join tournaments in one place.</p>
          </div>

          <div className="rk-why-grid rk-reveal">
            <div className="rk-why-card rk-hover">
              <div className="rk-why-icon">⚡</div>
              <h3>Fast booking</h3>
              <p>Find courts quickly and reserve your slot in seconds.</p>
            </div>

            <div className="rk-why-card rk-hover">
              <div className="rk-why-icon">✅</div>
              <h3>Verified clubs</h3>
              <p>Trusted clubs with clear details, photos, and schedules.</p>
            </div>

            <div className="rk-why-card rk-hover">
              <div className="rk-why-icon">🔒</div>
              <h3>Secure payments</h3>
              <p>Safe checkout experience and clear booking confirmation.</p>
            </div>

            <div className="rk-why-card rk-hover">
              <div className="rk-why-icon">🏆</div>
              <h3>Real tournaments</h3>
              <p>Join tournaments by level and gender with organized info.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CLUBS (Instead of Tournaments) */}
      <section className="rk-clubs">
        <div className="rk-container">
          <div className="rk-clubs-head rk-reveal">
            <div>
              <h2 className="rk-clubs-title">Featured Clubs</h2>
              <p className="rk-clubs-sub">Top clubs in Amman — clean details, fast booking.</p>
            </div>

            <div className="rk-rightTools">
              {clubsPages > 1 && (
                <div className="rk-navBtns">
                  <button className="rk-navBtn" type="button" onClick={prevClubs} aria-label="Previous clubs">
                    ‹
                  </button>
                  <button className="rk-navBtn" type="button" onClick={nextClubs} aria-label="Next clubs">
                    ›
                  </button>
                </div>
              )}

              <a className="rk-seeall" href="/clubs">
                See All <span className="rk-seeall-ic">→</span>
              </a>
            </div>
          </div>

          <div className="rk-clubs-grid rk-reveal">
            {clubsView.map((c) => (
              <article
                key={c.id}
                className="rk-clb-card"
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/clubs/${c.id}`)}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/clubs/${c.id}`)}
              >
                <div className="rk-clb-cover" style={{ backgroundImage: `url(${c.cover})` }}>
                  <div className="rk-clb-dim" />
                  <div className="rk-clb-title">{c.name}</div>

                  <div className="rk-clb-logoWrap">
                    <div className="rk-clb-logoPlate">
                      <img className="rk-clb-logo" src={c.logo} alt={`${c.name} logo`} />
                    </div>
                  </div>

                  <div className="rk-clb-bottom">
                    <div className="rk-clb-loc">
                      <span className="rk-clb-pin">📍</span>
                      <span>{c.location}</span>
                    </div>

                    <div className="rk-clb-starsRow">
                      {Array.from({ length: Math.round(c.rating) }).map((_, idx) => (
                        <img key={idx} className="rk-clb-star" src={starIcon} alt="star" />
                      ))}
                    </div>

                    <div className="rk-clb-rev">(+{c.reviews} Reviews)</div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {clubsPages > 1 && (
            <div className="rk-dots rk-reveal">
              {Array.from({ length: clubsPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  className={`rk-dot ${i === clubsPage ? "active" : ""}`}
                  onClick={() => setClubsPage(i)}
                  aria-label={`Clubs page ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="rk-fans">
        <div className="rk-container">
          <div className="rk-fans-wrap rk-reveal">
            <div className="rk-fans-panel">
              <div className="rk-fans-header">
                <h3 className="rk-fans-title">Our Racketers</h3>
                <p className="rk-fans-sub">Real feedback from players and clubs.</p>

                <div className="rk-fans-dots">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      className={`rk-fans-dot ${i === tIndex ? "active" : ""}`}
                      onClick={() => setTIndex(i)}
                      type="button"
                    />
                  ))}
                </div>
              </div>

              <div className="rk-fans-card">
                <div className="rk-fans-quoteMark">“</div>

                <p className="rk-fans-text">{testimonials[tIndex].text}</p>

                <div className="rk-fans-footer">
                  <div className="rk-fans-stars">
                    {Array.from({ length: testimonials[tIndex].rating }).map((_, i) => (
                      <img key={i} src={starIcon} className="rk-fans-star" alt="star" />
                    ))}
                  </div>

                  <div className="rk-fans-person">
                    <div className="rk-fans-name">{testimonials[tIndex].name}</div>
                    <div className="rk-fans-role">{testimonials[tIndex].role}</div>
                  </div>

                  <div className="rk-fans-arrows">
                    <button className="rk-fans-arrow" onClick={prevTest} type="button">
                      ‹
                    </button>
                    <button className="rk-fans-arrow" onClick={nextTest} type="button">
                      ›
                    </button>
                  </div>
                </div>
              </div>

              <div className="rk-fans-tags">
                <span className="rk-fans-tag">Verified players</span>
                <span className="rk-fans-tag">Updated weekly</span>
                <span className="rk-fans-tag">Clubs & courts reviews</span>
              </div>
            </div>

            <div className="rk-fans-media" style={{ backgroundImage: `url(${testimonials[tIndex].img})` }}>
              <div className="rk-fans-mediaOverlay" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="rk-cta">
        <div className="rk-container">
          <div className="rk-cta-card rk-reveal">
            <div className="rk-cta-bg" aria-hidden="true" />
            <div className="rk-cta-overlay" aria-hidden="true" />

            <div className="rk-cta-inner">
              <div>
                <div className="rk-cta-kicker">Ready to play?</div>
                <h2 className="rk-cta-title">Book a court or join a tournament today.</h2>
                <p className="rk-cta-sub">Clean UI, quick booking, and tournaments that match your level.</p>
              </div>

              <div className="rk-cta-actions">
                <a className="rk-cta-btn rk-cta-btn--solid rk-press" href="/courts">
                  Browse Courts <span className="rk-cta-arrow">→</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}