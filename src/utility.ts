import { Element } from "hast";

export const parseTitleForCodeMeta = (meta: string) =>
  meta
    .split(" ")
    .find((value) => value.startsWith("title:"))
    ?.replace("title:", "");

export const isTitleForComment = (comment: string) =>
  typeof comment === "string" && comment.includes("<!-- title:");

export const parseTitleForComment = (comment: string) =>
  comment.replace(/<!-- title: (.*?) -->/, "$1");
