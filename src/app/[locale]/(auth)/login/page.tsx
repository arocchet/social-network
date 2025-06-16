/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */

"use client";

import { siteConfig } from "../../../../../config/site";
import { LoginForm } from "@/components/login/login-form";
import { LoginGridPhoto } from "@/components/login/login-grid-photo";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2 w-full bg-[var(--bgLevel3)]">
      <div className="flex flex-col gap-4 p-8 md:p-10">
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
        <div className="flex flex-1 mt-25 justify-center">
          <div className="">
            <h1 className="flex items-center justify-center text-3xl text-center font-bold p-15 text-[var(--textNeutral)] ">
              Bon retour sur {siteConfig.name.toLocaleUpperCase()}
            </h1>
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden md:block w-full h-full bg-muted bg-cover bg-center">
        <LoginGridPhoto />
      </div>
    </div>
  );
}
