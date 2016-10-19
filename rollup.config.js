/**
 * Created by tushar.mathur on 11/10/16.
 */

'use strict'

import typescript from 'rollup-plugin-typescript'

export default {
  entry: './src/main.ts',
  dest: './.dist/main-es.js',
  plugins: [
    typescript()
  ]
}
