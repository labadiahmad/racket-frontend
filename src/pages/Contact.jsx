import { useState } from "react";
import "./contact.css";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "General",
    message: "",
  });

  const [sent, setSent] = useState(false);

  const topics = ["General", "Booking", "Partnership", "Bug Report", "Other"];

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function onSubmit(e) {
    e.preventDefault();

    setSent(true);
    setTimeout(() => setSent(false), 2500);

    setForm({
      name: "",
      email: "",
      subject: "General",
      message: "",
    });
  }

  return (
    <div className="ct-page">
      <div className="ct-bgGlow ct-g1" />
      <div className="ct-bgGlow ct-g2" />

      <div className="ct-container">
        {/* HERO */}
        <div className="ct-hero">
          <h1 className="ct-title">
            Let’s build your <span className="ct-titleGrad">next match</span>.
          </h1>
          <p className="ct-sub">
            Clubs, tournaments, courts — if you need anything, message us. We reply fast and keep it simple.
          </p>
        </div>

        <div className="ct-layout">
          {/* LEFT */}
          <aside className="ct-side">
            <div className="ct-card ct-cardSmall">
              <div className="ct-cardTitle2">Support & Partnerships</div>
              <div className="ct-cardSub2">Questions, booking issues, partnerships.</div>

              <div className="ct-info">
                <InfoRow icon="📍" label="Location" value="Amman, Jordan" />
                <InfoRow icon="✉️" label="Email" value="support@racket.com" />
                <InfoRow icon="📞" label="Phone" value="+962 7X XXX XXXX" />
                <InfoRow icon="⏱️" label="Hours" value="Sun–Thu • 10:00–18:00" />
              </div>
            </div>

            <div className="ct-tip">
              <div className="ct-tipTitle">Tip</div>
              <div className="ct-tipText">
                If it’s about a tournament, include the club name + date so we can help faster.
              </div>
            </div>
          </aside>

          {/* RIGHT */}
          <section className="ct-card ct-formCard">
            <div className="ct-head">
              <div>
                <div className="ct-cardTitle2">Send a message</div>
                <div className="ct-cardSub2">Fill this in, and we’ll contact you by email.</div>
              </div>

              {sent && (
                <div className="ct-toast" role="status" aria-live="polite">
                  Message sent ✅
                </div>
              )}
            </div>

            <form className="ct-form" onSubmit={onSubmit}>
              <div className="ct-row">
                <div className="ct-field">
                  <label className="ct-label">Full Name</label>
                  <input
                    className="ct-input"
                    name="name"
                    value={form.name}
                    onChange={onChange}
                    placeholder="Your name"
                    required
                  />
                </div>

                <div className="ct-field">
                  <label className="ct-label">Email</label>
                  <input
                    className="ct-input"
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={onChange}
                    placeholder="you@email.com"
                    required
                  />
                </div>
              </div>

              <div className="ct-field">
                <label className="ct-label">Subject</label>

                <div className="ct-selectWrap">
                  <select
                    className="ct-select"
                    name="subject"
                    value={form.subject}
                    onChange={onChange}
                  >
                    {topics.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="ct-field">
                <label className="ct-label">Message</label>
                <textarea
                  className="ct-textarea"
                  name="message"
                  value={form.message}
                  onChange={onChange}
                  placeholder="Write your message..."
                  required
                />
              </div>

              <div className="ct-actions">
                <button className="ct-btn" type="submit">
                  Send Message <span className="ct-arrow">→</span>
                </button>

                <div className="ct-note">We usually reply within <b>24 hours</b>.</div>
              </div>
            </form>
          </section>
        </div>

        {/* BOTTOM STRIP */}
        <div className="ct-strip">
          <div>
            <div className="ct-stripTitle">Want to feature your club on Racket?</div>
            <div className="ct-stripSub">
              We can list courts, tournaments, and availability in a clean modern view.
            </div>
          </div>

          <div className="ct-stripPill">Partnership • Growth • Visibility</div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="ct-infoRow">
      <div className="ct-ic">{icon}</div>
      <div>
        <div className="ct-infoLabel">{label}</div>
        <div className="ct-infoValue">{value}</div>
      </div>
    </div>
  );
}