import { Link, Navigate, NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { adminService } from "../../services/adminService";
import { useAdminData } from "../../hooks/useAdminData";
import { AdminState, panelClass } from "./AdminShared";
import Button from "../ui/Button";

function VerifiedAdmin() {
  const auth = useAuth();
  const result = useAdminData(adminService.me);
  const allowed = result.data?.role === "admin" && result.data.is_active;
  if (result.loading || result.error) return (
    <div className="mx-auto max-w-xl p-6">
      <AdminState {...result} />
      {result.error && <Link className="mt-4 inline-block text-blue-700 underline" to="/login?next=/admin">Sign in again</Link>}
    </div>
  );
  if (!allowed) return <div role="alert" className="mx-auto max-w-xl p-8">
    <h1 className="text-2xl font-bold">Administrator access required</h1>
    <p className="my-4">Your account does not have permission to manage this store.</p>
    <Link className="text-blue-700 underline" to="/">Return to storefront</Link>
  </div>;

  return <div className="min-h-screen bg-slate-50 text-slate-900">
    <header className="border-b border-slate-200 bg-slate-900 text-white">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-5 sm:px-6">
        <Link to="/admin" className="text-xl font-extrabold">UltimateKits <span className="text-amber-400">Admin</span></Link>
        <div className="flex items-center gap-4">
          <Link className="underline" to="/">Storefront</Link>
          <Button size="sm" variant="outline" onClick={auth.logout}>Sign out</Button>
        </div>
      </div>
    </header>
    <div className="mx-auto grid max-w-7xl gap-6 p-4 sm:p-6 lg:grid-cols-[200px_minmax(0,1fr)]">
      <aside>
        <nav aria-label="Admin navigation" className={`${panelClass} flex flex-wrap gap-2 lg:flex-col`}>
          {["Dashboard", "Products", "Inventory", "Orders", "Customers", "Reports"].map((label, index) =>
            <NavLink key={label} end={index === 0} to={index === 0 ? "/admin" : `/admin/${label.toLowerCase()}`}
              className={({ isActive }) => `rounded-lg px-3 py-2 font-semibold ${isActive ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-100"}`}>
              {label}
            </NavLink>)}
        </nav>
      </aside>
      <main className="min-w-0 space-y-6"><Outlet /></main>
    </div>
  </div>;
}

export default function AdminLayout() {
  const { loading, isAuthenticated } = useAuth();
  if (loading) return <p role="status" className="p-8">Checking session...</p>;
  if (!isAuthenticated) return <Navigate to="/login?next=/admin" replace />;
  return <VerifiedAdmin />;
}
