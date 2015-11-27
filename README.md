# [![natron-cli][natron-img]][natron-url]

[natron-img]: http://static.natronjs.com/img/natronjs.svg
[natron-url]: http://natronjs.com/

**Run Tasks from the Command-Line**

[![Version][npm-img]][npm-url]
[![Downloads][dlm-img]][npm-url]
[![Build Status][travis-img]][travis-url]
[![Readme][readme-img]][readme-url]

[![Gitter Chat][gitter-img]][gitter-url]

[npm-img]: https://img.shields.io/npm/v/natron-cli.svg
[npm-url]: https://npmjs.org/package/natron-cli
[dlm-img]: https://img.shields.io/npm/dm/natron-cli.svg
[travis-img]: https://travis-ci.org/natronjs/natron-cli.svg
[travis-url]: https://travis-ci.org/natronjs/natron-cli
[readme-img]: https://img.shields.io/badge/read-me-orange.svg
[readme-url]: https://natron.readme.io/docs/module-natron-cli

[gitter-img]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/natronjs/natron

This module is part of [Natron][natron-url] and contains the
command-line utility for running tasks defined in the Natronfile.

## Documentation

See the [documentation for natron-cli][readme-url].

## Usage

```sh
$ natron taskName [...taskArgs]
```

## Example

`natronfile.js`
```js
export function greet(name) {
  console.log(`Hello ${name}`);
}
```

`.natronrc`
```json
{
  "transpiler": "babel"
}
```
