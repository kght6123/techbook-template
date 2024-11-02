import fs from "fs";
import Handlebars from "handlebars";
import config from "../techbook.config";
import {
  backCoverDistPath,
  coverTemplateHtmlPath,
  endCoverDistPath,
  frontCoverDistPath,
  handlebarCompileOptions,
  startCoverDistPath,
} from "./constants";

// HTMLのテンプレートをHandlebarsで読み込む
const templateHtml = Handlebars.compile(
  fs.readFileSync(coverTemplateHtmlPath).toString(),
  handlebarCompileOptions,
);

export const coverCompile = (isKDP: { isKDP: boolean }) => {
  const edition = config.editions[config.editions.length - 1];
  {
    const html = templateHtml({
      kind: "front",
      coverImage: isKDP ? undefined : config.cover.front,
      title: config.title,
      publisher: config.publisher,
      author: config.author,
      lastEdition: edition,
    });
    fs.writeFileSync(frontCoverDistPath, html);
  }
  {
    const html = templateHtml({
      kind: "back",
      coverImage: isKDP ? undefined : config.cover.back,
      title: config.title,
      publisher: config.publisher,
      author: config.author,
      lastEdition: edition,
    });
    fs.writeFileSync(backCoverDistPath, html);
  }
  {
    const html = templateHtml({
      kind: "start",
      coverImage: isKDP ? undefined : config.cover.start,
      title: config.title,
      publisher: config.publisher,
      author: config.author,
      lastEdition: edition,
    });
    fs.writeFileSync(startCoverDistPath, html);
  }
  {
    const html = templateHtml({
      kind: "end",
      coverImage: isKDP ? undefined : config.cover.end,
      title: config.title,
      publisher: config.publisher,
      author: config.author,
      lastEdition: edition,
    });
    fs.writeFileSync(endCoverDistPath, html);
  }
};
