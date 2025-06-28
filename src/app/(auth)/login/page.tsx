'use client';
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import AppLoader from "@/components/ui/app-loader";

const LoginGridPhoto = dynamic(() => import("@/components/login/login-grid-photo"), {
  ssr: false,
  loading: () => <AppLoader />,
});
const LoginForm = dynamic(() => import("@/components/login/login-form"), {
  ssr: false,

});

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2 w-full bg-[var(--bgLevel3)]">
      <div className="flex flex-col justify-center px-8 md:px-16 min-h-screen">
        <div className="flex justify-center md:justify-start mb-6">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <Image
              src={"/konekt-logo-full.png"}
              alt="Konekt-logo"
              width={128}
              height={128}
              priority
            />
          </Link>
        </div>

        <div className="flex flex-col gap-6 w-full mx-auto">
          <LoginForm />
        </div>
      </div>

      <div className="relative hidden md:block w-full h-full bg-muted bg-cover bg-center">
        <LoginGridPhoto />
      </div>
    </div>
  );
}