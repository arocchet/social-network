"use client"
import NavigationBar from '@/components/feed/navBar/navigationBar'
import VideoReelCard from '@/components/feed/post/VideoReelCard';
import { useVideoReels } from '@/hooks/use-video-reels';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export default function Reels() {
    const { posts, error, isLoading, isLoadingMore, isReachingEnd, loadMore } = useVideoReels();
    const [visibleVideoIndex, setVisibleVideoIndex] = useState(0);
    const [hasInitialized, setHasInitialized] = useState(false);

    useEffect(() => {
        // Auto-play first video when posts are loaded
        if (posts.length > 0 && !hasInitialized) {
            setVisibleVideoIndex(0);
            setHasInitialized(true);
        }
    }, [posts, hasInitialized]);

    useEffect(() => {
        const handleScroll = () => {
            const videoElements = document.querySelectorAll('[data-video-container]');
            let closestVideoIndex = 0;
            let closestDistance = Infinity;

            videoElements.forEach((element, index) => {
                const rect = element.getBoundingClientRect();
                const elementCenter = rect.top + rect.height / 2;
                const viewportCenter = window.innerHeight / 2;
                const distance = Math.abs(elementCenter - viewportCenter);

                if (distance < closestDistance) {
                    closestDistance = distance;
                    closestVideoIndex = index;
                }
            });

            // Only update if the video has changed and is reasonably in view
            if (closestDistance < window.innerHeight * 0.6 && closestVideoIndex !== visibleVideoIndex) {
                setVisibleVideoIndex(closestVideoIndex);
            }
        };

        // Initial check
        handleScroll();

        // Throttle scroll events for better performance
        let ticking = false;
        const throttledScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    handleScroll();
                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', throttledScroll);
        return () => window.removeEventListener('scroll', throttledScroll);
    }, [visibleVideoIndex]);

    if (isLoading) {
        return (
            <div className="flex h-screen bg-[var(--bgLevel2)]">
                <NavigationBar />
                <div className="flex-1 flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-[var(--textNeutral)]" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex h-screen bg-[var(--bgLevel2)]">
                <NavigationBar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-[var(--textNeutral)] mb-4">Error loading reels</p>
                        <Button onClick={() => window.location.reload()}>
                            Retry
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="flex h-screen bg-[var(--bgLevel2)]">
                <NavigationBar />
                <div className="flex-1 flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-[var(--textNeutral)] mb-2">No video reels available</p>
                        <p className="text-[var(--textMinimal)] text-sm">
                            Upload some videos to see them here!
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[var(--bgLevel2)]">
            <NavigationBar />
            <div className="flex-1 overflow-auto">
                <div className="max-w-2xl mx-auto py-4">
                    <h1 className="text-2xl font-semibold text-[var(--textNeutral)] mb-6 text-center">
                        Reels
                    </h1>

                    <div className="space-y-4">
                        {posts.map((post, index) => (
                            <div key={post.id} data-video-container>
                                <VideoReelCard
                                    post={post}
                                    isVisible={index === visibleVideoIndex}
                                />
                            </div>
                        ))}
                    </div>

                    {!isReachingEnd && (
                        <div className="flex justify-center py-6">
                            <Button
                                onClick={loadMore}
                                disabled={isLoadingMore}
                                variant="outline"
                            >
                                {isLoadingMore ? (
                                    <>
                                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                        Loading...
                                    </>
                                ) : (
                                    'Load More'
                                )}
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
