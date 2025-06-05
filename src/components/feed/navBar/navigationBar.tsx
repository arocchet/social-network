import { Button } from "@/components/ui/button";
import { PlusSquare, Search, Home, SettingsIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import CreatePost from "../post/createPost";
import Link from "next/link";

export default function NavigationBar() {
  return (
    <nav className="fixed bottom-4 left-1 right-1 z-40 max-w-3xl mx-auto">
      <div className="backdrop-blur-lg border border-[var(--detailMinimal)] bg-[var(--bgLevel1)] rounded-2xl max-w-xs sm:max-w-md md:max-w-lg mx-auto shadow-lg shadow-black/10 px-5 py-1">
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
            className="hover:bg-[var(--bgLevel2)]  transition-colors duration-200 rounded-xl"
          >
            <Search className="w-6 h-6" />
          </Button>
          <CreatePost />
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-gray-100 transition-colors duration-200 rounded-xl"
          >
            <SettingsIcon className="w-6 h-6" />
          </Button>
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
  );
}
