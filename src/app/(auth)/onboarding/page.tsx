import { getFormSteps } from "@/app/utils/formStep";
import { UserSchemas } from "@/lib/schemas/user";
import { getUserByIdServer } from "@/lib/server/user/getUser";

import dynamic from "next/dynamic";
import { headers } from "next/headers";

import type { UserEditable } from "@/lib/schemas/user/editable";
import AppLoader from "@/components/ui/app-loader";


const LoginGridPhoto = dynamic(() => import("@/components/login/login-grid-photo"), { loading: () => <AppLoader /> })
const FormOnboardingPage = dynamic(() => import("@/components/onboarding/onboarding"))

export default async function OnboardingPag() {
    const headersList = await headers();
    const userId = headersList.get('x-user-id');

    if (!userId) {
        throw new Error("User ID missing in headers");
    }

    const user = await getUserByIdServer<UserEditable>(userId, UserSchemas.Editable);

    if (!user) {
        return <div>User not found</div>;
    }

    const formSteps = getFormSteps(user);

    return (
        <div className="flex w-full h-screen">
            <div className="w-full h-full">
                <FormOnboardingPage formSteps={formSteps} />
            </div>
            <div className="w-6/12 h-full hidden md:block bg-muted bg-cover bg-center">
                <LoginGridPhoto />
            </div>
        </div>
    );
}