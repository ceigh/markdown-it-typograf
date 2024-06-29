///<reference types="bun" />

import { describe, test, expect } from "bun:test";
import markdownit from "markdown-it";
import markdownitTypograf from "./index.js";

/**
 * @param {import('markdown-it').Options} [options]
 * @param {import("./index.js").PluginOptions} [pluginOptions]
 * @returns {markdownit}
 */
function getMd(options = {}, pluginOptions) {
  return markdownit(options).use(markdownitTypograf, {
    typografOptions: {
      locale: "ru",
      disableRule: "*",
      enableRule: "common/number/mathSigns",
    },
    ...pluginOptions,
  });
}

/** @type {Array<[string, string]>} */
const CASES = [["!=", "≠"]];

describe("configuration", () => {
  test("typografOptions is optional", () => {
    expect(() => {
      const md = markdownit().use(markdownitTypograf, {
        typografSetup(tp) {
          tp.disableRule("*");
        },
      });
      md.render(CASES[0][0]);
    }).not.toThrow();
  });

  test("typografSetup is optional", () => {
    expect(() => {
      const md = markdownit().use(markdownitTypograf, {
        typografOptions: { locale: "ru", disableRule: "*" },
      });
      md.render(CASES[0][0]);
    }).not.toThrow();
  });

  test("plugin options is optional", () => {
    expect(() => {
      const md = markdownit().use(markdownitTypograf);
      md.render(CASES[0][0]);
    }).not.toThrow();
  });

  test("typografOptions in use", () => {
    const md = markdownit().use(markdownitTypograf, {
      typografOptions: {
        locale: "ru",
        disableRule: "*",
      },
    });
    expect(md.render("!=")).toBe("<p>!=</p>\n");
  });

  test("typografSetup in use", () => {
    const md = markdownit().use(markdownitTypograf, {
      typografSetup(tp) {
        tp.disableRule("*");
      },
    });
    expect(md.render("!=")).toBe("<p>!=</p>\n");
  });
});

describe("rendering", () => {
  test.each(CASES)("works on text", (i, o) => {
    const md = getMd();
    expect(md.render(i)).toBe(`<p>${o}</p>\n`);
  });

  test.each(CASES)("works in markdown", (i, o) => {
    const md = getMd();
    expect(md.render(`- ${i}`)).toBe(`<ul>\n<li>${o}</li>\n</ul>\n`);
  });

  test.each(CASES)("works in nested markdown", (i, o) => {
    const md = getMd();
    expect(md.render(`- ${i}\n  - ${i}`)).toBe(
      `<ul>\n<li>${o}\n<ul>\n<li>${o}</li>\n</ul>\n</li>\n</ul>\n`,
    );
  });

  test.each(CASES)("works in html", (i, o) => {
    const md = getMd({ html: true });
    expect(md.render(`<div>${i}</div>`)).toBe(`<div>${o}</div>`);
  });

  test.each(CASES)("works in nested html", (i, o) => {
    const md = getMd({ html: true });
    expect(md.render(`<div><div>${i}</div></div>`)).toBe(
      `<div><div>${o}</div></div>`,
    );
  });

  test.each(CASES)("safe tag works", (i, _o) => {
    const md = getMd(
      { html: true },
      {
        typografSetup(tp) {
          tp.addSafeTag("<no-tp>", "</no-tp>");
        },
      },
    );
    expect(md.render(`<div><no-tp>${i}</no-tp></div>`)).toBe(
      `<div><no-tp>${i}</no-tp></div>`,
    );
  });
});
