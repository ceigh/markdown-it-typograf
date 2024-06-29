# 📃 markdown-it-typograf

Tiny [markdown-it](https://markdown-it.github.io) plugin,
with [typograf](https://github.com/typograf/typograf) integration.

Check [demo](https://ceigh.github.io/markdown-it-typograf).

# Setup

```sh
npm install typograf markdown-it-typograf
```

# Usage

```js
import markdownit from "markdown-it";
import markdownitTypograf from "markdown-it-typograf";

const md = markdownit().use(markdownitTypograf, {
  // ...options
});
console.log(md.render('"Привет"')); // <p>«Привет»</p>\n
```

## Options

| Option            | Default            | Description                                                         |
| ----------------- | ------------------ | ------------------------------------------------------------------- |
| `typografOptions` | `{ locale: 'ru' }` | Options passed to [typograf](https://github.com/typograf/typograf). |
| `typografSetup`   | `undefined`        | Function to customize typograf programmatically.                    |

## Example

```js
const md = markdownit().use(markdownitTypograf, {
  typografOptions: {
    locale: "ru",
    disableRule: "*",
  },
  typografSetup(tp) {
    tp.enableRule("common/number/mathSigns");
  },
});
console.log(md.render("0 != 1")); // <p>0 ≠ 1</p>\n
```

# Development

```sh
bun install
bunx simple-git-hooks
bun run dev
```
