/**
 * Created by tushar.mathur on 11/10/16.
 */

'use strict'

const commonjs = require('rollup-plugin-commonjs')

export default {
  exports: 'named',
  entry: './src/main.js',
  dest: './.dist/main-es.js',
  plugins: [
    commonjs({})
  ]
}
