import { slug } from "github-slugger";
import { Element, Text } from "hast";
import { Plugin } from "unified";
import { Node, Parent } from "unist";
import visit from "unist-util-visit";

const tableApplyTitlePlugin: Plugin = () => {
  return (tree: Node) => {
    visit(
      tree,
      ["element", "raw"],
      (
        node: Element | Node,
        index: number | null,
        parent: Parent | undefined,
      ) => {
        if (
          // コメントのチェック
          node.type === "raw" &&
          "value" in node &&
          typeof node.value === "string" &&
          node.value.includes("<!-- title:") &&
          // 親のチェック
          index !== null &&
          parent &&
          parent.children.length > index + 2
        ) {
          const titleText = node.value.replace(/<!-- title: (.*?) -->/, "$1");
          if (titleText) {
            const nextNode = parent.children[index + 2] as Element;
            if (nextNode && nextNode.tagName === "table") {
              // 次の要素がtableの場合、タイトルを適用する
              nextNode.children.push({
                type: "element",
                tagName: "caption",
                properties: {
                  id: slug(`table-${titleText}`),
                },
                children: [{ type: "text", value: titleText }],
              });
            }
          }
        }
      },
    );
  };
};

export default tableApplyTitlePlugin;
