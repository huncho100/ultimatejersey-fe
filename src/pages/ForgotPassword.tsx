import AuthLayout from "../components/auth/AuthLayout";
import ForgotPasswordForm from "../components/auth/ForgotPasswordForm";

export default function ForgotPassword() {
  return (
    <AuthLayout
      title="Forgot Password?"
      subtitle="Enter your email address and we'll send you a password reset link."
    >
      <ForgotPasswordForm />
    </AuthLayout>
  );
}