/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  // We use the 'class' strategy so we can toggle Dark Mode manually or sync it with the OS
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // We use CSS variables here so they swap automatically in dark mode
        background: "var(--background)",
        card: "var(--card)",
        text: "var(--text)",
        subText: "var(--subText)",
        primary: "var(--primary)",
        danger: "var(--danger)",
        border: "var(--border)",
        inputBg: "var(--inputBg)",
        strength: {
          weak: "var(--strengthWeak)",
          medium: "var(--strengthMedium)",
          strong: "var(--strengthStrong)",
        },
      },
    },
  },
  plugins: [],
};
