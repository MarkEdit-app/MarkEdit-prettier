# MarkEdit-prettier

Prettier for [MarkEdit](https://github.com/MarkEdit-app/MarkEdit) that leverages [markedit-api](https://github.com/MarkEdit-app/MarkEdit-api).

## Installation

Install this extension from the [MarkEdit Extension Registry](https://markedit-app.github.io/extensions/#markedit-prettier).

## Usage

Run `Prettify Content` from the menu bar or press `Shift-Control-Command-P`, then review the inline diff and choose `Discard` or `Apply`.

## Settings

In [settings.json](https://github.com/MarkEdit-app/MarkEdit/wiki/Customization#advanced-settings), define `extension.markeditPrettier` using [Prettier options](https://prettier.io/docs/options). This default-equivalent configuration works well for GitHub-flavored Markdown:

```json
{
  "extension.markeditPrettier": {
    "printWidth": 80,
    "proseWrap": "preserve",
    "tabWidth": 2,
    "useTabs": false
  }
}
```

Options that affect Markdown formatting:

- `printWidth` (default: `80`): Preferred line width.
- `proseWrap` (default: `"preserve"`): Prose wrapping mode: `"always"`, `"never"`, or `"preserve"`.
- `tabWidth` (default: `2`): Spaces per indentation level.
- `useTabs` (default: `false`): Use tabs for indentation.
- `endOfLine` (default: `"lf"`): Line ending: `"lf"`, `"crlf"`, `"cr"`, or `"auto"`.
- `rangeStart` (default: `0`): Start character offset for partial formatting.
- `rangeEnd` (default: end of document): End character offset for partial formatting.
- `requirePragma` (default: `false`): Format only documents containing `@format` or `@prettier`.
- `insertPragma` (default: `false`): Add an `@format` marker to the document.
- `checkIgnorePragma` (default: `false`): Skip documents containing `@noformat` or `@noprettier`.

Omit options to use Prettier's defaults. The extension always uses Prettier's Markdown parser, which supports CommonMark and GitHub-flavored Markdown, so `parser` and `plugins` settings are ignored. `embeddedLanguageFormatting` has no effect because parsers for fenced code languages are not bundled.

## Building

```
yarn install
yarn build
```

`yarn build` also deploys the extension to your local MarkEdit installation.
