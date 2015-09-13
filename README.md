# [![natron-cli][natron-img]][natron-url]
**Run Tasks from the Command-Line.**

[![npm][npm-img]][npm-url] [![gitter][gitter-img]][gitter-url]

This module is part of [Natron][natron-url] and contains the command-line utility for running tasks defined in the `natronfile`.

## Usage

```sh
$ natron {taskName} [{...taskArgs}]
```

## Example
`natronfile.js`

```js
export function greet(name: string): void {
  console.log(`Hello ${name}`);
}
```

`.natronrc`

```json
{
  "transpiler": "babel"
}
```

```sh
$ natron greet World
Hello World
Task 'greet' ... DONE
```

[natron-img]: http://static.natronjs.com/img/natronjs.svg
[natron-url]: http://natronjs.com
[npm-img]: http://img.shields.io/npm/v/natron-cli.svg
[npm-url]: https://npmjs.org/package/natron-cli
[gitter-img]: https://badges.gitter.im/Join%20Chat.svg
[gitter-url]: https://gitter.im/natronjs/natron
