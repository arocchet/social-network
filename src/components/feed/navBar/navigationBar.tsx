import { Button } from "@/components/ui/button";
import { PlusSquare, Search, Home, SettingsIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CreatePost from "../post/createPost";
import Link from "next/link";

export default function NavigationBar() {
  return (
    <>
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

      {/* Desktop Navigation - Left Sidebar */}
      <nav className="hidden md:block fixed left-4 top-1/2 -translate-y-1/2 z-40">
        <div className="backdrop-blur-lg border border-[var(--detailMinimal)] bg-[var(--bgLevel1)] rounded-2xl shadow-lg shadow-black/10 px-3 py-6">
          <div className="flex flex-col items-center space-y-6">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-[var(--bgLevel2)] transition-colors duration-200 rounded-xl w-12 h-12"
              >
                <Home className="w-6 h-6" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-[var(--bgLevel2)] transition-colors duration-200 rounded-xl w-12 h-12"
            >
              <Search className="w-6 h-6" />
            </Button>
            <div className="w-12 h-12 flex items-center justify-center">
              <CreatePost />
            </div>
            <Link href="/settings">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-gray-100 transition-colors duration-200 rounded-xl w-12 h-12"
              >
                <SettingsIcon className="w-6 h-6" />
              </Button>
            </Link>

            <div className="p-3 hover:bg-gray-100 transition-colors duration-200 rounded-xl cursor-pointer">
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
