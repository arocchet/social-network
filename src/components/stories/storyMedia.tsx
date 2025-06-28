import React from "react";

interface StoryMediaProps {
    src: string;
    type: "image" | "video";
    muted?: boolean;
    loaded: boolean;
    setRef: (el: HTMLImageElement | HTMLVideoElement | null) => void;
    onLoad: () => void;
    onError: () => void;
}

export function StoryMedia({
    src,
    type,
    muted = true,
    loaded,
    setRef,
    onLoad,
    onError,
}: StoryMediaProps) {
    const baseStyle = {
        opacity: loaded ? 1 : 0.7,
        maxHeight: "calc(100vh - 200px)",
        maxWidth: "calc(100vw - 32px)",
    };

    return (
        <>
            {type === "image" ? (
                <img
                    ref={(el) => setRef(el)}
                    src={src}
                    alt="Story"
                    className="max-w-full max-h-full w-auto h-auto object-contain transition-opacity duration-300 rounded-lg"
                    style={baseStyle}
                    onLoad={onLoad}
                    onError={onError}
                    crossOrigin="anonymous"
                />
            ) : (
                <video
                    ref={(el) => setRef(el)}
                    src={src}
                    muted={muted}
                    playsInline
                    preload="metadata"
                    className="max-w-full max-h-full w-auto h-auto object-contain transition-opacity duration-300 rounded-lg"
                    style={baseStyle}
                    onLoadedData={onLoad}
                    onError={onError}
                    crossOrigin="anonymous"
                />
            )}
        </>
    );
}