export const extractDominantColor = (
    element: HTMLImageElement | HTMLVideoElement
): Promise<string> => {
    return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");

        if (!ctx) return resolve("#000000");

        let width = element instanceof HTMLVideoElement
            ? element.videoWidth || element.clientWidth
            : element.naturalWidth;
        let height = element instanceof HTMLVideoElement
            ? element.videoHeight || element.clientHeight
            : element.naturalHeight;

        if (!width || !height) return resolve("#000000");

        canvas.width = width;
        canvas.height = height;

        try {
            ctx.drawImage(element, 0, 0, width, height);
            const data = ctx.getImageData(0, 0, width, height).data;

            const colorMap: Record<string, number> = {};
            const step = 4 * 10;

            for (let i = 0; i < data.length; i += step) {
                const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
                if (a < 128) continue;

                const key = `${Math.round(r / 10) * 10},${Math.round(g / 10) * 10},${Math.round(b / 10) * 10}`;
                colorMap[key] = (colorMap[key] || 0) + 1;
            }

            const [dominant] = Object.entries(colorMap).reduce(
                (acc, [color, count]) => (count > acc[1] ? [color, count] : acc),
                ["0,0,0", 0]
            );

            const [r, g, b] = dominant.split(",").map(Number);
            resolve(`rgb(${Math.max(0, r - 40)}, ${Math.max(0, g - 40)}, ${Math.max(0, b - 40)})`);
        } catch (e) {
            console.error("Erreur couleur dominante:", e);
            resolve("#000000");
        }
    });
};
