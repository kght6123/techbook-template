import { Command } from 'commander';
import concurrently from 'concurrently';
const program = new Command();

program
  .name('techbook-cli')
  .description('TechBook CLI utilities.')
  .version('0.0.1');

  // "dev:tc": "npx  --yes tailwindcss@latest -i ./src/global.css -o ./dist/global.css --watch --no-autoprefixer --postcss ./postcss.config.cjs",
  // "dev:vs": "npx --yes @vivliostyle/cli preview --style ./dist/global.css",
  // "dev:h3": "npx --yes listhen --host 0.0.0.0 --port 3000 --watch ./src/viewer.ts",
  // "dev:sync": "npx --yes browser-sync start --no-ui --port 3001 --config 'bs-config.js' --files=\"dist/*\" --reload-delay=4000 --reload-throttle=4000 --startPath=\"/index.html#src=/dist/publication.json&bookMode=true&renderAllPages=true&style=/dist/global.css\" --browser \"google chrome\"",
  // "dev:sync:lock": "npx --yes browser-sync start --no-ui --port 3001 --config 'bs-config.js' --files=\"dist/lockfile,dist/global.css,images/*\" --reload-delay=4000 --reload-throttle=4000 --startPath=\"/index.html#src=/dist/publication.json&bookMode=true&renderAllPages=true&style=/dist/global.css\" --browser \"google chrome\"",
  // "dev": "npx --yes concurrently --kill-others --names \"main,h3,tailwind,browser-sync\" -c \"auto\" \"npm run pre-compiler:dev\" \"npm run dev:h3\" \"npx --yes wait-on --interval 500 ./dist/lockfile && npm run dev:tc\" \"npx --yes wait-on --interval 500 ./dist/global.css ./dist/lockfile && npm run dev:sync:lock\"",
  // "pre-compiler:dev": "npm run pre-compiler;npx --yes chokidar-cli \"src/**/*.ts\" \"src/**/*.html\" \"docs/**/*.md\" -c \"npm run pre-compiler\"",
  // "pre-compiler": "npx --yes vite-node src/main.ts",

program.command('dev')
  .description('techbook dev server')
  .option('-ph, --h3-port <port>', 'h3 server port number', '3000')
  .option('-ps, --sync-port <port>', 'sync port number', '3001')
  .action(async ({ h3Port, syncPort }: { h3Port: string, syncPort: string }) => {
    console.log(h3Port, syncPort);
    const { result } = concurrently(
      [
        { command: 'npx --yes vite-node src/main.ts', name: 'pre-compiler' },
      ],
      // {
      //   prefix: 'name',
      //   killOthers: ['failure', 'success'],
      //   restartTries: 3,
      //   cwd: path.resolve(__dirname, 'scripts'),
      // },
    );
    const closeEvents = await result;
    console.log(closeEvents);
  });

program.parse();
