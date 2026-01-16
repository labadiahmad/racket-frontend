import { useLocation, useNavigate } from "react-router-dom";
import "./reservationSuccess.css";

export default function ReservationSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();

  if (!state) {
    return (
      <div className="rs-page">
        <div className="rs-shell">
          <div className="rs-hero">
            <h1 className="rs-h1">No reservation found</h1>
            <p className="rs-sub">Go back and confirm a reservation first.</p>
          </div>
          <div className="rs-actions">
            <button className="rs-btn rs-primary" onClick={() => navigate("/clubs")}>
              Back to Clubs
            </button>
          </div>
        </div>
      </div>
    );
  }

  const {
    bookingId,
    clubName,
    courtName,
    date,
    time,
    cost,
    name,
    phone,
    players = [],
  } = state;

  return (
    <div className="rs-page">
      {/* Confetti */}
      <div className="rs-confetti">
        {Array.from({ length: 26 }).map((_, i) => (
          <span key={i} className="rs-confettiPiece" />
        ))}
      </div>

      <div className="rs-shell">
        {/* Hero */}
        <div className="rs-hero">
          <div className="rs-status rs-statusCenter">
            <span className="rs-statusIcon">✓</span>
            <span className="rs-statusText">Reservation Confirmed</span>
          </div>

          <h1 className="rs-h1">You’re all set!</h1>
          <p className="rs-sub">Your booking is confirmed. Keep this ticket for details.</p>
        </div>

        {/* Ticket */}
        <div className="rs-ticket">
          <div className="rs-ticketTop">
            <div>
              <div className="rs-ticketTitle">Reservation Ticket</div>
              <div className="rs-ticketMeta">Booking ID: {bookingId}</div>
            </div>

            <button className="rs-miniBtn" type="button" onClick={() => window.print()}>
              Print
            </button>
          </div>

          <div className="rs-grid">
            <div className="rs-item">
              <div className="rs-k">Club</div>
              <div className="rs-v">{clubName}</div>
            </div>

            <div className="rs-item">
              <div className="rs-k">Court</div>
              <div className="rs-v">{courtName}</div>
            </div>

            <div className="rs-item rs-soft">
              <div className="rs-k">Date</div>
              <div className="rs-v">{date}</div>
            </div>

            <div className="rs-item rs-soft">
              <div className="rs-k">Time</div>
              <div className="rs-v">{time}</div>
            </div>

            <div className="rs-totalBox">
              <div className="rs-k">Total</div>
              <div className="rs-total">{cost}</div>
            </div>
          </div>

          <div className="rs-divider" />

          <div className="rs-extraTitle">Player Details</div>
          <div className="rs-extraGrid">
            <div className="rs-miniCard">
              <div className="rs-k">Booked by</div>
              <div className="rs-v">{name}</div>
            </div>

            <div className="rs-miniCard">
              <div className="rs-k">Phone</div>
              <div className="rs-v">{phone}</div>
            </div>

            <div className="rs-miniCard rs-miniCardFull">
              <div className="rs-k">Players</div>
              <div className="rs-chips">
                {players.map((p, idx) => (
                  <span key={idx} className="rs-chip">{p}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="rs-next">
            <div className="rs-nextTitle">What happens next?</div>
            <ul className="rs-nextList">
              <li>Arrive 10 minutes early.</li>
              <li>Show your Booking ID at the club if needed.</li>
              <li>Cancellation must be at least 24 hours before the slot.</li>
            </ul>
          </div>

          <div className="rs-actions">
            <button className="rs-btn rs-primary" onClick={() => navigate("/clubs")}>
              Back to Clubs
            </button>
            <button className="rs-btn rs-ghost" onClick={() => navigate("/")}>
              Home
            </button>
          </div>

          <div className="rs-note">Thanks for using Racket.</div>
        </div>
      </div>
    </div>
  );
}