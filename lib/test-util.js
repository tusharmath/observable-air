/**
 * Created by tushar.mathur on 27/09/16.
 */

'use strict'

const logger = () => ({
  next: x => console.log(x),
  error: x => console.log('ERROR', x),
  complete: x => console.log('COMPLETE', x)
})

const testOB = (func) => {
  const results = []
  const subscription = func().subscribe({
    next: value => results.push({type: 'value', value}),
    error: value => results.push({type: 'error', value}),
    complete: value => results.push({type: 'complete', value})
  })
  return {subscription, results}
}

module.exports = {testOB, logger}
