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
    <section className="flex h-[calc(100vh-57px)] items-center justify-center">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <div className="flex justify-between">
            <CardTitle className="text-2xl">Login</CardTitle>
          </div>
          <CardDescription>
            Enter your email and password below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Login />
        </CardContent>
      </Card>
    </section>
  );
};

export default Page;
