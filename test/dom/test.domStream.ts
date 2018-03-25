import {assert} from 'chai'
import * as O from 'observable-air'
import {EventStart} from 'observable-air/src/core/internal/Events'
import {createTestScheduler, EVENT} from 'observable-air/test'
import {domStream} from '../../src/dom/domStream'
import {html} from '../../src/dom/html'

const node = (results: any[]) => (results[0] ? results[0].value : null)
describe('domStream', () => {
  it('should create a new HTMLElement', () => {
    const sh = createTestScheduler()
    const {results} = sh.start(() => domStream('div.a', {}, [O.of('XXX')]))
    const expected = [
      EVENT.next(202, html(`<div class="a"><span>XXX</span></div>`)),
      EVENT.complete(202)
    ]
    assert.deepEqual(results, expected)
  })

  it('should attach child HTMLElement', () => {
    const sh = createTestScheduler()
    const {results} = sh.start(() =>
      domStream('div.a', {}, [O.of('A'), O.of('B')])
    )
    const expected = [
      EVENT.next(
        202,
        html(`<div class="a"><span>A</span><span>B</span></div>`)
      ),
      EVENT.complete(202)
    ]
    assert.deepEqual(results, expected)
  })

  it('should maintain child order', () => {
    const sh = createTestScheduler()
    const {results} = sh.subscribeTo(() =>
      domStream('div.a', {}, [sh.Hot('---A|'), sh.Hot('--B---|')])
    )
    sh.advanceTo(201)
    assert.deepEqual(node(results), null)
    sh.advanceTo(202)
    assert.deepEqual(node(results), html(`<div class="a"><span>B</span></div>`))
    sh.advanceTo(203)
    assert.deepEqual(
      node(results),
      html(`<div class="a"><span>A</span><span>B</span></div>`)
    )
    sh.advanceTo(2000)
    assert.deepEqual(results, [
      EVENT.next(
        202,
        html(`<div class="a"><span>A</span><span>B</span></div>`)
      ),
      EVENT.complete(206)
    ])
  })

  it('should wait for children before inserting into dom', () => {
    const sh = createTestScheduler()
    const {results} = sh.start(() =>
      domStream('div.a', {}, [sh.Hot('-----A----|')])
    )
    const expected = [
      EVENT.next(205, html(`<div class="a"><span>A</span></div>`)),
      EVENT.complete(210)
    ]
    assert.deepEqual(results, expected)
  })

  it('should update child nodes with time', () => {
    const sh = createTestScheduler()
    const {results} = sh.subscribeTo(() =>
      domStream('div.a', {}, [sh.Hot('--ABC|')])
    )
    sh.advanceTo(201)
    assert.deepEqual(node(results), null)
    sh.advanceTo(202)
    assert.deepEqual(node(results), html(`<div class="a"><span>A</span></div>`))
    sh.advanceTo(203)
    assert.deepEqual(node(results), html(`<div class="a"><span>B</span></div>`))
    sh.advanceTo(204)
    assert.deepEqual(node(results), html(`<div class="a"><span>C</span></div>`))

    sh.advanceTo(205)
    assert.deepEqual(results, [
      EVENT.next(202, html(`<div class="a"><span>C</span></div>`)),
      EVENT.complete(205)
    ])
  })

  it('should update text without create a new span', () => {
    const sh = createTestScheduler()
    const {results} = sh.subscribeTo(() =>
      domStream('div.a', {}, [sh.Hot('--AB|')])
    )
    sh.advanceTo(202)
    const div210 = node(results)
    const span210 = div210.childNodes[0]
    assert.deepEqual(div210, html(`<div class="a"><span>A</span></div>`))

    sh.advanceTo(203)
    const div220 = node(results)
    const span220 = div220.childNodes[0]
    assert.deepEqual(div220, html(`<div class="a"><span>B</span></div>`))

    assert.strictEqual(div210, div220)
    assert.strictEqual(span210, span220)
  })

  it('should set style$', () => {
    const sh = createTestScheduler()
    const {results} = sh.start(() =>
      domStream(
        'div.a',
        {
          style: O.of({transform: 'translateX(10px)'})
        },
        [O.of('A')]
      )
    )
    const htmlString = `<div class="a" style="transform: translateX(10px);"><span>A</span></div>`
    const expected = [EVENT.next(202, html(htmlString)), EVENT.complete(202)]
    assert.deepEqual(results, expected)
    assert.deepEqual(node(results), html(htmlString))
  })

  it('should unsubscribe from style$', () => {
    const sh = createTestScheduler()
    const style$ = sh.Hot([EVENT.next(2100, {transform: 'translateX(10px)'})])

    sh.start(() => domStream('div.a', {style: style$}, [O.of('A')]))
    const actual = style$.subscriptions
    const subscription = <EventStart>style$.subscriptions[0]
    const expected = [
      EVENT.start(202, subscription.subscription),
      EVENT.end(2000, subscription.subscription)
    ]
    assert.deepEqual(actual, expected)
  })

  it('should set attr$', () => {
    const sh = createTestScheduler()
    const {results} = sh.start(() =>
      domStream(
        'a',
        {
          attrs: O.of({href: '/home.html'})
        },
        [O.of('A')]
      )
    )
    const htmlString = `<a href="/home.html"><span>A</span></a>`
    const expected = [EVENT.next(202, html(htmlString)), EVENT.complete(202)]
    assert.deepEqual(results, expected)
    assert.deepEqual(node(results), html(htmlString))
  })

  it('should unsubscribe from style$', () => {
    const sh = createTestScheduler()
    const attrs$ = sh.Hot(EVENT.next(2010, {href: '/home.html'}))
    sh.start(() =>
      domStream(
        'a',
        {
          attrs: attrs$
        },
        [O.of('A')]
      )
    )
    const actual = attrs$.subscriptions
    const subscription = <EventStart>attrs$.subscriptions[0]
    const expected = [
      EVENT.start(202, subscription.subscription),
      EVENT.end(2000, subscription.subscription)
    ]
    assert.deepEqual(actual, expected)
  })
})
