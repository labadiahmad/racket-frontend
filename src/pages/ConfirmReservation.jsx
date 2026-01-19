import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./confirmReservation.css";

const API_BASE = import.meta.env.VITE_API_URL ;
const API = `${API_BASE}/api`;

const DRAFT_KEY = "reservationDraft";
const SUCCESS_KEY = "reservationSuccess";

function getDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getSavedUser() {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function getAuthHeaders(user) {
  const userId = user?.user_id || user?.id;
  const role = user?.role || "user";
  if (!userId) return null;

  return {
    "Content-Type": "application/json",
    "x-user-id": String(userId),
    "x-role": String(role),
  };
}

export default function ConfirmReservation({ user, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();

  const data = location.state || getDraft();
  const savedUser = user || getSavedUser();

  const isValidDraft = !!(
    data &&
    data.clubId &&
    data.courtId &&
    data.clubName &&
    data.courtName &&
    data.pickedDateISO &&
    data.pickedSlot &&
    data.pickedSlot.from &&
    data.pickedSlot.to &&
    typeof data.pickedSlot.price !== "undefined" &&
    data.pickedSlotId
  );

  const [bookingId] = useState(
    () => `BK-${Date.now()}-${Math.floor(Math.random() * 10000)}`
  );

  const [fullName, setFullName] = useState(
    savedUser?.full_name || savedUser?.fullName || ""
  );
  const [phone, setPhone] = useState(savedUser?.phone || "");

  const [p2, setP2] = useState("");
  const [p3, setP3] = useState("");
  const [p4, setP4] = useState("");

  const [agree, setAgree] = useState(false);
  const [submitErr, setSubmitErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const u = user || getSavedUser();
    if (u?.full_name) setFullName(u.full_name);
    if (u?.phone) setPhone(u.phone);
  }, [user]);

  const pickedDateObj = isValidDraft ? new Date(data.pickedDateISO) : null;
  const pickedDateText = pickedDateObj ? pickedDateObj.toLocaleDateString() : "-";

  const errors = {};
  const player1 = (fullName || "").trim();

  if (!player1) errors.fullName = "Full name is required.";

  const rawPhone = (phone || "").replace(/\s/g, "");
  const okPhone = /^07\d{8}$/.test(rawPhone);

  if (!rawPhone) errors.phone = "Phone number is required.";
  else if (!okPhone) errors.phone = "Phone number must be in this format: 07XXXXXXXX";

  if (!agree) errors.agree = "You must agree to the booking policy.";

  const canSubmit = Object.keys(errors).length === 0 && !submitting;

  const backToSlots = () => {
    if (data?.returnTo) {
      navigate(data.returnTo, { state: { goToStep: "slots" } });
    } else {
      navigate(-1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitErr("");

    if (!isValidDraft || !canSubmit || submitting) return;

    const headers = getAuthHeaders(savedUser);
    if (!headers) {
      setSubmitErr("Missing login info. Please logout and login again.");
      return;
    }

    try {
      setSubmitting(true);

      const dateISO = String(data.pickedDateISO).slice(0, 10);

      const playersArr = [player1, p2, p3, p4]
        .map((x) => (x || "").trim())
        .filter(Boolean);

      const body = {
        club_id: Number(data.clubId),
        court_id: Number(data.courtId),
        slot_id: Number(data.pickedSlotId),
        date_iso: dateISO,

        booked_by_name: player1,
        phone: rawPhone,

        player1: playersArr[0] || null,
        player2: playersArr[1] || null,
        player3: playersArr[2] || null,
        player4: playersArr[3] || null,
      };

      const res = await fetch(`${API}/reservations`, {
        method: "POST",
        headers,
        body: JSON.stringify(body),
      });

      const result = await res.json().catch(() => ({}));

      if (!res.ok) {
        setSubmitErr(result?.message || result?.error || "Reservation failed");
        return;
      }

      // update user in state + localStorage
      const updatedUser = {
        ...(savedUser || {}),
        full_name: player1,
        phone: rawPhone,
        role: savedUser?.role || "user",
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      if (typeof setUser === "function") setUser(updatedUser);

      const slot = data.pickedSlot;
      const timeText = `${slot.from} – ${slot.to}`;
      const costText = `${slot.price}JD`;

      const successPayload = {
        bookingId: result?.booking_id || bookingId,
        reservation_id: result?.reservation_id,
        clubId: data.clubId,
        clubName: data.clubName,
        courtId: data.courtId,
        courtName: data.courtName,
        date: pickedDateText,
        time: timeText,
        cost: costText,
        name: player1,
        phone: rawPhone,
      };

      localStorage.setItem(SUCCESS_KEY, JSON.stringify(successPayload));
      navigate("/reservation-success", { state: successPayload });
    } catch (err) {
      setSubmitErr(err?.message || "Reservation failed");
    } finally {
      setSubmitting(false);
    }
  };

  if (!isValidDraft) {
    return (
      <div className="cr-page">
        <div className="cr-wrap">
          <div className="cr-card">
            <h2 className="cr-title">No reservation selected</h2>
            <p className="cr-sub">Go back and pick a date and time first.</p>

            <button className="cr-btn" onClick={() => navigate("/clubs")} type="button">
              Go to clubs
            </button>

            <button className="cr-back" onClick={() => navigate(-1)} type="button">
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const slot = data.pickedSlot;
  const timeText = `${slot.from} – ${slot.to}`;
  const costText = `${slot.price}JD`;

  return (
    <div className="cr-page">
      <div className="cr-wrap">
        <div className="cr-progress">
          <div className="cr-progressTop">
            <div>
              <div className="cr-head">Confirm Your Reservation</div>
              <div className="cr-subHead">Almost done — just your info.</div>
            </div>

            <div className="cr-badge">
              Booking ID: <strong>{bookingId}</strong>
            </div>
          </div>

          <div className="cr-steps">
            <div className="cr-step isDone">
              <span className="cr-dot">✓</span>
              <span>Court</span>
            </div>
            <div className="cr-stepLine isDone" />

            <div className="cr-step isDone">
              <span className="cr-dot">✓</span>
              <span>Date</span>
            </div>
            <div className="cr-stepLine isDone" />

            <div className="cr-step isDone">
              <span className="cr-dot">✓</span>
              <span>Time</span>
            </div>
            <div className="cr-stepLine" />

            <div className="cr-step isActive">
              <span className="cr-dot">4</span>
              <span>Confirm</span>
            </div>
          </div>
        </div>

        <div className="cr-layout">
          <form className="cr-card" onSubmit={handleSubmit}>
            <div className="cr-section">
              <div className="cr-sectionTitle">Your Details</div>
              <p className="cr-sectionSub">We’ll use this to confirm your booking.</p>

              <div className="cr-field">
                <label>Full Name *</label>
                <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" />
                {errors.fullName && <div className="cr-err">{errors.fullName}</div>}
              </div>

              <div className="cr-field">
                <label>Phone Number *</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="07xxxxxxxx"
                  inputMode="tel"
                  maxLength={10}
                />
                {errors.phone && <div className="cr-err">{errors.phone}</div>}
              </div>
            </div>

            <div className="cr-divider" />

            <div className="cr-section">
              <div className="cr-sectionTitle">Players</div>
              <p className="cr-sectionSub">Enter all players for this booking (max 4).</p>

              <div className="cr-grid2">
                <div className="cr-field">
                  <label>Player 1 (You) *</label>
                  <input value={player1 || "—"} readOnly />
                </div>

                <div className="cr-field">
                  <label>Player 2</label>
                  <input value={p2} onChange={(e) => setP2(e.target.value)} placeholder="Optional" />
                </div>

                <div className="cr-field">
                  <label>Player 3</label>
                  <input value={p3} onChange={(e) => setP3(e.target.value)} placeholder="Optional" />
                </div>

                <div className="cr-field">
                  <label>Player 4</label>
                  <input value={p4} onChange={(e) => setP4(e.target.value)} placeholder="Optional" />
                </div>
              </div>
            </div>

            <div className="cr-divider" />

            <div className="cr-policy">
              <label className="cr-check">
                <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                <span>I agree to the booking policy (cancellation must be at least 24 hours before the slot).</span>
              </label>
              {errors.agree && <div className="cr-err">{errors.agree}</div>}
              {submitErr && <div className="cr-err">{submitErr}</div>}
            </div>

            <button className="cr-btn" type="submit" disabled={!canSubmit}>
              {submitting ? "Confirming..." : "Confirm Reservation"}
            </button>
          </form>

          <aside className="cr-summary">
            <div className="cr-ticket">
              <div className="cr-ticketTop">
                <div className="cr-ticketTitle">Booking Summary</div>
                <div className="cr-ticketSmall">Review before confirming.</div>
              </div>

              <div className="cr-ticketRow">
                <span>Club</span>
                <strong>{data.clubName}</strong>
              </div>

              <div className="cr-ticketRow">
                <span>Court</span>
                <strong>{data.courtName}</strong>
              </div>

              <div className="cr-ticketRow">
                <span>Date</span>
                <strong>{pickedDateText}</strong>
              </div>

              <div className="cr-ticketRow">
                <span>Time</span>
                <strong>{timeText}</strong>
              </div>

              <div className="cr-ticketCut" />

              <div className="cr-total">
                <span>Total</span>
                <strong>{costText}</strong>
              </div>

              <button className="cr-back" type="button" onClick={backToSlots}>
                ← Back to time slots
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}