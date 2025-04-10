/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
        // Custom colors inspired by Trello/Jira
        "primary-blue": "#4A90E2", // Trello-like blue
        "secondary-gray": "#EDEFF0", // Light background
        "task-border": {
          high: "#FF5630", // Red for high priority
          medium: "#4A90E2", // Blue for medium priority
          low: "#36B37E", // Green for low priority
        },
      },
      minWidth: {
        "kanban-column": "280px", // Fixed minimum width for columns
      },
      maxWidth: {
        "kanban-column": "280px", // Fixed maximum width for columns
      },
      boxShadow: {
        card: "0 2px 4px rgba(0, 0, 0, 0.1)", // Subtle card shadow
        "card-hover": "0 4px 8px rgba(0, 0, 0, 0.15)", // Hover effect
      },
      transitionProperty: {
        shadow: "box-shadow",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
