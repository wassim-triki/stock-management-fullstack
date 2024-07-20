import Link from "next/link";
import Image from "next/image";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PlaceholderContent({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Card className="mt-6 rounded-lg border-none shadow-sm">
      <CardHeader>{children}</CardHeader>
      <CardContent className="p-6">
        <div className="flex min-h-[calc(100vh-56px-64px-20px-24px-56px-48px)] items-center justify-center">
          <div className="relative flex flex-col">
            {/* <Image
              src="/placeholder.png"
              alt="Placeholder Image"
              width={500}
              height={500}
              priority
            /> */}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
