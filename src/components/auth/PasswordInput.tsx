import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface PasswordInputProps {
  id?: string;
  name?: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  required?: boolean;
  autoComplete?: string;
  error?: string;
}

export default function PasswordInput({
  id,
  name,
  label,
  placeholder = "Enter your password",
  value,
  onChange,
  required = false,
  autoComplete = "current-password",
  error,
}: PasswordInputProps) {
  const [showPassword, setShowPassword] =
    useState(false);

  return (
    <div className="space-y-2">

      <label
        htmlFor={id}
        className="block text-sm font-semibold text-slate-700"
      >
        {label}
      </label>

      <div className="relative">

        <input
          id={id}
          name={name}
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={onChange}
          required={required}
          autoComplete={autoComplete}
          placeholder={placeholder}
          className={`
            w-full
            rounded-xl
            border
            px-4
            py-3
            pr-12
            text-slate-900
            transition-all
            duration-200
            focus:outline-none
            focus:ring-2
            ${
              error
                ? "border-red-500 focus:border-red-500 focus:ring-red-200"
                : "border-slate-300 focus:border-blue-500 focus:ring-blue-200"
            }
          `}
        />

        <button
          type="button"
          onClick={() =>
            setShowPassword((prev) => !prev)
          }
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-slate-400
            transition-colors
            hover:text-blue-600
          "
          aria-label={
            showPassword
              ? "Hide password"
              : "Show password"
          }
        >
          {showPassword ? (
            <EyeOff size={20} />
          ) : (
            <Eye size={20} />
          )}
        </button>

      </div>

      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

    </div>
  );
}