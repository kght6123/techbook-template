import fs from "fs";
import path from "path";
import _ from "lodash";
import { Heading, Text } from "mdast";
import { distDir, docsDir, processorRehype, tocDistPath } from "./constants";

import { slug } from "github-slugger";
import {
  isTitleForComment,
  parseTitleForCodeMeta,
  parseTitleForComment,
} from "./utility";

// 目次の作成にも対応する（HTMLとvivliostyle.config.js）、目次の順序はファイル名順にする。

// 目次を作るリストを作る
export const docsHeadingList = await Promise.all(
  fs
    .readdirSync(docsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isFile())
    .map((dirent) => {
      const src = path.join(docsDir, dirent.name);
      const srcParsed = path.parse(src);
      const html = `${srcParsed.name}.dist.html`;
      const dist = path.join(distDir, `${srcParsed.name}.dist.html`);
      return { src, html, dist, fileName: srcParsed.name };
    })
    .filter(
      ({ fileName }) => fileName !== "_introduction" && fileName !== "_finally",
    )
    .map(async ({ src, html, dist, fileName }) => {
      const input = fs.readFileSync(src, "utf-8");
      const root = processorRehype.parse(input);
      const headings = root.children
        .filter(
          (node) =>
            node.type === "heading" &&
            // frontmatterをh2として扱わない
            !(node.depth === 2 && node.position?.start.line <= 2),
        )
        .map((node) => {
          const heading = node as Heading & { id: string; text: string };
          heading.text = (heading.children?.[0] as Text)?.value;
          heading.id = slug(heading.text, false);
          return heading;
        });

      // OK: Markdownノードからキャプションを取得するパターン
      const captions = root.children
        .map((node) => {
          if (node.type === "code" && node.meta) {
            const title = parseTitleForCodeMeta(node.meta);
            return { title, id: slug(title, false) };
          }
          if (node.type === "html" && isTitleForComment(node.value)) {
            // TODO: Markdownノードからコメントを取得できる、他もRehypeではなくRemarkでコメントを処理するプラグインでもいいかも
            const title = parseTitleForComment(node.value);
            return { title, id: slug(title, false) };
          }
          if (
            node.type === "paragraph" &&
            node.children?.some((node) => node.type === "image")
          ) {
            const image = node.children?.find((node) => node.type === "image");
            const alt = image?.alt?.split(",")?.[0];
            return { title: alt, id: slug(alt, false) };
          }
          return undefined;
        })
        .filter((caption) => caption?.title);
      console.log(captions);

      // NG: HTMLノードからキャプションを取得するパターン
      // const processedRoot = await processorRehype.run(root);
      // const captions = processedRoot.children
      //   .filter(
      //     (node) =>
      //       node.type === "element" &&
      //       (node.tagName === "figure" ||
      //         node.tagName === "table" ||
      //         (node.tagName === "div" &&
      //           node.children?.some(
      //             (child) =>
      //               child.type === "element" && child.tagName === "pre",
      //           ))),
      //   )
      //   .map((node) => {
      //     // const heading = node as Heading & { id: string; text: string };
      //     // heading.text = (heading.children?.[0] as Text)?.value;
      //     // heading.id = slug(heading.text, false);
      //     // return heading;
      //     console.log(node);
      //     return node;
      //   });

      return { src, html, headings, dist, fileName, captions };
    }),
);

export const rightPillarChapterList: { html: string; chapterCount: number }[] =
  [
    { html: "", chapterCount: 0 },
    { html: "", chapterCount: 0 },
    { html: "", chapterCount: 0 },
    { html: "", chapterCount: 0 },
    { html: "", chapterCount: 0 },
    { html: "", chapterCount: 0 },
    { html: "", chapterCount: 0 },
    { html: "", chapterCount: 0 },
    { html: "", chapterCount: 0 },
    { html: "", chapterCount: 0 },
    { html: "", chapterCount: 0 },
    { html: "", chapterCount: 0 },
    { html: "", chapterCount: 0 },
    { html: "", chapterCount: 0 },
    { html: "", chapterCount: 0 },
  ];
docsHeadingList.forEach(({ html }, index) => {
  rightPillarChapterList[index] = { html, chapterCount: index + 1 };
});

export const tocCompile = () => {
  const html = `<!DOCTYPE html>
<html lang="ja">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  </head>
  <body id="toc-body">
    <h1>Table of Contents</h1>
    <nav id="toc">
      <ol class="list-none p-0 mb-3">
        <li>
          <a
            href="_introduction.dist.html"
            class="print--text-black after--target-counter-page after--text-[10px] flex flex-row justify-between no-underline hover:underline mt-4 items-center"
          >
            <div class="flex flex-col">
              <div class="text-2xl font-bold" data-href="_introduction.dist.html">はじめに</div>
            </div>
          </a>
        </li>
        ${docsHeadingList
          .map(({ html, headings }) => {
            return headings
              .map((heading) => {
                const text = (heading.children?.[0] as Text)?.value;
                const id = slug(text, false);
                return `<li>
            <a
              href="${html}#${id}"
              class="print--text-black after--target-counter-page after--text-[10px] flex flex-row justify-between no-underline hover:underline ${
                heading.depth === 1 ? "mt-4 items-center" : "mt-1 items-end"
              }"
            >
              <div class="flex flex-col">
                <div class="${
                  heading.depth === 1
                    ? "text-2xl font-bold"
                    : heading.depth === 2
                      ? "header2 text-lg font-semibold pl-4"
                      : heading.depth === 3
                        ? "header3 text-base font-base pl-8"
                        : heading.depth === 4
                          ? "header4 text-base font-base pl-12"
                          : heading.depth === 5
                            ? "header5 text-base font-base pl-16"
                            : ""
                }" data-href="${html}#${id}">${text}</div>
                ${
                  heading.depth === 1
                    ? `<div class="header1 pl-3 text-[10px] leading-loose font-bold" data-href="${html}#${id}"></div>`
                    : ""
                }
              </div>
            </a>
          </li>`;
              })
              .join("");
          })
          .join("")}
        <li>
          <a
            href="_finally.dist.html"
            class="print--text-black after--target-counter-page after--text-[10px] flex flex-row justify-between no-underline hover:underline mt-4 items-center"
          >
            <div class="flex flex-col">
              <div class="text-2xl font-bold" data-href="_finally.dist.html">さいごに</div>
            </div>
          </a>
        </li>
        <li>
          <a
            href="appendix.dist.html"
            class="print--text-black after--target-counter-page after--text-[10px] flex flex-row justify-between no-underline hover:underline mt-4 items-center"
          >
            <div class="flex flex-col">
              <div class="text-2xl font-bold" data-href="appendix.dist.html">Appendix</div>
            </div>
          </a>
        </li>
      </ol>
    </nav>
    <div class="break-bf-left"></div>
  </body>
</html>`;
  fs.writeFileSync(tocDistPath, html);
};
