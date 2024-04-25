import fs from "fs";
import Handlebars from "handlebars";
import miraiBookConfig from "../techbook.config";
import {
  finallyDistPath,
  finallyDocPath,
  handlebarCompileOptions,
  introductionDistPath,
  introductionDocPath,
  introductionTemplateHtmlPath,
  processor,
} from "./constants";
import { rightPillarChapterList } from "./toc";

// HTMLのテンプレートをHandlebarsで読み込む
const introductionTemplateHtml = Handlebars.compile(
  fs.readFileSync(introductionTemplateHtmlPath).toString(),
  handlebarCompileOptions,
);

export const introductionCompile = () => {
  const markdown = fs.readFileSync(introductionDocPath);
  const templateMarkdown = Handlebars.compile(
    markdown.toString(),
    handlebarCompileOptions,
  );
  // MarkdownのテンプレートをHandlebarsで処理する
  const result = templateMarkdown({ filePath: introductionDistPath });
  // MarkdownをRemarkでHTMLへ変換する
  processor.process(result).then((v) => {
    // HTMLのテンプレートへ埋め込む
    const html = introductionTemplateHtml({
      body: v.toString(),
      inlineStyle: "",
      slug: "_introduction",
      title: "はじめに",
      distPath: "_introduction",
      rightPillarChapterList, // TODO: この目次リストもPlugin化してdataへ格納すると良いかも
      data: v.data,
    });
    fs.writeFileSync(introductionDistPath, html);
  });
};

export const finallyCompile = () => {
  const markdown = fs.readFileSync(finallyDocPath);
  const templateMarkdown = Handlebars.compile(
    markdown.toString(),
    handlebarCompileOptions,
  );
  // MarkdownのテンプレートをHandlebarsで処理する
  const result = templateMarkdown({ filePath: finallyDistPath });
  // MarkdownをRemarkでHTMLへ変換する
  processor.process(result).then((v) => {
    // HTMLのテンプレートへ埋め込む
    const html = introductionTemplateHtml({
      body: v.toString(),
      inlineStyle: "",
      slug: "_finally",
      title: "さいごに",
      distPath: "_finally",
      rightPillarChapterList, // TODO: この目次リストもPlugin化してdataへ格納すると良いかも
      data: v.data,
    });
    fs.writeFileSync(finallyDistPath, html);
  });
};
