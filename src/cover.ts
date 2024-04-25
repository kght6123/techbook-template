import fs from "fs";
import Handlebars from "handlebars";
import {
  coverDistPaths,
  coverTemplateHtmlPath,
  handlebarCompileOptions,
} from "./constants";

// HTMLのテンプレートをHandlebarsで読み込む
const templateHtml = Handlebars.compile(
  fs.readFileSync(coverTemplateHtmlPath).toString(),
  handlebarCompileOptions,
);

export const coverCompile = () => {
  for (const { path, image } of coverDistPaths) {
    // HTMLのテンプレートへ埋め込む
    const html = templateHtml({
      coverImage: image,
    });
    fs.writeFileSync(path, html);
  }
};
