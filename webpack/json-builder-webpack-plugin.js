// eslint-disable-next-line import/no-extraneous-dependencies
const { validate } = require('schema-utils');
const { Compilation, sources } = require('webpack');

const schema = {
  type: 'object',
  properties: {
    output: {
      type: 'string',
    },
    json: {
      type: 'object',
      additionalProperties: true,
    },
  },
  additionalProperties: false,
};

class JsonBuilderPlugin {
  options;

  json;

  constructor(options = {}) {
    validate(schema, options, { name: 'JsonBuilderPlugin' });
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.thisCompilation.tap('JsonBuilderPlugin', (compilation) => {
      const { output, json } = this.options;

      const jsonString = JSON.stringify(json);
      const source = new sources.RawSource(jsonString);

      compilation.hooks.processAssets.tap(
        {
          name: 'JsonBuilderPlugin',
          stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
        },
        () => {
          if (compilation.getAsset(output)) {
            compilation.updateAsset(output, source);
            return;
          }

          compilation.emitAsset(output, source);
        }
      );
    });
  }
}

module.exports = JsonBuilderPlugin;
