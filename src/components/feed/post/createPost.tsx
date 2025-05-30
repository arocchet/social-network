"use client"

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Plus } from "lucide-react"
import React from "react"


const CreatePost: React.FC = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <button className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-[var(--bgLevel1)] text-[var(--textNeutral)]">
                    <Plus className="h-5 w-5" />
                    Créer
                </button>
            </DialogTrigger>

            <DialogContent className="p-6 w-full max-w-4xl">
                <DialogHeader>
                    <DialogTitle>Créer un post</DialogTitle>
                    <DialogDescription>Écris quelque chose inspirant !</DialogDescription>
                </DialogHeader>


            </DialogContent>
        </Dialog>
    )
}

export default CreatePost
