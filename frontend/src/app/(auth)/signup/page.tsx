import AuthLayout from "@/components/layouts/auth-layout";
import Login from "@/components/login";
import Signup from "@/components/signup";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { LogIn } from "lucide-react";

const Page = async () => {
  return (
    <AuthLayout
      title="Signup"
      description="Enter your information below to get started."
    >
      <Signup />
    </AuthLayout>
  );
};

export default Page;
