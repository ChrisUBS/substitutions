import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default ({ mode }: { mode: string }) => {
  // Load .env variables according to mode (development, production, etc.)
  const env = loadEnv(mode, process.cwd(), "");

  return defineConfig({
    plugins: [react(), tailwindcss()],
    base: env.VITE_APP_BASE_NAME || "/",
    server: {
      allowedHosts: env.VITE_APP_ALLOWED_HOSTS
        ? env.VITE_APP_ALLOWED_HOSTS.split(",")
        : [],
    },
  });
};