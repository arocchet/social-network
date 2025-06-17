import { LoginGridPhoto } from "@/components/login/login-grid-photo";
import FormOnboardingPage from "@/components/onboarding/onboarding";
import { getUserByIdServer } from "@/lib/server/user/getUser";
import { headers } from "next/headers";

export default async function OnboardingPag() {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');
    const user = await getUserByIdServer(userId!);
    console.log(user)
    return (
        <div className="flex w-full h-screen">
            <div className="w-full h-full">
                <FormOnboardingPage />
            </div>
            <div className="w-6/12 h-full hidden md:block bg-muted bg-cover bg-center">
                <LoginGridPhoto />
            </div>
        </div>
    )
}