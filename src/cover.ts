import fs from "fs";
import Handlebars from "handlebars";
import {
  coverTemplateHtmlPath,
  handlebarCompileOptions,
  frontCoverDistPath,
  backCoverDistPath,
  startCoverDistPath,
  endCoverDistPath,
} from "./constants";
import config from "../techbook.config";

// HTMLのテンプレートをHandlebarsで読み込む
const templateHtml = Handlebars.compile(
  fs.readFileSync(coverTemplateHtmlPath).toString(),
  handlebarCompileOptions,
);

export const coverCompile = () => {
  const edition = config.editions[config.editions.length - 1];
  {
    const html = templateHtml({
      kind: "front",
      coverImage: config.cover.front,
      title: config.title,
      publisher: config.publisher,
      author: config.author,
      lastEdition: edition,
    });
    fs.writeFileSync(frontCoverDistPath, html);
  }{
    const html = templateHtml({
      kind: "back",
      coverImage: config.cover.back,
      title: config.title,
      publisher: config.publisher,
      author: config.author,
      lastEdition: edition,
    });
    fs.writeFileSync(backCoverDistPath, html);
  }{
    const html = templateHtml({
      kind: "start",
      coverImage: config.cover.start,
      title: config.title,
      publisher: config.publisher,
      author: config.author,
      lastEdition: edition,
    });
    fs.writeFileSync(startCoverDistPath, html);
  }{
    const html = templateHtml({
      kind: "end",
      coverImage: config.cover.end,
      title: config.title,
      publisher: config.publisher,
      author: config.author,
      lastEdition: edition,
    });
    fs.writeFileSync(endCoverDistPath, html);
  }
};
