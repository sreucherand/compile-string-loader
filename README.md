# compile-string-loader

[![npm](https://img.shields.io/npm/v/compile-string-loader.svg)](https://www.npmjs.com/package/compile-string-loader)
[![Build Status](https://travis-ci.org/sreucherand/compile-string-loader.svg?branch=master)](https://travis-ci.org/sreucherand/compile-string-loader)

compile-string-loader module for Webpack.

## Usage

Compile and expose a string. Very handy for CSS in JS.

## Getting Started

To begin, you'll need to install `compile-string-loader`:

```console
$ yarn add compile-string-loader --dev
```

### Inline

```js
// App.js
import styles from 'style-loader!css-loader!compile-string-loader!babel-loader!./app.css.js';
```

### Config

```js
// webpack.config.js
{
  module: {
    rules: [
      {
        test: /\.css\.js$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            }
          },
          'compile-string-loader',
          'babel-loader'
        ]
      }
    ]
  }
}
```

## Example

```js
// colors.js
export const red = '#ff0000';
export const white = '#ffffff';
```

```js
// app.css.js
import * as colors from './colors';

export default `
  .myElement {
    background-color: ${colors.white};
    color: ${colors.red};
    width: 100%;
  }
`;
```

```js
// App.js
import { myElement } from './app.css.js';

const container = document.getElementById('container');

container.classList.add(myElement);
```

```js
// webpack.config.js
{
  module: {
    rules: [
      {
        test: /\.css\.js$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            }
          },
          'compile-string-loader',
          'babel-loader'
        ]
      }
    ]
  }
}
```

## Miscellaneous

compile-string-loader remains a loader. So if you were to write postcss, you might just wanna add a postcss-loader accordingly.

```js
// app.css.js
import * as colors from './colors';

// using postcss-nested
export default `
  .myElement {
    background-color: ${colors.white};
    color: ${colors.red};
    width: 100%;
    
    div {
      width: 50%;
    }
  }
`;
```

```js
// webpack.config.js
{
  module: {
    rules: [
      {
        test: /\.css\.js$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: true,
            }
          },
          'postcss-loader',
          'compile-string-loader',
          'babel-loader'
        ]
      }
    ]
  }
}
```

## License

#### [MIT](./LICENSE)
