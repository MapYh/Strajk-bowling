import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Ensure global access to testing utilities like `expect`
    environment: "jsdom", // Use jsdom for DOM testing
    setupFiles: "./setup-tests.js", // Path to your setup file
  },
});
