import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

/* Layouts */
import UserLayout from "./pages/UserLayout";
import OwnerLayout from "./pages/ownerLayout.jsx";

/* Auth */
import Login from "./pages/Login";
import Signup from "./pages/Signup.jsx";
import OwnerSignup from "./pages/OwnerSignup.jsx";

/* User pages */
import Home from "./pages/Home";
import Clubs from "./pages/Clubs";
import Courts from "./pages/Courts";
import ClubDetails from "./pages/ClubDetails";
import CourtDetails from "./pages/CourtDetails";
import ConfirmReservation from "./pages/ConfirmReservation";
import ReservationSuccess from "./pages/ReservationSuccess";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";

/* Owner pages */
import OwnerHome from "./pages/ownerHome.jsx";
import OwnerClub from "./pages/ownerClub.jsx";
import OwnerCourts from "./pages/ownerCourts.jsx";
import OwnerCourtDetails from "./pages/ownerCourtDetails.jsx";
import OwnerReservations from "./pages/ownerReservations.jsx";
import OwnerAddReservation from "./pages/ownerAddReservation.jsx";
import OwnerReservationDetails from "./pages/ownerReservationDetails.jsx";
import OwnerAddCourt from "./pages/ownerAddCourt.jsx";

import NotFound from "./pages/NotFound";

function safeParse(raw) {
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export default function App() {
  const [user, setUser] = useState(null);
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    const rawOwner = localStorage.getItem("owner");

    const u = rawUser ? safeParse(rawUser) : null;
    const o = rawOwner ? safeParse(rawOwner) : null;

    if (u) setUser(u);
    if (o) setOwner(o);

    if (!u) localStorage.removeItem("user");
    if (!o) localStorage.removeItem("owner");
  }, []);

  const ownerOnboarding = localStorage.getItem("ownerOnboarding") === "1";

  return (
    <Routes>
      {/* AUTH */}
      <Route
        path="/login"
        element={
          owner ? (
            <Navigate to="/admin" replace />
          ) : user ? (
            <Navigate to="/" replace />
          ) : (
            <Login setUser={setUser} setOwner={setOwner} />
          )
        }
      />

      <Route
        path="/signup"
        element={
          owner ? (
            <Navigate to="/admin" replace />
          ) : user ? (
            <Navigate to="/" replace />
          ) : (
            <Signup />
          )
        }
      />

      {/* OWNER SIGNUP (2 steps) */}
      <Route
        path="/admin/signup"
        element={
          owner && !ownerOnboarding ? (
            <Navigate to="/admin" replace />
          ) : (
            <OwnerSignup setOwner={setOwner} />
          )
        }
      />

      {/* USER AREA (BLOCK OWNER FROM ENTERING) */}
      <Route
        element={
          owner ? (
            <Navigate to="/admin" replace />
          ) : (
            <UserLayout user={user} setUser={setUser} owner={owner} setOwner={setOwner} />
          )
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="clubs" element={<Clubs />} />
        <Route path="courts" element={<Courts />} />
        <Route path="contact" element={<Contact />} />

        <Route
          path="profile"
          element={user ? <Profile user={user} setUser={setUser} /> : <Navigate to="/login" replace />}
        />

        <Route path="clubs/:id" element={<ClubDetails user={user} />} />
        <Route path="clubs/:clubId/courts/:courtId" element={<CourtDetails user={user} />} />

        <Route
          path="confirm-reservation"
          element={user ? <ConfirmReservation user={user} setUser={setUser} /> : <Navigate to="/login" replace />}
        />

        <Route path="reservation-success" element={<ReservationSuccess />} />
      </Route>

      {/* OWNER AREA */}
      <Route
        path="/admin"
        element={owner ? <OwnerLayout owner={owner} setOwner={setOwner} /> : <Navigate to="/login" replace />}
      >
        <Route index element={<OwnerHome />} />
        <Route path="club" element={<OwnerClub />} />
        <Route path="courts" element={<OwnerCourts />} />
        <Route path="courts/add" element={<OwnerAddCourt />} />
        <Route path="courts/:courtId" element={<OwnerCourtDetails />} />
        <Route path="reservations" element={<OwnerReservations />} />
        <Route path="reservations/add" element={<OwnerAddReservation />} />
        <Route path="reservations/:bookingId" element={<OwnerReservationDetails />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}