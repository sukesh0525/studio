import { GovConnectLogo } from "@/components/govconnect-logo";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-background p-4">
       <div className="absolute top-4 left-4">
        <Link href="/" className="flex items-center gap-2 text-primary">
          <GovConnectLogo className="h-8 w-8" />
          <h1 className="text-xl font-bold">GovConnect</h1>
        </Link>
      </div>
      {children}
    </div>
  );
}
