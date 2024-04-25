import fs from "fs";
import Handlebars from "handlebars";
import {
  appendixDistPath,
  appendixTemplateHtmlPath,
  appendixTitle,
  handlebarCompileOptions,
} from "./constants";

const appendixMap = new Map();

// HTMLのテンプレートをHandlebarsで読み込む
const templateHtml = Handlebars.compile(
  fs.readFileSync(appendixTemplateHtmlPath).toString(),
  handlebarCompileOptions,
);

const createHyperLink = (filePath) =>
  filePath.replaceAll(".md", ".html").replaceAll("dist/", "");

export const appendixRegisterHelper = () => {
  Handlebars.registerHelper(
    "appendix",
    (filePath: string, id: string, text: string) => {
      appendixMap.set(`${createHyperLink(filePath)}#${id}`, text);
      return new Handlebars.SafeString(
        `<span id="${id}" class="appendix">&nbsp;${text}&nbsp;</span>`,
      );
    },
  );
  Handlebars.registerHelper(
    "appendix-hidden",
    (filePath: string, id: string, text: string) => {
      appendixMap.set(`${createHyperLink(filePath)}#${id}`, text);
      return new Handlebars.SafeString(`<span id="${id}"></span>`);
    },
  );
};

export const appendixCompile = () => {
  const sortedByAppendixMap = new Map(
    [...appendixMap].sort((e1, e2) => e1[1].localeCompare(e2[1])),
  );
  const sortedByAppendixMapKeys = [...sortedByAppendixMap.keys()];
  if (sortedByAppendixMap.size < 1) return;
  // HTMLのテンプレートへ埋め込む
  const html = templateHtml({
    body: `
    <h1 class="text-2xl font-bold p-0 block mb-3">${appendixTitle}</h1>
    <div id="appendix">
      ${sortedByAppendixMapKeys
        .map(
          (key, index) =>
            `<a class="print--text-black after--target-counter-page after--text-[8px] block no-underline hover:underline text-sm py-1" href="${key}">${sortedByAppendixMap.get(
              key,
            )}</a>`,
        )
        .join("")}
    </div>`,
    inlineStyle: "",
  });
  fs.writeFileSync(appendixDistPath, html);
};
