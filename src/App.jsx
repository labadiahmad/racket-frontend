import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import UserLayout from "./pages/UserLayout";
import AdminLayout from "./pages/AdminLayout";

import Login from "./pages/Login";
import Signup from "./pages/Signup.jsx";
import OwnerSignup from "./pages/OwnerSignup";

import Home from "./pages/Home";
import Clubs from "./pages/Clubs";
import Courts from "./pages/Courts";
import ClubDetails from "./pages/ClubDetails";
import CourtDetails from "./pages/CourtDetails";
import ConfirmReservation from "./pages/ConfirmReservation";
import ReservationSuccess from "./pages/ReservationSuccess";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";

import Admin from "./pages/Admin";
import AdminClub from "./pages/AdminClub";
import AdminCourts from "./pages/AdminCourts";
import AdminCourtDetails from "./pages/AdminCourtDetails";
import AdminReservations from "./pages/AdminReservations";
import AdminAddReservation from "./pages/AdminAddReservation";
import AdminReservationDetails from "./pages/AdminReservationDetails";
import AdminAddCourt from "./pages/AdminAddCourt";

import NotFound from "./pages/NotFound";

export default function App() {
  const [user, setUser] = useState(null);
  const [owner, setOwner] = useState(null);

  useEffect(() => {
    const rawUser = localStorage.getItem("user");
    const rawOwner = localStorage.getItem("owner");

    if (rawUser) {
      try {
        setUser(JSON.parse(rawUser));
      } catch {
        localStorage.removeItem("user");
      }
    }

    if (rawOwner) {
      try {
        setOwner(JSON.parse(rawOwner));
      } catch {
        localStorage.removeItem("owner");
      }
    }
  }, []);

  return (
    <Routes>
      {/* AUTH */}
      <Route
        path="/login"
        element={
          user || owner ? (
            <Navigate to="/" replace />
          ) : (
            <Login setUser={setUser} setOwner={setOwner} />
          )
        }
      />

      <Route
        path="/signup"
        element={user ? <Navigate to="/" replace /> : <Signup />}
      />

      <Route path="/admin/signup" element={<OwnerSignup />} />

      {/* USER LAYOUT */}
      <Route
        element={
          <UserLayout
            user={user}
            setUser={setUser}
            owner={owner}
            setOwner={setOwner}
          />
        }
      >
        <Route path="/" element={<Home />} />
        <Route path="clubs" element={<Clubs />} />
        <Route path="courts" element={<Courts />} />
        <Route path="contact" element={<Contact />} />

        <Route
          path="profile"
          element={
            user ? (
              <Profile user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="clubs/:id" element={<ClubDetails user={user} />} />
        <Route
          path="clubs/:clubId/courts/:courtId"
          element={<CourtDetails user={user} />}
        />

        <Route
          path="confirm-reservation"
          element={
            user ? (
              <ConfirmReservation user={user} setUser={setUser} />
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />

        <Route path="reservation-success" element={<ReservationSuccess />} />
      </Route>

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          owner ? (
            <AdminLayout owner={owner} setOwner={setOwner} />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      >
        <Route index element={<Admin />} />
        <Route path="club" element={<AdminClub />} />
        <Route path="courts" element={<AdminCourts />} />
        <Route path="courts/add" element={<AdminAddCourt />} />
        <Route path="courts/:courtId" element={<AdminCourtDetails />} />
        <Route path="reservations" element={<AdminReservations />} />
        <Route path="reservations/add" element={<AdminAddReservation />} />
        <Route path="reservations/:bookingId" element={<AdminReservationDetails />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}