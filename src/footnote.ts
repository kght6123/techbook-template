import Handlebars from "handlebars";

export const footnoteRegisterHelper = () => {
  Handlebars.registerHelper(
    "footnote-inline",
    (footnote) =>
      new Handlebars.SafeString(`
<span class="footnote-inline">(<span>${footnote}</span>)</span>
`),
  );
  Handlebars.registerHelper(
    "footnote",
    (footnote) =>
      new Handlebars.SafeString(`
<span class="footnote">${footnote}</span>
`),
  );
};
