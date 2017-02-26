/**
 * Created by tushar on 26/02/17.
 */

const {version} = require('../package.json')
const ghPages = require('gh-pages')
const path = require('path')

ghPages.publish(path.join(__dirname, {message: `docs(gh-pages): publishing version ${version}`}, '../doc'), function (err: Error) {
  throw err
})