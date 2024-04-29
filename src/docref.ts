import Handlebars from "handlebars";
import { docsHeadingList } from "./toc";

export const docrefRegisterHelper = () => {
  Handlebars.registerHelper("chapref", (filePathPrefix) => {
    const toc = docsHeadingList.find((toc) =>
      toc.html.startsWith(filePathPrefix),
    );
    if (toc === undefined) {
      console.error(`chapref: ${filePathPrefix} が見つかりませんでした。`);
      return "";
    }
    const { html, headings } = toc;
    const heading = headings.find((heading) => heading.depth === 1);
    return new Handlebars.SafeString(`
<a class="chapref" href="${html}#${heading.id}">${heading.text}</a>
`);
  });

  Handlebars.registerHelper("headref", (filePathPrefix, titleOrId) => {
    const toc = docsHeadingList.find((toc) =>
      toc.html.startsWith(filePathPrefix),
    );
    if (toc === undefined) {
      console.error(`headref: ${filePathPrefix} が見つかりませんでした。`);
      return "";
    }
    const heading = toc.headings.find(
      ({ text, id }) => text.startsWith(titleOrId) || id.startsWith(titleOrId),
    );
    if (heading === undefined) {
      console.error(
        `headref: ${filePathPrefix} に ${titleOrId} が見つかりませんでした。`,
      );
      return "";
    }
    const { html, headings } = toc;
    const { text: ctitle } = headings.find((heading) => heading.depth === 1);
    const { id, text: htitle } = heading;
    return new Handlebars.SafeString(`
<a class="h2ref" href="${html}#${id}">${ctitle}<a href="${html}#${id}" class="h2title">${htitle}</a></a>
`);
  });

  Handlebars.registerHelper("imageref", (filePathPrefix, titleOrId) => {
    const toc = docsHeadingList.find((toc) =>
      toc.html.startsWith(filePathPrefix),
    );
    if (toc === undefined) {
      console.error(`imageref: ${filePathPrefix} が見つかりませんでした。`);
      return "";
    }
    const caption = toc.captions.find(
      ({ title, id }) =>
        title.startsWith(titleOrId) || id.startsWith(titleOrId),
    );
    if (caption === undefined) {
      console.error(
        `imageref: ${filePathPrefix} に ${titleOrId} が見つかりませんでした。`,
      );
      return "";
    }
    const { html } = toc;
    return new Handlebars.SafeString(
      `<a class="imageref" href="${html}#image-${caption.id}">${caption.title}</a>`,
    );
  });

  Handlebars.registerHelper("coderef", (filePathPrefix, titleOrId) => {
    const toc = docsHeadingList.find((toc) =>
      toc.html.startsWith(filePathPrefix),
    );
    if (toc === undefined) {
      console.error(`coderef: ${filePathPrefix} が見つかりませんでした。`);
      return "";
    }
    const caption = toc.captions.find(
      ({ title, id }) =>
        title.startsWith(titleOrId) || id.startsWith(titleOrId),
    );
    if (caption === undefined) {
      console.error(
        `coderef: ${filePathPrefix} に ${titleOrId} が見つかりませんでした。`,
      );
      return "";
    }
    const { html } = toc;
    return new Handlebars.SafeString(
      `<a class="coderef" href="${html}#code-${caption.id}">${caption.title}</a>`,
    );
  });

  Handlebars.registerHelper("tableref", (filePathPrefix, titleOrId) => {
    const toc = docsHeadingList.find((toc) =>
      toc.html.startsWith(filePathPrefix),
    );
    if (toc === undefined) {
      console.error(`tableref: ${filePathPrefix} が見つかりませんでした。`);
      return "";
    }
    const caption = toc.captions.find(
      ({ title, id }) =>
        title.startsWith(titleOrId) || id.startsWith(titleOrId),
    );
    if (caption === undefined) {
      console.error(
        `tableref: ${filePathPrefix} に ${titleOrId} が見つかりませんでした。`,
      );
      return "";
    }
    const { html } = toc;
    return new Handlebars.SafeString(
      `<a class="tableref" href="${html}#table-${caption.id}">${caption.title}</a>`,
    );
  });
};
