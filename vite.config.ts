/// <reference types="vitest/config" />

import fs from "node:fs";
import path from "node:path";

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";


for (const name of [".env", ".env.local", ".env.development", ".env.production"]) {
  const file = path.resolve(import.meta.dirname, name);
  if (!fs.existsSync(file)) continue;
  const raw = fs.readFileSync(file, "utf8");
  if (raw.charCodeAt(0) === 0xfeff) fs.writeFileSync(file, raw.slice(1), "utf8");
}

export default defineConfig({
  plugins: [react(), tailwindcss()],

  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "./src"),
    },
  },

  test: {
    environment: "jsdom",
    include: ["src/**/*.test.{ts,tsx}"],
  },
});
