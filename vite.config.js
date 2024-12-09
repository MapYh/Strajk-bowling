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
      provider: "v8", // Use v8 as the coverage provider
      reporter: ["text", "html"], // Coverage reports in text and HTML format
      lines: 90, // Enforce 90% line coverage
      functions: 90, // Enforce 90% function coverage
      branches: 90, // Enforce 90% branch coverage
      statements: 90, // Enforce 90% statement coverage
      checkCoverage: true,
    },
  },
});
