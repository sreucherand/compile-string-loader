const LibraryTemplatePlugin = require('webpack/lib/LibraryTemplatePlugin');
const SingleEntryPlugin = require('webpack/lib/SingleEntryPlugin');

module.exports = function() {};

module.exports.pitch = function(request) {
  if (this.cacheable) {
    this.cacheable();
  }

  const callback = this.async();
  const loader = this;

  const childFilename = 'compile-string-output-filename';
  const subCache = 'subcache ' + __dirname + ' ' + this.request;

  const rootCompilation = (function(loader) {
    let compiler = loader._compiler;
    let compilation = loader._compilation;

    while (compiler.parentCompilation) {
      compilation = compiler.parentCompilation;
      compiler = compilation.compiler;
    }

    return compilation;
  })(this);

  const childCompiler = rootCompilation.createChildCompiler(
    'compile-string-loader',
    {
      filename: childFilename,
    }
  );

  new LibraryTemplatePlugin(null, 'commonjs2').apply(childCompiler);
  new SingleEntryPlugin(this.context, '!!' + request, 'child').apply(
    childCompiler
  );

  let source;

  const afterCompile = function(compilation, callback) {
    source =
      compilation.assets[childFilename] &&
      compilation.assets[childFilename].source();

    compilation.chunks.forEach(function(chunk) {
      chunk.files.forEach(function(file) {
        delete compilation.assets[file];
      });
    });

    callback();
  };

  const compilation = function(compilation) {
    if (compilation.cache) {
      if (!compilation.cache[subCache]) {
        compilation.cache[subCache] = {};
      }

      compilation.cache = compilation.cache[subCache];
    }
  };

  if (childCompiler.hooks) {
    childCompiler.hooks.afterCompile.tapAsync(
      'compile-string-compiler',
      afterCompile
    );
    childCompiler.hooks.compilation.tap('compile-string-compiler', compilation);
  } else {
    childCompiler.plugin('after-compile', compilation);
    childCompiler.plugin('compilation', compilation);
  }

  childCompiler.runAsChild(function(error, entries, compilation) {
    if (error) {
      callback(error, null);
    }

    if (!source) {
      return callback(new Error('Child compiler did not produce any content.'));
    }

    try {
      const content = loader.exec(source, request).default;

      if (typeof content !== 'string') {
        callback(new Error('Exported value is not a string.'));
      }

      callback(null, content);
    } catch (e) {
      callback(e);
    }
  });
};
