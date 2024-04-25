import fs from "fs";
import Handlebars from "handlebars";
import { Heading } from "mdast";

import { appendixCompile, appendixRegisterHelper } from "./appendix";
import { pageBreakRegisterHelper } from "./breakBefore";
import { chatRegisterHelper } from "./chat";
import { colophonCompile } from "./colophon";
import {
  chapterTemplateHtmlPath,
  handlebarCompileOptions,
  lockFileDistPath,
  lockFileSrcPath,
  processor,
} from "./constants";
import { coverCompile } from "./cover";
import { docrefRegisterHelper } from "./docref";
import { footnoteRegisterHelper } from "./footnote";
import generateVivlioStyleConfig from "./generateVivlioStyleConfig";
import { finallyCompile, introductionCompile } from "./introduction";
import { profileCompile } from "./profile";
import "./split";
import "./switch";
import { docsHeadingList, rightPillarChapterList, tocCompile } from "./toc";

// Handlebarsにヘルパーを登録する
chatRegisterHelper();
docrefRegisterHelper();
appendixRegisterHelper();
footnoteRegisterHelper();
pageBreakRegisterHelper();

// const args = process.argv.slice(1);

// HTMLのテンプレートをHandlebarsで読み込む
const chapterTemplateHtml = Handlebars.compile(
  fs.readFileSync(chapterTemplateHtmlPath).toString(),
  handlebarCompileOptions,
);

// configの作成
generateVivlioStyleConfig();

// プレコンパイルする
const preCompile = (
  src: string,
  dist: string,
  slug: string,
  headings: (Heading & {
    id: string;
    text: string;
  })[],
) => {
  // TODO: h1Heading、h2HeadingList、tocHeadingListとかの取得をPlugin化して、この辺りのデータをdataへ格納すると汎用性高くて良いかも
  const h1Heading = headings?.find((v) => v.depth === 1);
  const h2HeadingList = headings
    ?.map((v) => v.depth === 2 && v)
    .filter((v) => v);
  const markdown = fs.readFileSync(src);
  const templateMarkdown = Handlebars.compile(
    markdown.toString(),
    handlebarCompileOptions,
  );
  // MarkdownのテンプレートをHandlebarsで処理する
  const result = templateMarkdown({ filePath: dist });
  // MarkdownをRemarkでHTMLへ変換する
  processor.process(result).then((v) => {
    // HTMLのテンプレートへ埋め込む
    const html = chapterTemplateHtml({
      body: v.toString(),
      inlineStyle: "",
      slug,
      title: h1Heading?.text,
      h2HeadingList,
      distPath: dist,
      rightPillarChapterList, // TODO: この目次リストもPlugin化してdataへ格納すると良いかも
      data: v.data,
    });
    fs.writeFileSync(dist, html);
  });
};

console.log("start preCompile.");

coverCompile();
tocCompile();
introductionCompile();
finallyCompile();
colophonCompile();
profileCompile();

console.log("complete!!! init coverCompile, tocCompile.");

for (const { src, dist, fileName, headings } of docsHeadingList) {
  preCompile(src, dist, fileName, headings);
  console.log("complete!!! init preCompile.", src, dist);
  // TODO: watch mode 1 watchモードは、ファイルの変更を検知して再コンパイルする動作をする。現状のdevの方が使いやすいので、watchモードは削除する。
  // fs.watch(src, { persistent: true, recursive: false }, function(event, filename) {
  //   preCompile(src, dist)
  //   console.log('complete!!! preCompile.', event + ' to ' + filename)
  // })
  // TODO: watch mode 2
  // if (args.indexOf("--watch") > 0) {
  //   fs.watchFile(
  //     src,
  //     { bigint: false, persistent: true, interval: 3007 },
  //     (curr, prev) => {
  //       if (curr.ctimeMs !== prev.ctimeMs) {
  //         preCompile(src, dist, slug);
  //         coverCompile();
  //         tocCompile();
  //         appendixCompile();
  //         console.log(
  //           "complete!!! preCompile.",
  //           `${prev.ctimeMs},${curr.ctimeMs},${src}`,
  //         );
  //       }
  //     },
  //   );
  // }
}

appendixCompile();

console.log("complete!!! init appendixCompile.");

// 最後にロックファイルを更新する
// fs.writeFileSync(lockFileSrcPath, "");
fs.writeFileSync(lockFileDistPath, "");

console.log("complete!!! all process.");
