import { Outlet } from "react-router-dom";
import AdminNav from "../components/AdminNav";

export default function AdminLayout() {
  return (
    <>
      <AdminNav />
      <Outlet />
    </>
  );
}