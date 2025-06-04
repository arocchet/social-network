"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Évite l'hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  // Utilise resolvedTheme pour un changement plus rapide
  const isDark = resolvedTheme === "dark";

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon">
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleTheme}
      className="transition-colors duration-200"
    >
      <Sun className={`h-[1.2rem] w-[1.2rem] transition-all duration-200 ${
        isDark ? "rotate-90 scale-0" : "rotate-0 scale-100"
      }`} />
      <Moon className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-200 ${
        isDark ? "rotate-0 scale-100" : "-rotate-90 scale-0"
      }`} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}