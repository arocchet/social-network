"use client"

import React, { useEffect, useState } from "react"
import { User } from "../feed/post/postCard"
import { createRandomUser } from "../feed/post/fakeUser"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogDescription,
    DialogHeader
} from "../ui/dialog"
import { ImageSwiper } from "./imageSwiper"

const Stories = () => {
    const [users, setUsers] = useState<User[]>([])
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
        const generated = Array.from({ length: 10 }, () => createRandomUser())
        setUsers(generated)
    }, [])

    if (!mounted) return null // ⛔ Ne rend rien tant que le client n’est pas monté

    const images = [
        'https://i.pinimg.com/736x/b4/ef/e9/b4efe9a7fcf4eaec0d17ec20f9610954.jpg',
        'https://ui.lukacho.com/_next/static/media/2.6a8dd51d.webp',
        'https://ui.lukacho.com/_next/static/media/3.d95288b3.webp',
        'https://ui.lukacho.com/_next/static/media/4.0de1e023.webp'
    ]

    return (
        <div className="w-full px-4 py-2 overflow-x-auto scrollbar-hide">
            <div className="flex space-x-4">
                {users.map((user, index) => (
                    <div key={index} className="flex flex-col items-center text-sm text-center">
                        <Dialog>
                            <DialogTrigger asChild>
                                <button className="relative w-16 h-16 rounded-full p-[2px]">
                                    <Avatar className="w-full h-full border-2 border-white shadow-sm">
                                        <AvatarImage
                                            src={user.avatar}
                                            alt={user.username}
                                            className="object-cover"
                                        />
                                        <AvatarFallback>{user.username[0]}</AvatarFallback>
                                    </Avatar>
                                </button>
                            </DialogTrigger>
                            <DialogContent className="p-0 h-[800px]">
                                <DialogHeader className="contents space-y-0 text-left">
                                    <DialogDescription asChild>

                                        <ImageSwiper images={images} />


                                    </DialogDescription>
                                </DialogHeader>
                            </DialogContent>
                        </Dialog>
                        <span className="mt-1 truncate max-w-[60px]">{user.username}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Stories
