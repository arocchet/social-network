import { LoginGridPhoto } from "@/components/login/login-grid-photo";
import FormOnboardingPage from "@/components/onboarding/test";

export default function OnboardingPag() {

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