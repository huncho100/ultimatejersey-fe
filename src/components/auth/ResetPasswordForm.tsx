import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import PasswordInput from "./PasswordInput";
import Button from "../ui/Button";

import { useAuth } from "../../context/AuthContext";

export default function ResetPasswordForm() {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();

  const token = searchParams.get("token") || "";

  const { resetPassword } = useAuth();

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  function updateField(
    field: keyof typeof form,
    value: string
  ) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent
  ) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!token) {
      setError("Invalid or expired reset link.");
      return;
    }

    if (!form.password || !form.confirmPassword) {
      setError("Please complete all fields.");
      return;
    }

    if (form.password.length < 8) {
      setError(
        "Password must be at least 8 characters."
      );
      return;
    }

    if (
      form.password !== form.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      await resetPassword({
        token,
        password: form.password,
        confirmPassword: form.confirmPassword,
      });

      setSuccess(
        "Password changed successfully! Redirecting to login..."
      );

      setTimeout(() => {
        navigate("/login");
      }, 2500);

    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reset password."
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

      {success && (
        <div
          className="
            rounded-xl
            border
            border-green-300
            bg-green-50
            px-4
            py-3
            text-sm
            text-green-700
          "
        >
          {success}
        </div>
      )}

      <PasswordInput
        id="password"
        label="New Password"
        placeholder="Enter your new password"
        value={form.password}
        onChange={(value) =>
          updateField("password", value)
        }
        required
        autoComplete="new-password"
        disabled={loading}
      />

      <PasswordInput
        id="confirmPassword"
        label="Confirm Password"
        placeholder="Confirm your new password"
        value={form.confirmPassword}
        onChange={(value) =>
          updateField(
            "confirmPassword",
            value
          )
        }
        required
        autoComplete="new-password"
        disabled={loading}
      />

      <Button
        type="submit"
        size="lg"
        className="w-full"
        disabled={loading}
      >
        {loading
          ? "Updating Password..."
          : "Reset Password"}
      </Button>
    </form>
  );
}