import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Ensure global access to testing utilities like `expect`
    environment: "jsdom", // Use jsdom for DOM testing
    setupFiles: "./setup-tests.js", // Path to your setup file
    coverage: {
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
        checkCoverage: true,
      },
      provider: "v8", // Use v8 as the coverage provider
      reporter: ["text", "html"], // Coverage reports in text and HTML format
    },
  },
});
