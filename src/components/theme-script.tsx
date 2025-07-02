// components/theme-script.tsx
export function ThemeScript() {
    const code = `
    (function () {
      try {
        var theme = localStorage.getItem("theme");
        if (!theme || theme === "system") {
          theme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
        }
        document.documentElement.classList.add(theme);
      } catch (_) {}
    })();
  `;

    return <script dangerouslySetInnerHTML={{ __html: code }} />;
}