"use client"
import {
    Home,
    Search,
    Heart,
    Plus,
    User
} from "lucide-react"
import { Dock } from "./dock"

function NavBarMobile() {
    const items = [
        { icon: Home, label: "Home" },
        { icon: Search, label: "Search" },
        { icon: Plus, label: "Add New" },
        { icon: Heart, label: "Favorites" },
        { icon: User, label: "Profile" },
    ]
    return <Dock className="fixed bottom-0 z-50" items={items} />
}

export { NavBarMobile } 