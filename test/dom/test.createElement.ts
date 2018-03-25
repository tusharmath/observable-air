import {assert} from 'chai'
import {createElement} from '../../src/dom/createElement'

describe('createElement', () => {
  it('should create a new dom element', () => {
    const el = createElement('div')
    const actual = el.nodeName
    const expected = 'DIV'
    assert.strictEqual(actual, expected)
  })

  it('should attach css classes', () => {
    const el = createElement('div.a.b')
    const actual = el.classList.toString()
    const expected = 'a b'
    assert.strictEqual(actual, expected)
  })
})
