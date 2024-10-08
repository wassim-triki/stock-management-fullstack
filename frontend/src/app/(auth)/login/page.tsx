import AuthLayout from "@/components/layouts/auth-layout";
import Login from "@/components/login";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const Page = async () => {
  return (
    <AuthLayout
      title="Login"
      description=" Enter your email and password below to login to your account."
    >
      <Login />
    </AuthLayout>
  );
};

export default Page;
