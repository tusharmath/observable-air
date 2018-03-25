/**
 * Created by tushar.mathur on 11/10/16.
 */

'use strict'

const commonjs = require('rollup-plugin-commonjs')
const uglify = require('rollup-plugin-babili')

const input = './src/core/main.js'
const name = 'observable-air'

export = [
  {
    input,
    output: {
      exports: 'named',
      name: 'O',
      format: 'umd',
      file: `./.dist/${name}.umd.min.js`
    },
    plugins: [uglify(), commonjs({})]
  },
  {
    input,
    output: {
      exports: 'named',
      name: 'O',
      format: 'umd',
      file: `./.dist/${name}.umd.dev.js`
    },
    plugins: [commonjs({})]
  },
  {
    input,
    output: {
      format: 'es',
      file: `./.dist/${name}.es.dev.js`
    },
    plugins: [commonjs({})]
  },
  {
    input,
    output: {
      format: 'es',
      file: `./.dist/${name}.es.min.js`
    },
    plugins: [uglify(), commonjs({})]
  }
]
