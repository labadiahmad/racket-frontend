import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import UserLayout from "./pages/UserLayout";
import AdminLayout from "./pages/AdminLayout";

import Home from "./pages/Home";
import Clubs from "./pages/Clubs";
import Courts from "./pages/Courts";
import ClubDetails from "./pages/ClubDetails";
import CourtDetails from "./pages/CourtDetails";
import ConfirmReservation from "./pages/ConfirmReservation";
import ReservationSuccess from "./pages/ReservationSuccess";
import Profile from "./pages/Profile";
import Contact from "./pages/Contact";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

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
  const [reservationDraft, setReservationDraft] = useState({
    clubId: null,
    clubName: "",
    clubLogo: "",
    courtId: "",
    courtName: "",
    courtImage: "",
    pickedDateISO: null,
    pickedSlotId: null,
    pickedSlot: null,
  });

  const [user, setUser] = useState({
    id: "1",
    firstName: "Nour",
    lastName: "Abusoud",
    email: "nour@gmail.com",
    phone: "0790000000",
    city: "Amman",
    photo: "",
  });

  const [reservations, setReservations] = useState([]);

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* User Layout */}
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/courts" element={<Courts />} />
        <Route path="/contact" element={<Contact />} />

        <Route
          path="/profile"
          element={
            <Profile
              user={user}
              setUser={setUser}
              reservations={reservations}
              setReservations={setReservations}
            />
          }
        />

        <Route
          path="/clubs/:id"
          element={
            <ClubDetails
              user={user}
              reservationDraft={reservationDraft}
              setReservationDraft={setReservationDraft}
            />
          }
        />

        <Route
          path="/clubs/:clubId/courts/:courtId"
          element={
            <CourtDetails
              user={user}
              reservationDraft={reservationDraft}
              setReservationDraft={setReservationDraft}
            />
          }
        />

        <Route
          path="/confirm-reservation"
          element={
            <ConfirmReservation
              reservationDraft={reservationDraft}
              setReservations={setReservations}
              user={user}
              setUser={setUser}
            />
          }
        />

        <Route path="/reservation-success" element={<ReservationSuccess />} />
      </Route>

      <Route path="/admin" element={<AdminLayout />}>
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