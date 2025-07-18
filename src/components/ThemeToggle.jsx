import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react"; // Optional icons from lucide-react

const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (isDark) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="flex items-center gap-2 bg-gray-200 dark:bg-gray-800 text-gray-900 dark:text-white px-4 py-2 rounded-full transition-all duration-300 shadow hover:scale-105"
    >
      {isDark ? <Moon size={18} /> : <Sun size={18} />}
      {isDark ? "Dark" : "Light"} Mode
    </button>
  );
};

export default ThemeToggle;
