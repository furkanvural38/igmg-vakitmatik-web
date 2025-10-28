// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
    // Wir unterscheiden local dev vs. GitHub Pages deploy.
    // - lokal (vite dev): base = "/"
    // - prod (pages build): base = "/<repo-name>/"
    //
    // Du rufst ja im Workflow `npm run build:web` auf.
    // Das Kommando kann z.B. `vite build --mode pages` sein.
    // Dann erkennen wir das hier über `mode === "pages"`.

    const repoBase = "/igmg-vakitmatik-web/"; // <-- WICHTIG: an Repo anpassen!

    return {
        plugins: [react()],
        base: mode === "pages" ? repoBase : "/",
        build: {
            outDir: "dist",
            emptyOutDir: true,
        },
    };
});
