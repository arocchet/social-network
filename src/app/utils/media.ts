export const getMediaType = (url: string): "image" | "video" => {
    const videoExtensions = ["mp4", "webm", "ogg", "mov", "avi", "wmv", "m4v"];
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"];

    const extension = url.split(".").pop()?.toLowerCase();

    if (extension && videoExtensions.includes(extension)) {
        return "video";
    }

    if (extension && imageExtensions.includes(extension)) {
        return "image";
    }

    if (url.includes("video") || url.includes(".mp4") || url.includes(".webm")) {
        return "video";
    }

    return "image";
};
