import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
// const port = import.meta.env.API_PORT || 8800;
// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        outDir: "build",
    },
    server: {
        allowedHosts: [
            "localhost",
            'frontend',
            "dev.greenthumbtracker.org",
            "www.greenthumbtracker.org",
        ],
        proxy: {
            "/api": {
                target: "http://0.0.0.0:".concat(process.env.API_PORT || 8800),
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
