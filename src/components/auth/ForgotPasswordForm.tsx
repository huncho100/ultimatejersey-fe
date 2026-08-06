import { useState } from "react";
import { Link } from "react-router-dom";

import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";

export default function ForgotPasswordForm() {
  const { forgotPassword } = useAuth();

  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);

      await forgotPassword({
        email,
      });

      setSuccess(
        "If an account exists with that email, a password reset link has been sent."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to send reset email."
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
        <div className="rounded-xl border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-300 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

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
          required
          autoComplete="email"
          disabled={loading}
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
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
            disabled:cursor-not-allowed
            disabled:bg-slate-100
          "
        />

      </div>

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={loading}
      >
        {loading
          ? "Sending..."
          : "Send Reset Link"}
      </Button>

      <p className="text-center text-sm text-slate-600">

        Remember your password?

        <Link
          to="/login"
          className="ml-2 font-semibold text-blue-600 hover:underline"
        >
          Sign In
        </Link>

      </p>

    </form>
  );
}