import fs from "fs";
import Handlebars from "handlebars";
import miraiBookConfig from "../techbook.config";
import {
  handlebarCompileOptions,
  profileDistPath,
  profileTemplateHtmlPath,
} from "./constants";

export const profileCompile = () => {
  // HTMLのテンプレートをHandlebarsで読み込む
  const profileTemplateHtml = Handlebars.compile(
    fs.readFileSync(profileTemplateHtmlPath).toString(),
    handlebarCompileOptions,
  );

  // HTMLのテンプレートへ埋め込む
  const html = profileTemplateHtml({ config: miraiBookConfig });
  fs.writeFileSync(profileDistPath, html);
};
