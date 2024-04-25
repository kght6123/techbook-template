import { Plugin } from "unified";
import { Node } from "unist";
import visit from "unist-util-visit";

interface ImageNode extends Node {
  type: "image";
  alt?: string;
  title?: string;
  url: string;
}

const extractAttributes = (
  altText: string,
): [string, Record<string, string>] => {
  const attributes: Record<string, string> = {};
  let cleanAltText = altText;

  const attributeParts = altText.split(",");
  for (const part of attributeParts) {
    const [key, value] = part.split(":");
    if (key && value) {
      attributes[key.trim()] = value.trim();
    } else {
      // この部分が画像の実際のaltテキストとして扱われます
      cleanAltText = part.trim();
    }
  }
  return [cleanAltText, attributes];
};

const imageAttributesToTitlePlugin: Plugin = () => {
  return (tree: Node) => {
    visit<ImageNode>(tree, "image", (node) => {
      if (!node.alt) return;
      const [cleanAlt, attributes] = extractAttributes(node.alt);
      node.alt = cleanAlt;
      node.title = Object.entries(attributes)
        .map(([key, value]) => `${key}=${value}`)
        .join("|");
    });
  };
};

export default imageAttributesToTitlePlugin;
