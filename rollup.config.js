/**
 * Created by tushar.mathur on 11/10/16.
 */

'use strict'

import commonjs from 'rollup-plugin-commonjs'

export default {
  exports: 'named',
  entry: './.dist/src/main.js',
  dest: './.dist/main-es.js',
  plugins: [
    commonjs({})
  ]
}
