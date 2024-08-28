import AuthLayout from "@/components/layouts/auth-layout";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type PageProps = {
  params: { token: string };
};

const ResetPasswordPage = ({ params: { token } }: PageProps) => {
  return (
    <AuthLayout
      title="Reset Password"
      description="Enter your new password below to reset your account password."
    >
      <ResetPasswordForm token={token} />
    </AuthLayout>
  );
};

export default ResetPasswordPage;
