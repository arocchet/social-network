'use client'

import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"

export function OAuthLoginButton() {
    const handleLoginWithGoogle = () => {
        window.location.href = "/api/auth/redirect/google"
    }

    return (
        <Button
            type="button"
            onClick={handleLoginWithGoogle}
            className="w-full border border-[var(--detailMinimal)] bg-white text-black hover:bg-gray-100 flex items-center justify-center gap-2"
        >
            <FcGoogle size={18} />
            Continuer avec Google
        </Button>
    )
}