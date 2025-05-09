import { defineConfig } from "vite";

export default defineConfig({
  build: {
    outDir: "dist", // The folder where the built files will go
    assetsDir: "assets", // Folder for assets like models, textures
    minify: "esbuild", // Minify the code for production
  },
});
