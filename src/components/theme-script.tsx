// components/theme-script.tsx
"use client";

import { useEffect } from "react";

export function ThemeScript() {
    useEffect(() => {
        try {
            let theme = localStorage.getItem("theme");
            if (!theme || theme === "system") {
                theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
            }
            document.documentElement.classList.add(theme);
        } catch (_) {
            // Fallback to light theme
            document.documentElement.classList.add("light");
        }
    }, []);

    return null;
}