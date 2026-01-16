import { Routes, Route } from "react-router-dom";
import UserLayout from "./pages/UserLayout";
import Home from "./pages/Home";

export default function App() {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
      </Route>
    </Routes>
  );
}