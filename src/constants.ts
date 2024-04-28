import simplePlantUML from "@akebifiky/remark-simple-plantuml";
import rehypeShiki from "@shikijs/rehype";
import {
  transformerMetaHighlight,
  transformerMetaWordHighlight,
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
  transformerRenderWhitespace,
} from "@shikijs/transformers";
import rehypeMermaid from "rehype-mermaid";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

import { VFile } from "remark-rehype/lib";
import { Node } from "unified/lib";
import { matter } from "vfile-matter";
import codeBlockApplyTitlePlugin from "./codeBlockApplyTitlePlugin";
import imageApplyAttributesFromTitlePlugin from "./imageApplyAttributesFromTitlePlugin";
import imageAttributesToTitlePlugin from "./imageAttributesToTitlePlugin";
import mermaidApplyTitlePlugin from "./mermaidApplyTitlePlugin";
import tableApplyTitlePlugin from "./tableApplyTitlePlugin";

// Handlebarsのオプション
export const handlebarCompileOptions: CompileOptions = {
  noEscape: true, // HTMLエスケープをしない
};

export const distDir = "dist";
export const docsDir = "docs";

export const lockFileSrcPath = "src/lockfile";
export const lockFileDistPath = "dist/lockfile";

export const chapterTemplateHtmlPath = "src/chapter-template.html";

export const appendixTitle = "Appendix";
export const appendixDistPath = "dist/appendix.dist.html";
export const appendixTemplateHtmlPath = "src/appendix-template.html";

export const colophonTitle = "奥付";
export const colophonDistPath = "dist/colophon.dist.html";
export const colophonTemplateHtmlPath = "src/colophon-template.html";

export const profileTitle = "著者プロフィール";
export const profileDistPath = "dist/profile.dist.html";
export const profileTemplateHtmlPath = "src/profile-template.html";

export const introductionDocPath = "docs/_introduction.md";
export const finallyDocPath = "docs/_finally.md";
export const introductionDistPath = "dist/_introduction.dist.html";
export const finallyDistPath = "dist/_finally.dist.html";
export const introductionTemplateHtmlPath = "src/introduction-template.html";

export const tocDistPath = "dist/toc.dist.html";

export const coverTemplateHtmlPath = "src/cover-template.html";
export const frontCoverDistPath = "dist/front-cover.dist.html";
export const backCoverDistPath = "dist/back-cover.dist.html";
export const startCoverDistPath = "dist/start-cover.dist.html";
export const endCoverDistPath = "dist/end-cover.dist.html";
export const coverDistPaths = [
  { path: frontCoverDistPath, image: "front-cover.png" },
  { path: backCoverDistPath, image: "back-cover.png" },
  { path: startCoverDistPath, image: "start-cover.png" },
  { path: endCoverDistPath, image: "end-cover.png" },
];

// unifiedのプロセッサを作成する
export const processorRehype = unified()
  .use(remarkParse)
  // DOCS: https://github.com/remarkjs/remark-frontmatter
  .use(remarkFrontmatter, { type: "yaml", marker: "-" })
  .use(() => (_tree: Node, file: VFile) => {
    matter(file, { strip: true });
  })
  .use(remarkGfm)
  // .use(remarkToc, { ordered: false })
  // DOCS: https://github.com/akebifiky/remark-simple-plantuml
  .use(simplePlantUML)
  .use(imageAttributesToTitlePlugin)
  .use(remarkRehype, { allowDangerousHtml: true })
  .use(imageApplyAttributesFromTitlePlugin)
  .use(rehypeSlug)
  // DOCS: https://github.com/remcohaszing/rehype-mermaid
  .use(rehypeMermaid, {
    // The default strategy is 'inline-svg'
    strategy: "img-png",
    // strategy: 'img-svg'
    // strategy: 'inline-svg'
    // strategy: 'pre-mermaid'
  })
  .use(codeBlockApplyTitlePlugin)
  .use(mermaidApplyTitlePlugin)
  .use(tableApplyTitlePlugin)
  // DOCS: https://shiki.style/packages/rehype
  .use(rehypeShiki, {
    themes: {
      light: "min-light",
      dark: "min-light",
    },
    transformers: [
      // DOCS: https://shiki.style/packages/transformers
      transformerNotationDiff(),
      transformerNotationHighlight(),
      transformerNotationWordHighlight(),
      transformerNotationFocus(),
      transformerNotationErrorLevel(),
      transformerRenderWhitespace(),
      transformerMetaHighlight(),
      transformerMetaWordHighlight(),
    ],
  });

export const processor = processorRehype.use(rehypeStringify, {
  allowDangerousHtml: true,
});
