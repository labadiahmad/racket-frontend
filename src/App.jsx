import { Routes, Route } from "react-router-dom";

import UserLayout from "./pages/UserLayout";

import Home from "./pages/Home";
import Clubs from "./pages/Clubs";
import Courts from "./pages/Courts";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import NotFound from "./pages/NotFound";



export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/clubs" element={<Clubs />} />
        <Route path="/courts" element={<Courts />} />
        <Route path="/contact" element={<Contact />} />


      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}