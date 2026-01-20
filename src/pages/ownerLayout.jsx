import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/AdminNav";

export default function OwnerLayout({ owner, setOwner }) {
  return (
    <>
      <AdminNavbar setOwner={setOwner} />
      <Outlet />
    </>
  );
}