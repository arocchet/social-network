"use client"


import { GalleryVerticalEnd } from "lucide-react"
import Image from "next/image"
import { siteConfig } from "../../../config/site"
import { LoginForm } from "@/components/login/Login"


export default function LoginPage() {
    return (
        <div className="grid min-h-screen lg:grid-cols-2 w-full">
            <div className="flex flex-col gap-4 p-8 md:p-10">
                
                <div className="flex justify-center gap-2 md:justify-start">
                    <a href="#" className="flex items-center gap-2 font-medium">
                        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                            <GalleryVerticalEnd className="size-4" />
                        </div>
                        {siteConfig.name}
                    </a>
                </div>
                <div className="flex flex-1 mt-25 justify-center">
                    <div className="">
                        <h1 className="flex items-center justify-center text-4xl text-center font-bold p-15 ">WELCOME TO {siteConfig.name.toLocaleUpperCase()}</h1>
                        <LoginForm />
                    </div>
                </div>
            </div>
            <div className="relative hidden md:block w-full h-full bg-muted bg-cover bg-center">
                <img
                    src="https://images.pexels.com/photos/2325447/pexels-photo-2325447.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                    alt="Description"
                    className="w-full h-full object-cover"
                />
            </div>
        </div>
    )
}