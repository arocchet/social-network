'use client'
import React, { useEffect, useRef, useCallback } from "react";
import PostCard from "@/components/feed/post/postCard";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import Image from "next/image";
import { ModeToggle } from "@/components/toggle-theme";
import { Stories } from "@/components/stories/stories";
import Link from "next/link";
import NavigationBar from "@/components/feed/navBar/navigationBar";
import { usePostContext } from "../context/post-context";

export default function HomePage() {
  const { loadMore, hasMore, loading, allposts } = usePostContext();
  const scrollRef = useRef<HTMLDivElement>(null);
  const isLoadingRef = useRef(false);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el || isLoadingRef.current || !hasMore) return;

    const scrollTop = el.scrollTop;
    const scrollHeight = el.scrollHeight;
    const clientHeight = el.clientHeight;

    const scrollRatio = scrollTop / (scrollHeight - clientHeight);

    if (scrollRatio >= 0.75 && !loading) {
      isLoadingRef.current = true;
      loadMore().finally(() => {
        isLoadingRef.current = false;
      });
    }
  }, [loadMore, loading, hasMore]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let previousHeight = el.scrollHeight;
    let previousScrollTop = el.scrollTop;

    const observer = new ResizeObserver(() => {
      const newHeight = el.scrollHeight;

      if (newHeight > previousHeight && previousScrollTop > 0) {
        const heightDiff = newHeight - previousHeight;
        el.scrollTop = previousScrollTop + heightDiff;
      }

      previousHeight = newHeight;
      previousScrollTop = el.scrollTop;
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    let lastCall = 0;
    const throttleDelay = 300;

    const throttledHandleScroll = () => {
      const now = Date.now();
      if (now - lastCall >= throttleDelay) {
        handleScroll();
        lastCall = now;
      }
    };

    el.addEventListener("scroll", throttledHandleScroll, { passive: true });

    return () => {
      el.removeEventListener("scroll", throttledHandleScroll);
    };
  }, [handleScroll]);


  return (
    <div className="flex h-screen bg-[var(--bgLevel1)]">
      <NavigationBar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="flex items-center justify-between p-4 border-b border-[var(--detailMinimal)] bg-[var(--bgLevel1)] sticky top-0 z-30">
          <Image src="/konekt-logo-full.png" alt="Konekt Logo" width={128} height={128} />
          <div className="flex items-center gap-2">
            <ModeToggle />
            <Link href="/chat">
              <Button variant="ghost" size="icon" className="hover:bg-[var(--bgLevel2)] cursor-pointer">
                <MessageCircle className="w-6 h-6" />
              </Button>
            </Link>
          </div>
        </header>

        <div className="border-b border-[var(--detailMinimal)] bg-[var(--bgLevel2)]">
          <Stories />
        </div>

        <div
          className="flex-1 overflow-y-auto bg-[var(--bgLevel1)]"
          ref={scrollRef}
        >
          <div className="mx-auto max-w-xl px-2 py-2">
            <PostCard />

            {loading && (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            )}

            {!hasMore && allposts.length > 0 && (
              <div className="text-center py-4 text-[var(--textMinimal)]">
                Vous avez vu tous les posts disponibles
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}