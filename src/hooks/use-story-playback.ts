import { extractDominantColor } from "@/app/utils/extractDominantColor";
import { useState, useRef, useCallback, useEffect } from "react";

interface StoryContent {
  id: number;
  image: string;
  timeAgo: string;
  mediaType?: "image" | "video";
}

interface UseStoryPlaybackProps {
  mediaType: "image" | "video";
  onNext: () => void;
  currentStoryContent: StoryContent | null;
  setDominantColor: (color: string) => void;
}

export function useStoryPlayback({
  mediaType,
  onNext,
  currentStoryContent,
  setDominantColor,
}: UseStoryPlaybackProps) {
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [mediaLoaded, setMediaLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const imageRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startTimer = useCallback(
    (duration?: number) => {
      clearTimer();

      const totalDuration =
        duration && mediaType === "video" ? duration * 1000 : 5000;

      const interval = totalDuration / 100;

      progressRef.current = 0;
      setProgress(0);

      timerRef.current = setInterval(() => {
        progressRef.current += 1;
        setProgress(progressRef.current);

        if (progressRef.current >= 100) {
          clearTimer();
          setTimeout(onNext, 100);
        }
      }, interval);
    },
    [clearTimer, mediaType, onNext]
  );

  const handleImageLoad = useCallback(async () => {
    if (!imageRef.current || !currentStoryContent) return;

    const expectedSrc = currentStoryContent.image;
    const currentSrc = imageRef.current.src;

    if (
      !expectedSrc ||
      !currentSrc.includes(expectedSrc.split("/").pop() || "")
    ) {
      console.log("Callback image obsolète ignoré");
      return;
    }

    try {
      setMediaLoaded(true);
      setIsPaused(false);
      startTimer();
    } catch (e) {
      console.error("Erreur chargement image", e);
      setError("Erreur chargement image");
      setMediaLoaded(true);
      setIsPaused(false);
      startTimer();
    }
  }, [currentStoryContent, startTimer]);

  const handleVideoLoad = useCallback(async () => {
    if (!videoRef.current || !currentStoryContent) return;

    const expectedSrc = currentStoryContent.image;
    const currentSrc = videoRef.current.src;

    if (
      !expectedSrc ||
      !currentSrc.includes(expectedSrc.split("/").pop() || "")
    ) {
      console.log("Callback vidéo obsolète ignoré");
      return;
    }

    try {
      if (videoRef.current.readyState >= 2) {
        const duration = videoRef.current.duration;
        await videoRef.current.play();
        setMediaLoaded(true);
        setIsPaused(false);
        startTimer(duration);
      }
    } catch (e) {
      console.error("Erreur lecture vidéo", e);
      setError("Erreur lecture vidéo");
      setMediaLoaded(true);
      setIsPaused(false);
      if (videoRef.current) {
        videoRef.current.play().catch(console.error);
        startTimer(videoRef.current.duration || 10);
      }
    }
  }, [currentStoryContent, startTimer]);

  const handleMediaError = useCallback(() => {
    setError("Erreur chargement média");
    setMediaLoaded(true);
    setIsPaused(false);
    startTimer(mediaType === "video" ? 10 : undefined);
  }, [mediaType, startTimer]);

  const toggleMute = useCallback(() => {
    if (videoRef.current) {
      const muted = !videoRef.current.muted;
      videoRef.current.muted = muted;
      setIsMuted(muted);
    }
  }, []);

  useEffect(() => {
    clearTimer();
    setProgress(0);
    progressRef.current = 0;
    setMediaLoaded(false);
    setIsPaused(true);
    setIsMuted(true);
    setError(null);

    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [currentStoryContent, clearTimer]);

  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);

  useEffect(() => {
    const element = mediaType === "image" ? imageRef.current : videoRef.current;
    if (mediaLoaded && element) {
      extractDominantColor(element).then(setDominantColor);
    }
  }, [mediaLoaded, mediaType, setDominantColor]);

  return {
    progress,
    isPaused,
    isMuted,
    mediaLoaded,
    error,
    imageRef,
    videoRef,
    toggleMute,
    handleImageLoad,
    handleVideoLoad,
    handleMediaError,
  };
}
