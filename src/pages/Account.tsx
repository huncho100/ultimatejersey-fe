import { Link, useNavigate } from "react-router-dom";

import Container from "../components/ui/Container";
import SectionTitle from "../components/ui/SectionTitle";
import Button from "../components/ui/Button";

import { useAuth } from "../context/AuthContext";

export default function Account() {
  const navigate = useNavigate();

  const {
    user,
    logout,
    loading,
    isAuthenticated,
  } = useAuth();

  /**
   * ------------------------------------------
   * Loading
   * ------------------------------------------
   */

  if (loading) {
    return (
      <section className="min-h-screen bg-slate-50 py-16">
        <Container>
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-600">
              Loading your account...
            </p>
          </div>
        </Container>
      </section>
    );
  }

  /**
   * ------------------------------------------
   * Not Authenticated
   * ------------------------------------------
   */

  if (!isAuthenticated || !user) {
    return (
      <section className="min-h-screen bg-slate-50 py-16">
        <Container>
          <SectionTitle
            title="My Account"
            subtitle="Sign in to access your account."
            align="left"
          />

          <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-600">
              You are not currently signed in.
            </p>

            <div className="mt-6 flex justify-center gap-3">
              <Link to="/login">
                <Button>
                  Sign In
                </Button>
              </Link>

              <Link to="/register">
                <Button variant="outline">
                  Create Account
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>
    );
  }

  /**
   * ------------------------------------------
   * Logout
   * ------------------------------------------
   */

  function handleLogout() {
    logout();
    navigate("/login");
  }

  /**
   * ------------------------------------------
   * Authenticated Account
   * ------------------------------------------
   */

  return (
    <section className="min-h-screen bg-slate-50 py-16">
      <Container>

        <SectionTitle
          title="My Account"
          subtitle="Manage your account and orders."
          align="left"
        />

        <div className="mt-10 grid gap-8 lg:grid-cols-[280px_1fr]">

          {/* =====================================
              Account Navigation
          ====================================== */}

          <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

            <div className="border-b border-slate-200 pb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-600">
                {user.firstName.charAt(0).toUpperCase()}
              </div>

              <h2 className="mt-4 text-xl font-bold text-slate-900">
                {user.firstName} {user.lastName}
              </h2>

              <p className="mt-1 break-words text-sm text-slate-500">
                {user.email}
              </p>
            </div>

            <nav className="mt-6 space-y-2">

              <Link
                to="/account"
                className="
                  block
                  rounded-lg
                  bg-blue-50
                  px-4
                  py-3
                  font-semibold
                  text-blue-600
                "
              >
                Account Overview
              </Link>

              <Link
                to="/orders"
                className="
                  block
                  rounded-lg
                  px-4
                  py-3
                  font-medium
                  text-slate-600
                  transition-colors
                  hover:bg-slate-50
                  hover:text-blue-600
                "
              >
                My Orders
              </Link>

              <Link
                to="/wishlist"
                className="
                  block
                  rounded-lg
                  px-4
                  py-3
                  font-medium
                  text-slate-600
                  transition-colors
                  hover:bg-slate-50
                  hover:text-blue-600
                "
              >
                Wishlist
              </Link>

            </nav>

            <div className="mt-6 border-t border-slate-200 pt-6">

              <Button
                variant="outline"
                fullWidth
                onClick={handleLogout}
              >
                Sign Out
              </Button>

            </div>

          </aside>

          {/* =====================================
              Account Content
          ====================================== */}

          <div className="space-y-8">

            {/* Welcome */}

            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

              <h2 className="text-2xl font-bold text-slate-900">
                Welcome back, {user.firstName}!
              </h2>

              <p className="mt-2 text-slate-600">
                Manage your account details, orders,
                and shopping preferences from here.
              </p>

            </div>

            {/* Personal Information */}

            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

              <div className="flex items-center justify-between gap-4">

                <h2 className="text-xl font-bold text-slate-900">
                  Personal Information
                </h2>

              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    First Name
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {user.firstName}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Last Name
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {user.lastName}
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <p className="text-sm font-medium text-slate-500">
                    Email Address
                  </p>

                  <p className="mt-1 font-semibold text-slate-900">
                    {user.email}
                  </p>
                </div>

                {user.role && (
                  <div>
                    <p className="text-sm font-medium text-slate-500">
                      Account Type
                    </p>

                    <p className="mt-1 font-semibold capitalize text-slate-900">
                      {user.role}
                    </p>
                  </div>
                )}

              </div>

            </div>

            {/* Quick Actions */}

            <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">

              <h2 className="text-xl font-bold text-slate-900">
                Quick Actions
              </h2>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">

                <Link to="/orders">
                  <div
                    className="
                      rounded-xl
                      border
                      border-slate-200
                      p-5
                      transition
                      hover:border-blue-300
                      hover:bg-blue-50
                    "
                  >
                    <h3 className="font-semibold text-slate-900">
                      My Orders
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      View your order history and
                      order status.
                    </p>
                  </div>
                </Link>

                <Link to="/wishlist">
                  <div
                    className="
                      rounded-xl
                      border
                      border-slate-200
                      p-5
                      transition
                      hover:border-blue-300
                      hover:bg-blue-50
                    "
                  >
                    <h3 className="font-semibold text-slate-900">
                      Wishlist
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      View products you have saved
                      for later.
                    </p>
                  </div>
                </Link>

              </div>

            </div>

          </div>

        </div>

      </Container>
    </section>
  );
}