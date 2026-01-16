import { useState } from "react";
import { Routes, Route } from "react-router-dom";

import UserLayout from "./pages/UserLayout";

import Home from "./pages/Home";
import Clubs from "./pages/Clubs";
import Courts from "./pages/Courts";
import ClubDetails from "./pages/ClubDetails";
import CourtDetails from "./pages/CourtDetails";
import Contact from "./pages/Contact";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

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

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/courts" element={<Courts />} />
        <Route path="/contact" element={<Contact />} />

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
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}