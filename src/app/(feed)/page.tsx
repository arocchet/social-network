/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
'use client'

import PostCard from "@/components/feed/post/postCard"
import { Button } from "@/components/ui/button"
import { MessageCircle, Play, PlusSquare, Search, Send, Home, Settings2, SettingsIcon, User, HelpCircle, Database, DollarSign, Trash2, FolderOpen } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Image from "next/image"
import { ModeToggle } from "@/components/toggle-theme"
import { Stories } from "@/components/stories/stories"
import CreatePost from "@/components/feed/post/createPost"
import Link from "next/link"
import NavigationBar from "@/components/feed/navBar/navigationBar"

export default function HomePage() {
  return (
    <div className="flex h-screen bg-[var(--bgLevel1)]">
      {/*Navigation */}
      <NavigationBar/>


      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 border-b border-[var(--detailMinimal)] bg-[var(--bgLevel1)] sticky top-0 z-50">
          <Image
            src="/konekt-logo-full.png"
            alt="Konekt Logo"
            width={128}
            height={128}
          />
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button variant="ghost" size="icon">
              <MessageCircle className="w-6 h-6" />
            </Button>
          </div>
        </header>

        <div className="border-b border-[var(--detailMinimal)] bg-[var(--bgLevel2)]">
          <Stories />
        </div>

        <div className="flex-1 overflow-y-auto bg-[var(--bgLevel1)]">
          <div className="mx-auto max-w-xl px-2 py-2">
            <PostCard />
          </div>
        </div>
      </div>
    </div>
  )
}