'use client';
import { UserFormProvider } from "../../context/user-register-form-context";
import Link from "next/link";
import dynamic from "next/dynamic";
import { useIsMounted } from "@/hooks/use-is-mounted";
import AppLoader from "@/components/ui/app-loader";
import Image from "next/image";

const ProfileDemoRender = dynamic(() => import("@/components/register/profil-demo-render.tsx/profil-demo-render"));
const RegisterForm = dynamic(() => import("@/components/register/register-form"))

export default function RegisterPage() {
  const mounted = useIsMounted();
  if (!mounted) return <AppLoader />;
  return (
    <UserFormProvider>
      <div className="grid min-h-svh lg:grid-cols-2 bg-[var(--bgLevel3)]">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <Link href="/" className="flex items-center gap-2 font-medium">
              <div className="flex items-center space-x-3">
                <Image
                  width={128}
                  height={128}
                  src={"/konekt-logo-full.png"}
                  alt="konekt-logo-full"
                />
              </div>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-center">
            <div className="w-full ">
              <RegisterForm />
            </div>
          </div>
        </div>
        <div className="relative hidden lg:block border-l">
          <ProfileDemoRender />
        </div>
      </div>
    </UserFormProvider>
  );
}
