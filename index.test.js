/// <reference types="bun" />

import { expect, test } from "bun:test";
import markdownit from "markdown-it";
import markdownItTypograf from "./index.js";

test("Quotes", () => {
  const md = markdownit({ html: true }).use(markdownItTypograf, {
    typografOptions: {
      locale: "ru",
      disableRule: "*",
      enableRule: ["common/html/quot", "common/punctuation/quote"],
    },
  });

  expect(md.renderInline('"test"')).toBe("«test»");
});
