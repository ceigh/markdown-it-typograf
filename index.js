/**
 * @typedef {object} Options
 * @property {import('typograf').TypografPrefs} [typografOptions] - Typograf options, defaults to `{ locale: 'ru' }`.
 * @property {(tp: import('typograf').default) => void | Promise<void>} [typografSetup] - Function that allows to customize typograf programmatically.
 */

/** @type {import('markdown-it').PluginWithOptions<Options>} */
export default async function (md, opts) {
  const Typograf = (await import("typograf")).default;
  const tp = new Typograf(opts?.typografOptions || { locale: "ru" });
  await opts?.typografSetup?.(tp);

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
