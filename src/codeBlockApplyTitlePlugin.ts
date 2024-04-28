import { Element, Text } from "hast";
import { Plugin } from "unified";
import { Node, Parent } from "unist";
import visit from "unist-util-visit";

import { slug } from "github-slugger";
import {
  isTitleForComment,
  parseTitleForCodeMeta,
  parseTitleForComment,
} from "./utility";

const codeBlockApplyTitlePlugin: Plugin = () => {
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
            if (nextNode && nextNode.tagName === "pre") {
              // 次の要素がpreの場合、タイトルを適用する
              const titleElement: Element = {
                type: "element",
                tagName: "div",
                properties: { className: ["embedCode"] },
                children: [
                  nextNode,
                  {
                    type: "element",
                    tagName: "div",
                    properties: {
                      className: "embedCodeCaption",
                      id: slug(`code-${titleText}`),
                    },
                    children: [{ type: "text", value: titleText }],
                  },
                ],
              };
              parent.children[index + 2] = titleElement;
            }
          }
        }
        // コードブロックのmetaからタイトルを取得して、コードブロックに適用する
        if (
          // pre タグのチェック
          node.type === "element" &&
          "tagName" in node &&
          typeof node.tagName === "string" &&
          node.tagName === "pre" &&
          node.children.length > 0 &&
          // code タグのチェック
          node.children[0].type === "element" &&
          "tagName" in node.children[0] &&
          typeof node.children[0].tagName === "string" &&
          node.children[0].tagName === "code" &&
          // code タグのdataのチェック
          node.children[0].data &&
          "meta" in node.children[0].data &&
          typeof node.children[0].data.meta === "string" &&
          // 親のチェック
          index !== null &&
          parent
        ) {
          const titleText = parseTitleForCodeMeta(node.children[0].data.meta);
          if (titleText) {
            const titleElement: Element = {
              type: "element",
              tagName: "div",
              properties: { className: ["embedCode"] },
              children: [
                node,
                {
                  type: "element",
                  tagName: "div",
                  properties: {
                    className: "embedCodeCaption",
                    id: slug(`code-${titleText}`, true),
                  },
                  children: [{ type: "text", value: titleText }],
                },
              ],
            };
            parent.children[index] = titleElement;
          }
        }
      },
    );
  };
};

export default codeBlockApplyTitlePlugin;
