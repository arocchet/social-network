export const extractDominantColor = (
    element: HTMLImageElement | HTMLVideoElement
): Promise<string> => {
    return new Promise((resolve) => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve("#000000");

        // Réduction de taille max pour traitement léger
        const TARGET_SIZE = 50;

        const width =
            element instanceof HTMLVideoElement
                ? element.videoWidth || element.clientWidth
                : element.naturalWidth;
        const height =
            element instanceof HTMLVideoElement
                ? element.videoHeight || element.clientHeight
                : element.naturalHeight;

        if (!width || !height) return resolve("#000000");

        // Resize image pour canvas
        const scale = Math.min(TARGET_SIZE / width, TARGET_SIZE / height, 1);
        const w = Math.floor(width * scale);
        const h = Math.floor(height * scale);
        canvas.width = w;
        canvas.height = h;

        try {
            ctx.drawImage(element, 0, 0, w, h);
            const { data } = ctx.getImageData(0, 0, w, h);

            const colorMap: Record<string, number> = {};
            const STEP = 4 * 5; // prend 1 pixel sur 5 (~20%)

            for (let i = 0; i < data.length; i += STEP) {
                const [r, g, b, a] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
                if (a < 128) continue;

                const key = `${Math.round(r / 20) * 20},${Math.round(g / 20) * 20},${Math.round(b / 20) * 20}`;
                colorMap[key] = (colorMap[key] || 0) + 1;
            }

            const [dominant] = Object.entries(colorMap).reduce(
                (acc, [color, count]) => (count > acc[1] ? [color, count] : acc),
                ["0,0,0", 0]
            );

            const [r, g, b] = dominant.split(",").map(Number);
            resolve(`rgb(${Math.max(0, r - 30)}, ${Math.max(0, g - 30)}, ${Math.max(0, b - 30)})`);
        } catch (err) {
            console.error("Erreur d'extraction de couleur :", err);
            resolve("#000000");
        }
    });
};
