import { UserFormProvider } from "@/app/context/user-register-form-context";
import OnBoarding from "@/components/onboarding/OnBoarding";
import ProfilDemoRender from "@/components/register/profil-demo-render.tsx/profil-demo-render";
import Link from "next/link"

interface UserInfoType {
  email?: string;
  firstname?: string;
  lastname?: string;
  username?: string;
  avatar?: string;
  googleId?: string;
  birthday?: string;
}

export default function OnboardingPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const userInfo: UserInfoType = {
    email: "searchParams.email",
    firstname: undefined,
    lastname:undefined,
    username: "searchParams.username",
    avatar: undefined,//"searchParams.avatar",
    googleId: "searchParams.googleId",
    birthday: "searchParams.birthday",
  };

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
              <OnBoarding obj={userInfo} />
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
