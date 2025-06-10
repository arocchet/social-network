import { Button } from "@/components/ui/button";
import { PlusSquare, Search, Home, SettingsIcon, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CreatePost from "../post/createPost";
import Link from "next/link";

export default function NavigationBar() {
  return (
    <>
      {/* PC Navigation - Left bar */}
      <nav className="hidden md:flex w-64 lg:w-72 flex-col bg-[var(--bgLevel2)] border-r border-[var(--detailMinimal)]">
        <div className="p-6">

          {/* Nom utilisateur */}
          <div className="flex items-center gap-3 mb-8 p-3 rounded-lg">
            <Avatar className="w-10 h-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Profile" />
              <AvatarFallback className="bg-[var(--pink20)]">A</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-[var(--textNeutral)] font-medium">Username</p>
            </div>
          </div>

          {/* Navigation principale */}
          <div className="mb-6 ">
            <Link href="/">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bgLevel3)] text-[var(--textNeutral)] hover:bg-[var(--bgLevel4)] transition-colors">
                <Home className="w-5 h-5" />
                <span>Accueil</span>
              </div>
            </Link>

            <Link href="/search" className="">
              <div className="flex  items-center gap-3 p-3 mt-2 rounded-lg text-[var(--textNeutral)] hover:bg-[var(--bgLevel3)] hover:text-[var(--textNeutral)] transition-colors">
                <Search className="w-5 h-5" />
                <span>Recherche</span>
              </div>
            </Link>

            <div className="mt-2 rounded-lg">
              <CreatePost />
            </div>

            <Link href="/settings">
              <div className="flex items-center gap-3 p-3 mt-2  rounded-lg text-[var(--textNeutral)] hover:bg-[var(--bgLevel3)] hover:text-[var(--textNeutral)] transition-colors">
                <SettingsIcon className="w-5 h-5" />
                <span>Paramètres</span>
              </div>
            </Link>

            <Link href="/profile">
              <div className="flex items-center gap-3 p-3 mt-2  rounded-lg text-[var(--textNeutral)] hover:bg-[var(--bgLevel3)] hover:text-[var(--textNeutral)] transition-colors">
                <User className="w-5 h-5" />
                <span>Profil</span>
              </div>
            </Link>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation - Bottom Fixed */}
      <nav className="md:hidden fixed bottom-4 left-1 right-1 z-40 max-w-3xl mx-auto">
        <div className="backdrop-blur-lg border border-[var(--detailMinimal)] bg-[var(--bgLevel1)] rounded-2xl max-w-xs sm:max-w-md mx-auto shadow-lg shadow-black/10 px-5 py-1">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-[var(--bgLevel2)] transition-colors duration-200 rounded-xl"
            >
              <Home className="w-6 h-6" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-[var(--bgLevel2)] transition-colors duration-200 rounded-xl"
            >
              <Search className="w-6 h-6" />
            </Button>
            <CreatePost />
            <Link href="/settings">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 transition-colors duration-200 rounded-xl"
              >
                <SettingsIcon className="w-6 h-6" />
              </Button>
            </Link>

            <div className="p-2 hover:bg-gray-100 transition-colors duration-200 rounded-xl cursor-pointer">
              <Link href="/profile">
                <Avatar className="w-6 h-6">
                  <AvatarImage
                    src="/placeholder.svg?height=24&width=24"
                    alt="Profile"
                  />
                  <AvatarFallback className="bg-[var(--pink20)]"></AvatarFallback>
                </Avatar>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}