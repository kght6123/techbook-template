import plugin from "tailwindcss/plugin";
// const flattenColorPalette = require("tailwindcss/src/util/flattenColorPalette");

import { type PluginAPI } from "tailwindcss/types/config";

// 参考: https://gist.github.com/Merott/d2a19b32db07565e94f10d13d11a8574?permalink_comment_id=4682185#gistcomment-4682185
export const colorVarsPlugin = ({ addBase, theme }: PluginAPI) => {
  const extractColorVars = (
    colorObj: Record<string, string>,
    colorGroup = "",
  ) =>
    Object.entries(colorObj).reduce((vars, [colorKey, value]) => {
      const cssVariable =
        colorKey === "DEFAULT"
          ? `--tw${colorGroup}`
          : `--tw${colorGroup}-${colorKey}`;

      const newVars: Record<string, string> =
        typeof value === "string"
          ? { [cssVariable]: value }
          : extractColorVars(value, `-${colorKey}`);

      return Object.assign(vars, newVars);
    }, {});
  addBase({
    ":root": extractColorVars(theme("colors")),
  });
};

/** @type {import('tailwindcss').Config} */
export default {
  corePlugins: {
    preflight: false,
  },
  separator: "--", // :で区切るとVivlioStyleがNG、_で区切るとTailwindCSSがNGなので、--で区切る https://github.com/tailwindlabs/tailwindcss-intellisense/issues/894 https://github.com/tailwindlabs/tailwindcss-intellisense/issues/442
  content: ["./dist/**/*.{html,htm}"],
  // safelist: [
  //   // 行ハイライト用、1-100行まで対応
  //   {
  //     pattern: /hl-(red|yellow)-200/,
  //     variants: [...Array(100)].map((_, i) => `scl-${i + 1}`),
  //   },
  // ],
  theme: {
    counterIncrement: {
      none: "none",
      page: "page",
    },
    breakBefore: {
      avoidPage: "avoid-page",
      page: "page",
      left: "left",
      right: "right",
      recto: "recto",
      verso: "verso",
    },
    extend: {
      colors: {
        primary: {
          800: 'var(--primary-color-800, theme("colors.slate.800"))',
          500: 'var(--primary-color-500, theme("colors.slate.500"))',
          400: 'var(--primary-color-400, theme("colors.slate.400"))',
          200: 'var(--primary-color-200, theme("colors.slate.200"))',
          50: 'var(--primary-color-50, theme("colors.slate.50"))',
        },
        secondary: {
          800: 'var(--secondary-color-800, theme("colors.neutral.800"))',
          500: 'var(--secondary-color-500, theme("colors.neutral.500"))',
          400: 'var(--secondary-color-400, theme("colors.neutral.400"))',
          200: 'var(--secondary-color-200, theme("colors.neutral.200"))',
          50: 'var(--secondary-color-50, theme("colors.neutral.50"))',
        },
      },
    },
  },
  plugins: [
    plugin(({ matchUtilities, matchVariant, theme }) => {
      matchUtilities(
        {
          // MEMO: ci-pageは使わないので、今のところ未使用。必要あれば使う。
          ci: (value) => ({
            counterIncrement: value,
          }),
          "target-counter": (value) => ({
            content: `leader(".") target-counter(attr(href),${value})`,
          }),
          counter: (value) => ({
            content: `counter(${value})`,
          }),
        },
        { values: theme("counterIncrement") },
      );
      matchUtilities(
        {
          "break-bf": (value) => ({
            breakBefore: value,
          }),
        },
        { values: theme("breakBefore") },
      );
      // matchVariant(
      //   "acl",
      //   (value) => `& > .astro-code > code > .line:nth-child(${value})`,
      //   {
      //     // 100行まで対応
      //     values: Object.fromEntries(
      //       new Map([...Array(100)].map((_, i) => [i + 1, `${i + 1}`])),
      //     ),
      //   },
      // );
      // matchVariant(
      //   "scl",
      //   (value) => `& > .shiki > code > .line:nth-child(${value})`,
      //   {
      //     // 100行まで対応
      //     values: Object.fromEntries(
      //       new Map([...Array(100)].map((_, i) => [i + 1, `${i + 1}`])),
      //     ),
      //   },
      // );
      // matchUtilities(
      //   {
      //     hl: (value) => ({
      //       "background-color": value,
      //       "padding-right": "1rem",
      //       width: "515px",
      //       display: "inline-block",
      //     }),
      //   },
      //   { values: flattenColorPalette(theme("colors", {})), type: "color" },
      // );
    }),
    colorVarsPlugin,
  ],
};
