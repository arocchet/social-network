'use client'
import Image from "next/image";

export default function AppLoaderTest() {
    return (
        <div className="fixed inset-0 z-5">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <Image
                    src="/konekt-logo-full.png"
                    alt="loading..."
                    width={128}
                    height={128}
                    className="animate-bounce"
                />
            </div>
        </div>
    );
}