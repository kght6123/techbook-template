import { slug } from "github-slugger";
import { Element, Text } from "hast";
import { Plugin } from "unified";
import { Node, Parent } from "unist";
import visit from "unist-util-visit";
import { isTitleForComment, parseTitleForComment } from "./utility";

const mermaidApplyTitlePlugin: Plugin = () => {
  return (tree: Node) => {
    visit(
      tree,
      ["element", "raw"],
      (
        node: Element | Node,
        index: number | null,
        parent: Parent | undefined,
      ) => {
        // コメントからタイトルを取得して、コードブロックに適用する
        if (
          // コメントのチェック
          node.type === "raw" &&
          "value" in node &&
          typeof node.value === "string" &&
          isTitleForComment(node.value) &&
          // 親のチェック
          index !== null &&
          parent &&
          parent.children.length > index + 2
        ) {
          const titleText = parseTitleForComment(node.value);
          if (titleText) {
            const nextNode = parent.children[index + 2] as Element;
            if (nextNode && nextNode.tagName === "img") {
              // 次の要素がimgの場合、タイトルを適用する
              const figcaption: Element = {
                type: "element",
                tagName: "figcaption",
                properties: {
                  id: slug(`mermaid-${titleText}`),
                  className: "embedImageCaption",
                },
                children: [{ type: "text", value: titleText }],
              };
              const figure: Element = {
                type: "element",
                tagName: "figure",
                properties: {
                  className: "embedImageFigure",
                },
                children: [nextNode, figcaption],
              };
              parent.children[index + 2] = figure;
            }
          }
        }
      },
    );
  };
};

export default mermaidApplyTitlePlugin;
