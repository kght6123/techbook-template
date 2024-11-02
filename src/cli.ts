import { Command } from "commander";
import concurrently from "concurrently";
import config from "../techbook.config";

const program = new Command();
const cssSrcFileName =
  config.size === "JIS-B5"
    ? "global.css"
    : config.size === "105mm 173mm"
      ? "global-105x173.css"
      : "global.css";

program
  .name("techbook-cli")
  .description("TechBook CLI utilities.")
  .version("0.0.1");

program
  .command("dev")
  .description("techbook dev server")
  .option("-ph, --h3-port <port>", "h3 server port number", "3000")
  .option("-ps, --sync-port <port>", "sync port number", "3001")
  .action(
    async ({ h3Port, syncPort }: { h3Port: string; syncPort: string }) => {
      const { result } = concurrently(
        [
          { command: "npx --yes vite-node src/main.ts", name: "init" },
          {
            command:
              'npx --yes chokidar-cli "src/**/*.ts" "src/**/*.html" "docs/**/*.md" -c "npx --yes vite-node src/main.ts"',
            name: "main",
          },
          {
            command: `npx --yes listhen --host 0.0.0.0 --port ${h3Port} --watch ./src/viewer.ts`,
            name: "h3",
          },
          {
            command: `npx --yes wait-on --interval 500 ./dist/lockfile && npx  --yes tailwindcss@latest -i ./src/${cssSrcFileName} -o ./dist/global.css --watch --no-autoprefixer --postcss ./postcss.config.cjs`,
            name: "tailwind",
          },
          {
            command: `npx --yes wait-on --interval 500 ./dist/global.css ./dist/lockfile && npx --yes browser-sync start --no-ui --port ${syncPort} --config 'bs-config.js' --files="dist/lockfile,dist/global.css,images/*" --reload-delay=4000 --reload-throttle=4000 --startPath="/index.html#src=/dist/publication.json&bookMode=true&renderAllPages=true&style=/dist/global.css" --browser "google chrome"`,
            name: "browser-sync",
          },
          // { command: `npx --yes wait-on --interval 500 ./dist/global.css ./dist/lockfile && npx --yes browser-sync start --no-ui --port ${syncPort} --config 'bs-config.js' --files="dist/*" --reload-delay=4000 --reload-throttle=4000 --startPath="/index.html#src=/dist/publication.json&bookMode=true&renderAllPages=true&style=/dist/global.css" --browser "google chrome"`, name: "browser-sync" },
        ],
        {
          killOthers: "failure",
          prefixColors: "auto",
        },
      );
      const closeEvents = await result;
      console.log("closed!!!");
    },
  );

program
  .command("build")
  .description("techbook build pdf")
  .action(async () => {
    const { result } = concurrently(
      [
        {
          command: "npx --yes vite-node src/main.ts",
          name: "main",
        },
        {
          command: `npx --yes tailwindcss@latest -i ./src/${cssSrcFileName} -o ./dist/global.css --no-autoprefixer --postcss ./postcss.config.cjs`,
          name: "tailwind",
        },
        {
          command: "npx --yes @vivliostyle/cli build --style ./dist/global.css",
          name: "vivliostyle",
        },
      ],
      {
        killOthers: "failure",
        prefixColors: "auto",
        maxProcesses: 1,
      },
    );
    const closeEvents = await result;
    console.log("closed!!!");
  });

program
  .command("kdp")
  .description("techbook build pdf for kindle direct publishing")
  .action(async () => {
    const { result } = concurrently(
      [
        {
          command: "npx --yes vite-node src/main.ts -kdp",
          name: "main",
        },
        {
          command: `npx --yes tailwindcss@latest -i ./src/${cssSrcFileName} -o ./dist/global.css --no-autoprefixer --postcss ./postcss.config.cjs`,
          name: "tailwind",
        },
        {
          command: "npx --yes @vivliostyle/cli build --style ./dist/global.css",
          name: "vivliostyle",
        },
      ],
      {
        killOthers: "failure",
        prefixColors: "auto",
        maxProcesses: 1,
      },
    );
    const closeEvents = await result;
    console.log("closed!!!");
  });

program.parse();
