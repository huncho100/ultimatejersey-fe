import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import Button from "../ui/Button";
import PasswordInput from "./PasswordInput";
import { useAuth } from "../../context/AuthContext";

export default function LoginForm() {
  const navigate = useNavigate();

  const { login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [rememberMe, setRememberMe] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setError("");

    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setLoading(true);

      await login({
        email,
        password,
      });

      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Login failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {error && (
        <div
          className="
            rounded-xl
            border
            border-red-300
            bg-red-50
            px-4
            py-3
            text-sm
            text-red-700
          "
        >
          {error}
        </div>
      )}

      {/* Email */}

      <div className="space-y-2">

        <label
          htmlFor="email"
          className="block text-sm font-semibold text-slate-700"
        >
          Email Address
        </label>

        <input
          id="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="
            w-full
            rounded-xl
            border
            border-slate-300
            px-4
            py-3
            transition-all
            duration-200
            focus:border-blue-500
            focus:outline-none
            focus:ring-2
            focus:ring-blue-200
          "
        />

      </div>

      {/* Password */}

      <PasswordInput
        id="password"
        label="Password"
        value={password}
        onChange={(e) =>
          setPassword(e.target.value)
        }
        required
      />

      {/* Remember Me + Forgot Password */}

      <div className="flex items-center justify-between">

        <label className="flex items-center gap-2 text-sm text-slate-600">

          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(e) =>
              setRememberMe(e.target.checked)
            }
            className="
              h-4
              w-4
              rounded
              border-slate-300
              text-blue-600
              focus:ring-blue-500
            "
          />

          Remember me

        </label>

        <Link
          to="/forgot-password"
          className="
            text-sm
            font-semibold
            text-blue-600
            hover:text-blue-700
          "
        >
          Forgot password?
        </Link>

      </div>

      {/* Login Button */}

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Signing In..." : "Sign In"}
      </Button>

      {/* Divider */}

      <div className="relative py-2">

        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-slate-300" />
        </div>

        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-sm text-slate-500">
            or
          </span>
        </div>

      </div>

      {/* Google Login (UI only) */}

      <button
        type="button"
        className="
          flex
          w-full
          items-center
          justify-center
          rounded-xl
          border
          border-slate-300
          bg-white
          px-4
          py-3
          font-semibold
          transition-all
          duration-300
          hover:border-blue-500
          hover:bg-slate-50
        "
      >
        Continue with Google
      </button>

      {/* Register */}

      <p className="text-center text-sm text-slate-600">

        Don't have an account?{" "}

        <Link
          to="/register"
          className="
            font-semibold
            text-blue-600
            hover:text-blue-700
          "
        >
          Create one
        </Link>

      </p>

    </form>
  );
}