[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![cover][cover]][cover-url]
[![code style][style]][style-url]
[![chat][chat]][chat-url]

<div align="center">
  <img width="100" height="100" title="CLI" src="http://postcss.github.io/postcss-cli/logo.svg">
  <a href="https://github.com/postcss/postcss">
    <img width="110" height="110" title="PostCSS" src="http://postcss.github.io/postcss/logo.svg" hspace="10">
  </a>
  <h1>PostCSS CLI</h1>
</div>

<h2 align="center">Install</h2>

```bash
npm i -g|-D postcss-cli
```

<h2 align="center">Usage</h2>

```bash
postcss [input.css] [OPTIONS] [-o|--output output.css] [-w|--watch]
```

The input may also be a glob:

```bash
postcss src/*.css [OPTIONS]
```

Recursively read a directory:

```bash
postcss src/**/*.css [OPTIONS]
```

> ⚠️  If there are multiple input files, the --dir or --replace option must be passed.

```bash
cat input.css | postcss [OPTIONS] > output.css
```

> ⚠️  If no input files are passed, it reads from stdin. If neither -o, --dir, or
--replace is passed, it writes to stdout.

<h2 align="center">Options</h2>

|Name|Type|Default|Description|
|:---|:--:|:-----:|:----------|
|`-d, --dir`|`{String}`|`undefined`|Output Directory|
|`-b, --base`|`{String}`|`undefined`|Use together with `--dir` for keeping directory structure.|
|`-x, --ext`|`{String}`|`extname(output)`|Output File Extension|
|`-o, --output`|`{String}`|`undefined`|Output File|
|`-r, --replace`|`{String}`|`undefined`|Replace Input <=> Output|
|`-p, --parser`|`{String}`|`undefined`|Custom PostCSS Parser|
|`-s, --syntax`|`{String}`|`undefined`|Custom PostCSS Syntax|
|`-t, --stringifier`|`{String}`|`undefined`|Custom PostCSS Stringifier|
|`-w, --watch`|`{Boolean}`|`false`|Enable Watch Mode|
|`--poll`|`{Boolean\|Number}`|`100`|Use polling for file watching. Can optionally pass polling interval; default 100 ms|
|`-u, --use`|`{Array}`|`[]`|PostCSS Plugins|
|`-m, --map`|`{Boolean}`|`{ inline: true }`|External Sourcemaps|
|`--no-map`|`{Boolean}`|`false`|Disable Sourcemaps|
|`-e, --env`|`{String}`|`process.env.NODE_ENV`|Sets `$NODE_ENV`|
|`-c, --config`|`{String}`|`dirname(file)`|PostCSS Config Path `postcss.config.js`|
|`-h, --help`|`{Boolean}`|`false`|CLI Help|
|`-v, --version`|`{Boolean}`|`false`|CLI Version|


> ℹ️  More details on custom parsers, stringifiers and syntaxes, can be found [here](https://github.com/postcss/postcss#syntaxes).

### [Config](https://github.com/michael-ciniawsky/postcss-load-config)

If you need to pass options to your plugins, or have a long plugin chain, you'll want to use a configuration file.

**postcss.config.js**
```js
module.exports = {
  parser: 'sugarss',
  plugins: [
    require('postcss-import')({...options}),
    require('postcss-url')({ url: 'copy', useHash: true })
  ]
}
```

Note that you **can not** set the `from` or `to` options for postcss in the config file. They are set automatically based on the CLI arguments.

### Context

For more advanced usage it's recommend to to use a function in `postcss.config.js`, this gives you access to the CLI context to dynamically apply options and plugins **per file**

|Name|Type|Default|Description|
|:--:|:--:|:-----:|:----------|
|`env`|`{String}`|`'development'`|process.env.NODE_ENV|
|`file`|`{Object}`|`dirname, basename, extname`|File|
|`options`|`{Object}`|`map, parser, syntax, stringifier`|PostCSS Options|

**postcss.config.js**
```js
module.exports = (ctx) => ({
  map: ctx.options.map,
  parser: ctx.file.extname === '.sss' ? 'sugarss' : false,
  plugins: {
    'postcss-import': { root: ctx.file.dirname },
    'cssnano': ctx.env === 'production' ? {} : false
  }
})
```

> ⚠️  If you want to set options via CLI, it's mandatory to reference `ctx.options` in `postcss.config.js`


```bash
postcss input.sss -p sugarss -o output.css -m
```

**postcss.config.js**
```js
module.exports = (ctx) => ({
  map: ctx.options.map,
  parser: ctx.options.parser,
  plugins: {
    'postcss-import': { root: ctx.file.dirname },
    'cssnano': ctx.env === 'production' ? {} : false
  }
})
```


[npm]: https://img.shields.io/npm/v/postcss-cli.svg
[npm-url]: https://npmjs.com/package/postcss-cli

[node]: https://img.shields.io/node/v/postcss-cli.svg
[node-url]: https://nodejs.org/

[deps]: https://img.shields.io/gemnasium/postcss/postcss-cli.svg
[deps-url]: https://gemnasium.com/postcss/postcss-cli

[tests]: http://img.shields.io/travis/postcss/postcss-cli/master.svg
[tests-url]: https://travis-ci.org/postcss/postcss-cli

[style]: https://img.shields.io/badge/code%20style-standard-yellow.svg
[style-url]: http://standardjs.com/

[cover]: https://img.shields.io/coveralls/postcss/postcss-cli/master.svg
[cover-url]: https://coveralls.io/github/postcss/postcss-cli

[chat]: https://img.shields.io/gitter/room/postcss/postcss.svg
[chat-url]: https://gitter.im/postcss/postcss
