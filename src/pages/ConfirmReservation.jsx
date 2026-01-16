import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./confirmReservation.css";

export default function ConfirmReservation({ reservationDraft, setReservations, user, setUser }) {  
    
  const navigate = useNavigate();
  const { state } = useLocation();

  const data = state || reservationDraft;

  const isValidDraft =
    data &&
    data.clubId &&
    data.courtId &&
    data.clubName &&
    data.courtName &&
    data.pickedDateISO &&
    data.pickedSlot &&
    data.pickedSlot.from &&
    data.pickedSlot.to &&
    typeof data.pickedSlot.price !== "undefined";

  const [bookingId] = useState(() => {
    const n = Math.floor(1000 + Math.random() * 9000);
    return `TMP-${n}`;
  });

const [firstName, setFirstName] = useState(user?.firstName || "");
const [lastName, setLastName] = useState(user?.lastName || "");
const [phone, setPhone] = useState(user?.phone || "");

  const [p2, setP2] = useState("");
  const [p3, setP3] = useState("");
  const [p4, setP4] = useState("");

  const [agree, setAgree] = useState(false);

  const player1 = `${firstName} ${lastName}`.trim();

  const errors = {};

  if (!firstName.trim()) errors.firstName = "First name is required.";
  if (!lastName.trim()) errors.lastName = "Last name is required.";

  const rawPhone = (phone || "").replace(/\s/g, "");
  const okPhone = /^07\d{8}$/.test(rawPhone);

  if (!rawPhone) errors.phone = "Phone number is required.";
  else if (!okPhone) errors.phone = "Phone number must be in this format: 07XXXXXXXX";

  if (!agree) errors.agree = "You must agree to the booking policy.";

  const canSubmit = Object.keys(errors).length === 0;

  const pickedDateObj = isValidDraft ? new Date(data.pickedDateISO) : null;
  const pickedDateText = pickedDateObj ? pickedDateObj.toLocaleDateString() : "-";

  useEffect(() => {
    if (!isValidDraft) return;
  }, [isValidDraft]);

 const backToSlots = () => {
  if (data?.returnTo) {
    navigate(data.returnTo, { state: { goToStep: "slots" } });
  } else {
    navigate(-1);
  }
};
 const handleSubmit = (e) => {
  e.preventDefault();
  if (!canSubmit || !isValidDraft) return;

  const slot = data.pickedSlot;
  const timeText = `${slot.from} – ${slot.to}`;
  const costText = `${slot.price}JD`;

  const newReservation = {
    id: `R-${Date.now()}`,
    clubId: data.clubId,
    clubName: data.clubName,
    clubLogo: data.clubLogo || "",
    courtId: data.courtId,
    courtName: data.courtName,
    courtImage: data.courtImage || "",
    dateISO: data.pickedDateISO,
    slot: data.pickedSlot,
    status: "Active",
    bookedBy: player1,
    phone: rawPhone,
    players: [player1, p2, p3, p4].filter((x) => x && x.trim()),
  };

  if (setReservations) {
    setReservations((prev) => [newReservation, ...prev]);
  }

  if (setUser) {
    setUser((prev) => ({
      ...prev,
      firstName,
      lastName,
      phone: rawPhone,
    }));
  }

  navigate("/reservation-success", {
    state: {
      bookingId,
      clubId: data.clubId,
      clubName: data.clubName,
      courtId: data.courtId,
      courtName: data.courtName,
      date: pickedDateText,
      time: timeText,
      cost: costText,
      name: player1,
      phone: rawPhone,
      players: [player1, p2, p3, p4].filter((x) => x && x.trim()),
    },
  });
};

  if (!isValidDraft) {
    return (
      <div className="cr-page">
        <div className="cr-wrap">
          <div className="cr-card">
            <h2 className="cr-title">No reservation selected</h2>
            <p className="cr-sub">Go back and pick a date and time first.</p>
            <button className="cr-btn" onClick={() => navigate(-1)} type="button">
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
        {/* HEADER */}
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

        {/* BODY */}
        <div className="cr-layout">
          {/* LEFT FORM */}
          <form className="cr-card" onSubmit={handleSubmit}>
            <div className="cr-section">
              <div className="cr-sectionTitle">Your Details</div>
              <p className="cr-sectionSub">We’ll use this to confirm your booking.</p>

              <div className="cr-grid2">
                <div className="cr-field">
                  <label>First Name *</label>
                  <input value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="First name" />
                  {errors.firstName && <div className="cr-err">{errors.firstName}</div>}
                </div>

                <div className="cr-field">
                  <label>Last Name *</label>
                  <input value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Last name" />
                  {errors.lastName && <div className="cr-err">{errors.lastName}</div>}
                </div>
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
            </div>

            <button className="cr-btn" type="submit" disabled={!canSubmit}>
              Confirm Reservation
            </button>
          </form>

          {/* RIGHT SUMMARY */}
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