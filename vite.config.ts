import { defineConfig, loadEnv } from "vite";
import dotenv from "dotenv";
import path from "path";

export default defineConfig(({ command, mode }) => {
  // Load env file based on `mode` in the current working directory.
  // Set the third parameter to '' to load all env regardless of the `VITE_` prefix.
  dotenv.config({
    path: path.join(path.resolve(), ".env"),
  });

  const MODE = process.env.NODE_ENV || "production";

  const env = loadEnv(mode, process.cwd(), "");

  const host = process.env.HOST;
  const port = +(process.env.PORT || 5000);

  return {
    // vite config
    define: {
      __APP_ENV__: JSON.stringify(env.APP_ENV),
    },
    server: {
      host,
      port,
    },
    base: MODE === "production" ? "/flat-game/" : "/",
  };
});
