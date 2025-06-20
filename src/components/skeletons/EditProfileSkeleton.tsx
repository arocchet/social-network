"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function EditProfileSkeleton() {
    return (
        <div className="min-h-screen bg-[var(--bgLevel1)]">
            <header className="flex items-center gap-4 p-4 border-b sticky top-0 bg-[var(--bgLevel1)] z-40">
                <Button variant="ghost" size="icon">
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <h1 className="font-semibold text-lg">Modifier le profil</h1>
            </header>

            <div className="p-4 space-y-6 max-w-3xl mx-auto">
                <div className="flex flex-col items-center gap-4">
                    <Skeleton className="w-24 h-24 rounded-full" />
                    <Skeleton className="w-40 h-4" />
                </div>

                <div className="space-y-4">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i}>
                            <Skeleton className="w-32 h-4 mb-2" />
                            <Skeleton className="w-full h-10" />
                        </div>
                    ))}
                </div>

                <Skeleton className="w-full h-10" />
            </div>
        </div>
    )
}