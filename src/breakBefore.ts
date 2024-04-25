import Handlebars from "handlebars";

export const pageBreakRegisterHelper = () => {
  Handlebars.registerHelper(
    "page-break",
    () => new Handlebars.SafeString(`<div class="break-bf-page"></div>`),
  );
  Handlebars.registerHelper(
    "left-break",
    () => new Handlebars.SafeString(`<div class="break-bf-left"></div>`),
  );
  Handlebars.registerHelper(
    "right-break",
    () => new Handlebars.SafeString(`<div class="break-bf-right"></div>`),
  );
};
