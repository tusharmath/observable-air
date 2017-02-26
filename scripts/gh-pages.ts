/**
 * Created by tushar on 26/02/17.
 */

const {version} = require('../../package.json')
const ghPages = require('gh-pages')
const path = require('path')

const message = `docs(gh-pages): publishing version ${version}
[skip ci]`
ghPages.publish(path.join(__dirname, {message: message}, '../doc'), function (err: Error) {
  throw err
})