/**
 * Created by tushar.mathur on 11/10/16.
 */

'use strict'

import commonjs from 'rollup-plugin-commonjs'
import uglify from 'rollup-plugin-babili'
import resolve from 'rollup-plugin-node-resolve'

export default [{
  input: './src/main.js',
  output: {
    exports: 'named',
    name: 'O',
    format: 'umd',
    file: './.dist/observable-air.js',
  },
  plugins: [
    uglify(),
    commonjs({}),
  ]
},

  {
    input: './benchmarks/benchmark.js',
    output: {
      format: 'es',
      file: './.dist/benchmark.js',
    },
    plugins: [
      commonjs({}),
      resolve()
    ]
  }
]
