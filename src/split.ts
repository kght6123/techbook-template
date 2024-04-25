import Handlebars from "handlebars";

Handlebars.registerHelper(
  "split",
  (value: string, index: number, separator: string | RegExp, limit?: number) =>
    value?.split(separator, limit)?.[index],
);
