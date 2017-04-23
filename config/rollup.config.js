/**
 * Created by tushar.mathur on 11/10/16.
 */

'use strict'

import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-babili'
export default {
  exports: 'named',
  entry: './src/main.js',
  dest: './.dist/observable-air.js',
  format: 'umd',
  moduleName: 'O',
  plugins: [
    uglify(),
    commonjs({}),
  ]
}
