const assert = require('assert');
const path = require('path');
const webpack = require('webpack');

const compile = function(name, config) {
  return new Promise(function(resolve, reject) {
    webpack(
      Object.assign(
        {
          context: path.resolve(__dirname, './entries'),
          output: {
            filename: 'bundle.js',
            libraryTarget: 'commonjs',
            path: path.resolve(__dirname, `./__expected__/${name}/`),
          },
          target: 'node',
        },
        config
      )
    ).run(function(error, stats) {
      if (error) {
        reject(error);
      }

      resolve(
        stats.toJson().children.map(function(item) {
          return item.chunks;
        })
      );
    });
  });
};

describe('should create chunk with appropriate content', function() {
  it('using rules', function(done) {
    compile('rules', {
      entry: './entry-rules.js',
      module: {
        rules: [
          {
            test: /\.string$/,
            use: ['raw-loader', '../../', 'babel-loader'],
          },
          {
            test: /\.js$/,
            use: {
              loader: 'babel-loader',
            },
          },
        ],
      },
    })
      .then(function(stats) {
        assert.strictEqual(stats.length, 1);
        assert.strictEqual(
          require('./__expected__/rules/bundle.js').default,
          'Hello world!'
        );

        done();
      })
      .catch(done);
  });

  it('using inline syntax', function(done) {
    compile('inline', {
      entry: './entry-inline.js',
      module: {
        rules: [
          {
            test: /\.js$/,
            use: {
              loader: 'babel-loader',
            },
          },
        ],
      },
    })
      .then(function(stats) {
        assert.strictEqual(stats.length, 1);
        assert.strictEqual(
          require('./__expected__/inline/bundle.js').default,
          'Hello world!'
        );

        done();
      })
      .catch(done);
  });
});
