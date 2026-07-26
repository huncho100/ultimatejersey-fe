import AuthLayout from "../components/auth/AuthLayout";
import LoginForm from "../components/auth/LoginForm";

export default function Login() {
  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your Ultimate Kits account to continue shopping."
    >
      <LoginForm />
    </AuthLayout>
  );
}