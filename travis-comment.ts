/**
 * Created by tushar.mathur on 13/11/16.
 */

const rp = require('request-promise')


let body = ''
process.stdin.resume()
process.stdin.setEncoding('utf8')
process.stdin.on('data', (chunk: string) => body += chunk)
process.stdin.on('end', () => main().then(
  x => console.log('PR updated'),
  function (err) {
    console.error(err.message)
  }
))

function getParams () {
  const [owner, repo] = process.env.TRAVIS_REPO_SLUG.split('/')
  return {
    owner, repo,
    number: process.env.TRAVIS_PULL_REQUEST
  }
}

async function main () {
  if (!process.env.TRAVIS_PULL_REQUEST) return
  const p = getParams()
  const uri = `https://api.github.com/repos/${p.owner}/${p.repo}/issues/${p.number}/comments`
  return rp({
    uri,
    method: 'POST',
    body: {body},
    json: true,
    headers: {'User-Agent': p.repo},
    qs: {access_token: process.env.GH_TOKEN}
  })
}
