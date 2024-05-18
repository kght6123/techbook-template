import { Element, Literal, Parent, Root } from "hast";
import QRCode from "qrcode";
import { Transformer } from "unified";
import { Node } from "unist";
import visit from "unist-util-visit";

const qrCodeCommentPrefix = "<!-- qrcode: ";

const rehypeAddQRToComments: () => Transformer = () => {
  return async (tree: Root) => {
    const promises: Promise<void>[] = [];
    const nodesToAdd: { index: number; parent: Parent; node: Element }[] = [];

    visit(tree, "raw", (node: Node, index, parent) => {
      const rawNode = node as Literal;
      const rawValue = String(rawNode.value).trim();

      if (rawValue.startsWith(qrCodeCommentPrefix)) {
        const url = rawValue
          .substring(qrCodeCommentPrefix.length)
          .replace("-->", "")
          .trim();
        if (url.startsWith("https://")) {
          const promise = generateQRCodeNode(url).then((qrCodeNode) => {
            if (qrCodeNode) {
              nodesToAdd.push({
                index: index as number,
                parent: parent as Parent,
                node: qrCodeNode,
              });
            }
          });
          promises.push(promise);
        }
      }
    });

    // Wait for all QR codes to be generated
    await Promise.all(promises);

    // Add QR codes to the tree
    for (const { index, parent, node } of nodesToAdd) {
      if (Array.isArray(parent.children)) {
        parent.children.splice(index + 1, 0, node);
      }
    }
  };
};

async function generateQRCodeNode(url: string): Promise<Element | null> {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(url);
    const qrCodeNode: Element = {
      type: "element",
      tagName: "figure",
      properties: {
        style: "display: flex; align-items: center; justify-content: center;",
      },
      children: [
        {
          type: "element",
          tagName: "img",
          properties: {
            src: qrCodeDataURL,
            alt: `QR code for ${url}`,
            width: 70,
            height: 70,
            style: "width: 70px; height: 70px;",
          },
          children: [],
        },
        {
          type: "element",
          tagName: "figcaption",
          properties: {
            style: "margin-left: 5px;", // Sets space between the image and text
          },
          children: [
            {
              type: "element",
              tagName: "a",
              properties: {
                href: url,
              },
              children: [
                {
                  type: "text",
                  value: url,
                },
              ],
            },
          ],
        },
      ],
    };

    return qrCodeNode;
  } catch (error) {
    console.error("Failed to generate QR code:", error);
    return null;
  }
}

export default rehypeAddQRToComments;
