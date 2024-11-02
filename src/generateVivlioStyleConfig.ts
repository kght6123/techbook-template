import fs from "fs";
import config from "../techbook.config";
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

export default function generateVivlioStyleConfig({
  isKDP,
}: { isKDP: boolean }) {
  const { title, author, size } = config;
  // MEMO: build（PDF生成）用にvivliostyle.config.cjsを生成する
  const docsEntryList = docsHeadingList.map(({ headings, dist }) => ({
    path: dist,
    title: headings?.find((v) => v.depth === 1)?.text,
  }));
  const _config = {
    title,
    author,
    language: "ja",
    size: size,
    entryContext: ".",
    entry: [
      isKDP ? undefined : frontCoverDistPath,
      startCoverDistPath,
      tocDistPath,
      introductionDistPath,
      ...docsEntryList,
      finallyDistPath,
      config.appendix !== false ? appendixDistPath : undefined,
      profileDistPath,
      colophonDistPath,
      endCoverDistPath,
      isKDP ? undefined : backCoverDistPath,
    ].filter((v) => !!v),
    workspaceDir: ".vivliostyle",
    toc: false,
  };
  fs.writeFileSync(
    "vivliostyle.config.cjs",
    `module.exports = ${JSON.stringify(_config, null, 0).replace(
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
      isKDP ? undefined : { url: frontCoverDistPath },
      { url: startCoverDistPath },
      { url: tocDistPath },
      { url: introductionDistPath },
      ...readingOrderList,
      { url: finallyDistPath },
      config.appendix !== false ? { url: appendixDistPath } : undefined,
      { url: profileDistPath },
      { url: colophonDistPath },
      { url: endCoverDistPath },
      isKDP ? undefined : { url: backCoverDistPath },
    ].filter((v) => !!v),
    resources: [],
    links: [],
  };
  fs.writeFileSync(`${distDir}/publication.json`, JSON.stringify(manifest));
}
