/**
 * Created by tushar.mathur on 11/10/16.
 */

'use strict'

import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-babili'

const input = './src/main.js'
export default [
  {
    input,
    output: {
      exports: 'named',
      name: 'O',
      format: 'umd',
      file: './.dist/observable-air.umd.min.js'
    },
    plugins: [uglify(), commonjs({})]
  },
  {
    input,
    output: {
      exports: 'named',
      name: 'O',
      format: 'umd',
      file: './.dist/observable-air.umd.dev.js'
    },
    plugins: [commonjs({})]
  },
  {
    input,
    output: {
      format: 'es',
      file: './.dist/observable-air.es.dev.js'
    },
    plugins: [commonjs({})]
  },
  {
    input,
    output: {
      format: 'es',
      file: './.dist/observable-air.es.min.js'
    },
    plugins: [uglify(), commonjs({})]
  }
]
