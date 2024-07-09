import fs from "fs";
import miraiBookConfig from "../techbook.config";
import {
  appendixDistPath,
  backCoverDistPath,
  colophonDistPath,
  distDir,
  endCoverDistPath,
  finallyDistPath,
  frontCoverDistPath,
  introductionDistPath,
  profileDistPath,
  startCoverDistPath,
  tocDistPath,
} from "./constants";
import { docsHeadingList } from "./toc";

export default function generateVivlioStyleConfig() {
  const { title, author } = miraiBookConfig;
  // MEMO: build（PDF生成）用にvivliostyle.config.cjsを生成する
  const docsEntryList = docsHeadingList.map(({ headings, dist }) => ({
    path: dist,
    title: headings?.find((v) => v.depth === 1)?.text,
  }));
  const config = {
    title,
    author,
    language: "ja",
    size: "105mm 173mm",
    entryContext: ".",
    entry: [
      frontCoverDistPath,
      startCoverDistPath,
      tocDistPath,
      introductionDistPath,
      ...docsEntryList,
      finallyDistPath,
      appendixDistPath,
      profileDistPath,
      colophonDistPath,
      endCoverDistPath,
      backCoverDistPath,
    ],
    workspaceDir: ".vivliostyle",
    toc: false,
  };
  fs.writeFileSync(
    "vivliostyle.config.cjs",
    `module.exports = ${JSON.stringify(config, null, 0).replace(
      /"([^"]+)":/g,
      "$1:",
    )}`,
  );
  // MEMO: h3用のプレビュー用にpublication.jsonを生成する
  const readingOrderList = docsHeadingList.map(({ headings, dist }) => ({
    url: dist,
    name: headings?.find((v) => v.depth === 1)?.text,
  }));
  const manifest = {
    "@context": ["https://schema.org", "https://www.w3.org/ns/pub-context"],
    type: "Book",
    conformsTo: "https://github.com/kght6123/techbook-template",
    name: title,
    author,
    inLanguage: "ja",
    dateModified: new Date().toISOString(),
    readingOrder: [
      { url: frontCoverDistPath },
      { url: startCoverDistPath },
      { url: tocDistPath },
      { url: introductionDistPath },
      ...readingOrderList,
      { url: finallyDistPath },
      { url: appendixDistPath },
      { url: profileDistPath },
      { url: colophonDistPath },
      { url: endCoverDistPath },
      { url: backCoverDistPath },
    ],
    resources: [],
    links: [],
  };
  fs.writeFileSync(`${distDir}/publication.json`, JSON.stringify(manifest));
}
