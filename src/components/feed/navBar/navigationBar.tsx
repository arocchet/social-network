import { Button } from "@/components/ui/button";
import { Search, Home, SettingsIcon, User, Users, Calendar, MessageCircle, Mail } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationBadge } from "@/components/ui/notification-badge";
import CreatePost from "../post/createPost";
import Link from "next/link";
import { useUserContext } from "@/app/context/user-context";
import { useNotifications } from "@/hooks/use-notifications";
import AppLoader from "@/components/ui/app-loader";
import { FaPlay } from "react-icons/fa6";

export default function NavigationBar() {
  const { user, loading } = useUserContext();
  const { counts, markInvitationsAsRead, markMessagesAsRead, markEventsAsRead } = useNotifications();

  if (loading) return <AppLoader />
  return (
    <>
      {/* PC Navigation - Left bar */}
      <nav className="hidden md:flex w-64 lg:w-72 flex-col bg-[var(--bgLevel2)] border-r border-[var(--detailMinimal)]">
        <div className="p-6">
          {/* Nom utilisateur */}
          <div className="flex items-center gap-3 mb-8 p-3 rounded-lg">
            <Avatar className="w-10 h-10">
              <AvatarImage src={`${user?.avatar}`} alt="Profile" />
              <AvatarFallback className="bg-[var(--pink20)] text-[var(--white10)]">
                U
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-[var(--textNeutral)] font-medium">
                {user?.username}
              </p>
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

            <Link href="/chat" onClick={markMessagesAsRead}>
              <div className="flex items-center gap-3 p-3 mt-2 rounded-lg text-[var(--textNeutral)] hover:bg-[var(--bgLevel3)] hover:text-[var(--textNeutral)] transition-colors relative">
                <div className="relative">
                  <MessageCircle className="w-5 h-5" />
                  <NotificationBadge count={counts.unreadMessages} />
                </div>
                <span>Messages</span>
              </div>
            </Link>

            <Link href="/groups">
              <div className="flex items-center gap-3 p-3 mt-2 rounded-lg text-[var(--textNeutral)] hover:bg-[var(--bgLevel3)] hover:text-[var(--textNeutral)] transition-colors">
                <Users className="w-5 h-5" />
                <span>Groupes</span>
              </div>
            </Link>

            <Link href="/events" onClick={markEventsAsRead}>
              <div className="flex items-center gap-3 p-3 mt-2 rounded-lg text-[var(--textNeutral)] hover:bg-[var(--bgLevel3)] hover:text-[var(--textNeutral)] transition-colors relative">
                <div className="relative">
                  <Calendar className="w-5 h-5" />
                  <NotificationBadge count={counts.upcomingEvents} />
                </div>
                <span>Événements</span>
              </div>
            </Link>

            <Link href="/invitations" onClick={markInvitationsAsRead}>
              <div className="flex items-center gap-3 p-3 mt-2 rounded-lg text-[var(--textNeutral)] hover:bg-[var(--bgLevel3)] hover:text-[var(--textNeutral)] transition-colors relative">
                <div className="relative">
                  <Mail className="w-5 h-5" />
                  <NotificationBadge count={counts.invitations} />
                </div>
                <span>Invitations</span>
              </div>
            </Link>

            <div className="mt-2 rounded-lg">
              <CreatePost />
            </div>

            <Link href="/reels">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--bgLevel3)] text-[var(--textNeutral)] hover:bg-[var(--bgLevel4)] transition-colors">
                <FaPlay className="w-5 h-5" />
                <span>Reels</span>
              </div>
            </Link>

            <Link href="/settings">
              <div className="flex items-center gap-3 p-3 mt-2  rounded-lg text-[var(--textNeutral)] hover:bg-[var(--bgLevel3)] hover:text-[var(--textNeutral)] transition-colors">
                <SettingsIcon className="w-5 h-5" />
                <span>Paramètres</span>
              </div>
            </Link>

            <Link href={`/profile/${user?.id}`}>
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
        <div className="backdrop-blur-lg border border-[var(--detailMinimal)] bg-[var(--bgLevel1)] rounded-2xl max-w-md mx-auto shadow-lg shadow-black/10 px-3 py-1">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-[var(--bgLevel2)] transition-colors duration-200 rounded-xl"
              >
                <Home className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/chat" onClick={markMessagesAsRead}>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-[var(--bgLevel2)] transition-colors duration-200 rounded-xl relative"
              >
                <MessageCircle className="w-5 h-5" />
                <NotificationBadge count={counts.unreadMessages} />
              </Button>
            </Link>
            <Link href="/groups">
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-[var(--bgLevel2)] transition-colors duration-200 rounded-xl"
              >
                <Users className="w-5 h-5" />
              </Button>
            </Link>
            <Link href="/events" onClick={markEventsAsRead}>
              <Button
                variant="ghost"
                size="icon"
                className="hover:bg-[var(--bgLevel2)] transition-colors duration-200 rounded-xl relative"
              >
                <Calendar className="w-5 h-5" />
                <NotificationBadge count={counts.upcomingEvents} />
              </Button>
            </Link>
            <CreatePost />
            <div className="p-2 hover:bg-gray-100 transition-colors duration-200 rounded-xl cursor-pointer">
              <Link href="/profile">
                <Avatar className="w-5 h-5">
                  <AvatarImage src={`${user?.avatar}`} alt="Profile" />
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
