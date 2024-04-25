import fs from "fs";
import Handlebars from "handlebars";
import miraiBookConfig from "../techbook.config";
import {
  colophonDistPath,
  colophonTemplateHtmlPath,
  handlebarCompileOptions,
} from "./constants";

export const colophonCompile = () => {
  // HTMLのテンプレートをHandlebarsで読み込む
  const colophonTemplateHtml = Handlebars.compile(
    fs.readFileSync(colophonTemplateHtmlPath).toString(),
    handlebarCompileOptions,
  );

  // HTMLのテンプレートへ埋め込む
  const html = colophonTemplateHtml({ config: miraiBookConfig });
  fs.writeFileSync(colophonDistPath, html);
};
