import { readFile, stat } from "node:fs/promises";
import { createApp, defineEventHandler, serveStatic } from "h3";
import mime from "mime";
import { join } from "pathe";

export const app = createApp({
  debug: true,
});

// 参考: https://h3.unjs.io/examples/serve-static-assets

const serverStaticEventHandlers = (staticDir) =>
  defineEventHandler((event) => {
    return serveStatic(event, {
      getContents: (id) => readFile(join(staticDir, id)),
      getMeta: async (id) => {
        const path = join(staticDir, id);
        const stats = await stat(path).catch(() => {});
        if (!stats || !stats.isFile()) {
          return;
        }
        return {
          size: stats.size,
          mtime: stats.mtimeMs,
          type: mime.getType(path),
        };
      },
      indexNames: ["/index.html"],
    });
  });

// MEMO: VivlioStyle CLIに戻せるように現状ほパス変換を行っている。buildも含めた移行時に再検討する。
app.use("/dist/dist", serverStaticEventHandlers("./dist"));
app.use("/dist/images", serverStaticEventHandlers("./images"));
app.use("/dist", serverStaticEventHandlers("./dist"));

app.use(serverStaticEventHandlers("./node_modules/@vivliostyle/viewer/lib"));

console.log(
  "preview: http://localhost:3000/index.html#src=/dist/publication.json&bookMode=true&renderAllPages=true&style=/dist/global.css&style=data:,/*%3Cviewer%3E*/%40page%7Bsize%3AJIS-B5%3B%7D/*%3C/viewer%3E*/&f=epubcfi(/6!)",
);
