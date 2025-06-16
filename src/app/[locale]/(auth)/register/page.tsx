"use client";

import { RegisterForm } from "@/components/register/register-form";
import ProfilDemoRender from "@/components/register/profil-demo-render.tsx/profil-demo-render";
import { UserFormProvider } from "../../context/user-register-form-context";
import Link from "next/link";
import { useIsMounted } from "@/hooks/use-is-mounted";

export default function RegisterPage() {
  const isMounted = useIsMounted();

  if (!isMounted) return null;
  return (
    <UserFormProvider>
      <div className="grid min-h-svh lg:grid-cols-2 bg-[var(--bgLevel3)]">
        <div className="flex flex-col gap-4 p-6 md:p-10">
          <div className="flex justify-center gap-2 md:justify-start">
            <Link href="/" className="flex items-center gap-2 font-medium">
              <div className="flex items-center space-x-3">
                <img
                  src={"/konekt-logo-full.png"}
                  className="w-32 h-auto block"
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
          <ProfilDemoRender />
        </div>
      </div>
    </UserFormProvider>
  );
}
