// 参考 https://github.com/handlebars-lang/handlebars.js/issues/927#issuecomment-318640459
import Handlebars from "handlebars";

interface SwitchStack {
  switch_match: boolean;
  switch_value: unknown;
}

const __switch_stack__: SwitchStack[] = [];

Handlebars.registerHelper("switch", function (value, options) {
  __switch_stack__.push({
    switch_match: false,
    switch_value: value,
  });
  const html = options.fn(this);
  __switch_stack__.pop();
  return html;
});
Handlebars.registerHelper("case", function (...caseValues) {
  const options = caseValues.pop();
  const stack = __switch_stack__[__switch_stack__.length - 1];
  if (
    stack.switch_match ||
    // 完全一致を許可する
    (caseValues.some((v) => v === stack.switch_value) ||
      // 前方一致を許可する
      caseValues.some(
        (v) =>
          v !== "" &&
          stack.switch_value !== "" &&
          typeof v === "string" &&
          typeof stack.switch_value === "string" &&
          v.startsWith(stack.switch_value),
      ) ||
      // 後方一致を許可する
      caseValues.some(
        (v) =>
          v !== "" &&
          stack.switch_value !== "" &&
          typeof v === "string" &&
          typeof stack.switch_value === "string" &&
          v.endsWith(stack.switch_value),
      )) === false
  ) {
    return "";
  }
  stack.switch_match = true;
  return options.fn(this);
});
Handlebars.registerHelper("default", function (options) {
  const stack = __switch_stack__[__switch_stack__.length - 1];
  if (!stack.switch_match) {
    return options.fn(this);
  }
});
