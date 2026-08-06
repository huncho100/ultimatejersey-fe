import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PasswordInput from "./PasswordInput";
import { useAuth } from "../../context/AuthContext";

export default function RegisterForm() {
  const navigate = useNavigate();

  const { register } = useAuth();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [acceptTerms, setAcceptTerms] =
    useState(false);

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

    if (
      !form.firstName ||
      !form.lastName ||
      !form.email ||
      !form.password ||
      !form.confirmPassword
    ) {
      setError("Please complete all fields.");
      return;
    }

    if (
      form.password !== form.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    if (!acceptTerms) {
      setError(
        "Please accept the Terms & Conditions."
      );
      return;
    }

    try {
      setLoading(true);

      await register(form);

      navigate("/");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Registration failed."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
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

      <div className="grid grid-cols-2 gap-4">

        <div>
          <label
            htmlFor="firstName"
            className="mb-2 block font-medium text-slate-700"
          >
            First Name
          </label>

          <input
            id="firstName"
            type="text"
            required
            autoComplete="given-name"
            disabled={loading}
            value={form.firstName}
            onChange={(e) =>
              updateField(
                "firstName",
                e.target.value
              )
            }
            placeholder="John"
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              px-4
              py-3
              outline-none
              transition
              focus:border-blue-600
              disabled:cursor-not-allowed
              disabled:bg-slate-100
            "
          />
        </div>

        <div>
          <label
            htmlFor="lastName"
            className="mb-2 block font-medium text-slate-700"
          >
            Last Name
          </label>

          <input
            id="lastName"
            type="text"
            required
            autoComplete="family-name"
            disabled={loading}
            value={form.lastName}
            onChange={(e) =>
              updateField(
                "lastName",
                e.target.value
              )
            }
            placeholder="Doe"
            className="
              w-full
              rounded-xl
              border
              border-slate-300
              px-4
              py-3
              outline-none
              transition
              focus:border-blue-600
              disabled:cursor-not-allowed
              disabled:bg-slate-100
            "
          />
        </div>

      </div>

      <div>
        <label
          htmlFor="email"
          className="mb-2 block font-medium text-slate-700"
        >
          Email Address
        </label>

        <input
          id="email"
          type="email"
          required
          autoComplete="email"
          disabled={loading}
          value={form.email}
          onChange={(e) =>
            updateField(
              "email",
              e.target.value
            )
          }
          placeholder="you@example.com"
          className="
            w-full
            rounded-xl
            border
            border-slate-300
            px-4
            py-3
            outline-none
            transition
            focus:border-blue-600
            disabled:cursor-not-allowed
            disabled:bg-slate-100
          "
        />
      </div>

      <PasswordInput
        id="password"
        label="Password"
        placeholder="Create a password"
        value={form.password}
        onChange={(e) =>
          updateField(
            "password",
            e.target.value
          )
        }
        required
        autoComplete="new-password"
      />

      <PasswordInput
        id="confirmPassword"
        label="Confirm Password"
        placeholder="Confirm your password"
        value={form.confirmPassword}
        onChange={(e) =>
          updateField(
            "confirmPassword",
            e.target.value
          )
        }
        required
        autoComplete="new-password"
      />

      <label className="flex items-center gap-3 text-sm text-slate-600">

        <input
          type="checkbox"
          checked={acceptTerms}
          disabled={loading}
          onChange={(e) =>
            setAcceptTerms(
              e.target.checked
            )
          }
        />

        I agree to the{" "}

        <span className="font-medium text-blue-600">
          Terms & Conditions
        </span>

      </label>

      <button
        type="submit"
        disabled={loading}
        className="
          w-full
          rounded-xl
          bg-blue-600
          py-3
          text-lg
          font-semibold
          text-white
          transition
          hover:bg-blue-700
          disabled:cursor-not-allowed
          disabled:opacity-70
        "
      >
        {loading
          ? "Creating Account..."
          : "Create Account"}
      </button>

      <p className="text-center text-sm text-slate-500">

        Already have an account?

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