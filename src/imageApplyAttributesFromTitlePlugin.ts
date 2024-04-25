import { slug } from "github-slugger";
import { Element, Node } from "hast";
import { Plugin } from "unified";
import visit from "unist-util-visit";

const imageApplyAttributesFromTitlePlugin: Plugin = () => {
  return (tree: Node) => {
    visit<Element>(tree, "element", (node, index, parent) => {
      if (
        node.tagName === "img" &&
        node.properties?.title &&
        typeof node.properties.title === "string"
      ) {
        // Extract attributes from title and apply them to the image
        const attributes = node.properties.title.split("|");
        for (const attr of attributes) {
          const [key, value] = attr.split("=");
          if (key && value) {
            if (key === "className") {
              if (typeof node.properties.className === "string") {
                node.properties.className += ` embedImage ${value}`;
              } else {
                node.properties.className = `embedImage ${value}`;
              }
            } else {
              node.properties[key] = value;
            }
          }
        }
        node.properties.title = undefined;
      }
      if (
        node.tagName === "img" &&
        typeof index === "number" &&
        parent &&
        node.properties.src &&
        typeof node.properties.src === "string" &&
        node.properties.alt &&
        typeof node.properties.alt === "string"
      ) {
        // Create figure and figcaption elements
        const figcaption: Element = {
          type: "element",
          tagName: "figcaption",
          properties: {
            className: "embedImageCaption",
            id: slug(`image-${node.properties?.alt}`),
          },
          children: [{ type: "text", value: node.properties?.alt || "" }],
        };
        const figure: Element = {
          type: "element",
          tagName: "figure",
          properties: {
            className: "embedImageFigure",
          },
          children: [node, figcaption],
        };
        parent.children.splice(index, 1, figure);
      }
    });
  };
};

export default imageApplyAttributesFromTitlePlugin;
