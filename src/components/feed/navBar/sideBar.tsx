/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";

import { ModeToggle } from "@/components/toggle-theme";
import { Avatar } from "@/components/ui/avatar";
import { Home, Search, Heart } from "lucide-react";

const Sidebar = () => {

    return (
        <div className="flex h-screen">
            {/* Desktop Sidebar */}
            <div className="hidden md:flex flex-col fixed top-0 left-0 h-full w-64 bg-[var(--bgLevel2)] text-black shadow border-r-1 border-[var(--detailMinimal)]">
                {/* Profile Section */}
                <div className="p-5 border-b-1 border-[var(--detailMinimal)] bg-[var(--bgLevel1)]">
                    <div className="flex items-center space-x-3">
                        <img
                            src={"/konekt-logo-full.png"}
                            className="w-32 h-auto block"
                        />
                    </div>
                </div>
                {/* Navigation Section */}
                
                <nav className="flex-1 py-4 px-2 overflow-y-auto">
                    {/* <ModeToggle/> */}
                    <ul>
                        <li className="mb-2">
                            <button className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-[var(--bgLevel1)] text-[var(--textNeutral)]">
                                <Home className="h-5 w-5" />
                                Home
                            </button>
                        </li>
                        <li className="mb-2">
                            <button className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-[var(--bgLevel1)] text-[var(--textNeutral)]">
                                <Search className="h-5 w-5" />
                                Rechercher
                            </button>
                        </li>
                        <li className="mb-2">
                            <button className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-[var(--bgLevel1)] text-[var(--textNeutral)]">
                                <Heart className="h-5 w-5" />
                                Notifications
                            </button>
                        </li>
                        <li className="">
                            <button className="flex gap-2 font-medium text-sm items-center w-full py-2 px-4 rounded-xl hover:bg-[var(--bgLevel1)] text-[var(--textNeutral)]">
                                <Avatar className="h-5 w-5 bg-secondary border-2 border-[var(--textNeutral)]" />
                                Profil
                            </button>
                        </li>
                    </ul>
                </nav>
                {/* Footer / Action Button */}
            </div>
            {/* Main Content Area */}
            <div className="flex-1 ml-0 md:ml-64 transition-all duration-300">
                {/* Top bar for mobile toggle */}
            </div>
        </div>
    );
};

export { Sidebar };
