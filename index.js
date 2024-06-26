import Typograf from "typograf";

/**
 * @typedef {import('typograf').TypografPrefs} TypografPrefs
 *
 * @typedef {object} PluginOptions
 * @property {TypografPrefs} [typografOptions] - Typograf options, defaults to `{ locale: 'ru' }`.
 * @property {(tp: Typograf) => void} [typografSetup] - Function that allows to customize typograf programmatically.
 */

/** @type {import('markdown-it').PluginWithOptions<PluginOptions>} */
export default function (md, opts) {
  const tp = new Typograf(opts?.typografOptions || { locale: "ru" });
  opts?.typografSetup?.(tp);

  /** @type {(token: import('markdown-it/lib/token.mjs').default) => void} */
  function execute(token) {
    if (token.children) {
      token.children.forEach(execute);
    } else if (token.content) {
      // console.debug(token)
      token.content = tp.execute(token.content);
    }
  }

  md.core.ruler.push("typograf", ({ tokens }) => {
    tokens.forEach(execute);
    return true;
  });
}
