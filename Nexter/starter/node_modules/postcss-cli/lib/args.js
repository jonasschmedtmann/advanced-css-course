'use strict'
const chalk = require('chalk')

const logo = `
                                      /|\\
                                    //   //
                                  //       //
                                //___*___*___//
                              //--*---------*--//
                            /|| *             * ||/
                          // ||*               *|| //
                        //   || *             * ||   //
                      //_____||___*_________*___||_____//
`

const version = () => {
  const cli = require('../package.json').version

  return chalk.bold.red(`
                                      /|\\
                                    //   //
                                  //       //
                                //___*___*___//
                              //--*---------*--//
                            /|| *             * ||/
                          // ||*    v${cli}     *|| //
                        //   || *             * ||   //
                      //_____||___*_________*___||_____//
  `)
}

module.exports = require('yargs')
  .usage(
    `${chalk.bold.red(logo)}
Usage:

  $0 [input.css] [OPTIONS] [--output|-o output.css] [--watch]`
  )
  .option('o', {
    alias: 'output',
    desc: 'Output file',
    type: 'string'
  })
  .option('d', {
    alias: 'dir',
    desc: 'Output directory',
    type: 'string'
  })
  .option('r', {
    alias: 'replace',
    desc: 'Replace (overwrite) the input file',
    type: 'boolean'
  })
  .option('u', {
    alias: 'use',
    desc: 'List of postcss plugins to use',
    type: 'array'
  })
  .option('p', {
    alias: 'parser',
    desc: 'Custom postcss parser',
    type: 'string'
  })
  .option('t', {
    alias: 'stringifier',
    desc: 'Custom postcss stringifier',
    type: 'string'
  })
  .option('s', {
    alias: 'syntax',
    desc: 'Custom postcss syntax',
    type: 'string'
  })
  .option('w', {
    alias: 'watch',
    desc: 'Watch files for changes and recompile as needed',
    type: 'boolean'
  })
  .option('poll', {
    desc:
      'Use polling for file watching. Can optionally pass polling interval; default 100 ms'
  })
  .option('x', {
    alias: 'ext',
    desc: 'Override the output file extension',
    type: 'string',
    coerce(ext) {
      if (ext.indexOf('.') !== 0) return `.${ext}`
      return ext
    }
  })
  .option('e', {
    alias: 'env',
    desc: 'A shortcut for setting NODE_ENV',
    type: 'string'
  })
  .option('b', {
    alias: 'base',
    desc:
      'Mirror the directory structure relative to this path in the output directory, this only works together with --dir',
    type: 'string'
  })
  .option('c', {
    alias: 'config',
    desc: 'Set a custom path to look for a config file',
    type: 'string'
  })
  .alias('m', 'map')
  .describe('m', 'Create an external sourcemap')
  .describe('no-map', 'Disable the default inline sourcemaps')
  .version(version)
  .alias('v', 'version')
  .help('h')
  .alias('h', 'help')
  .example('$0 input.css -o output.css', 'Basic usage')
  .example(
    'cat input.css | $0 -u autoprefixer > output.css',
    'Piping input & output'
  )
  .epilog(
    `If no input files are passed, it reads from stdin. If neither -o, --dir, or --replace is passed, it writes to stdout.

If there are multiple input files, the --dir or --replace option must be passed.

For more details, please see https://github.com/postcss/postcss-cli`
  ).argv
