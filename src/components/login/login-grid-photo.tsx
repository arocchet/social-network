import { GridMotion } from "./shuffle-grid";

export default function LoginGridPhoto() {
    const images = [
        "https://i.pinimg.com/736x/17/f1/83/17f18311a2bec73893f51ac8e41012a1.jpg",
        "https://i.pinimg.com/736x/af/46/28/af4628755946ad7a6207d8ad3f6e7695.jpg",
        "https://i.pinimg.com/736x/93/ad/01/93ad0156517cf315513b197cf150b38f.jpg",
        "https://i.pinimg.com/736x/17/f1/83/17f18311a2bec73893f51ac8e41012a1.jpg",
        "https://i.pinimg.com/736x/68/17/f8/6817f8a0aff00e85c84252d7eca1f268.jpg",
        "https://i.pinimg.com/736x/b0/6e/f3/b06ef31c070db7ea38336a5c71a875ce.jpg",
        "https://i.pinimg.com/736x/d4/fa/47/d4fa47391e691f88a08cc8da071bc4e5.jpg",
        "https://i.pinimg.com/originals/77/5a/4d/775a4d36ae2c8e4e301258119940b06d.gif",
        "https://i.pinimg.com/originals/92/23/43/9223430d43fda43bb37acadaa424e767.gif"
    ];

    // Ici, on génère 28 images en boucle sur le tableau images
    const items = Array.from({ length: 28 }, (_, i) => {
        const imgIndex = i % images.length;
        return images[imgIndex];
    });

    return (
        <div className="space-y-8">
            <div className="h-screen w-full bg-[var(--bgLevel2)] ">
                <GridMotion
                    items={items}
                    gradientColor="hsl(var(--brand-foreground))"
                />
            </div>
        </div>
    );
}
