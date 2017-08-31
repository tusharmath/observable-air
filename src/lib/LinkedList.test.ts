/**
 * Created by pankaj on 8/31/17.
 */
import {assert} from 'chai'
import {LinkedList, LinkedListNode} from './LinkedList'


describe('LinkedList', () => {
  function toArray<T>(q: LinkedList<T>) {
    const arr: Array<T> = []
    q.forEach(x => arr.push(x.value))
    return arr
  }
  it('constructor', () => {
    assert.ok(new LinkedList() instanceof LinkedList)
  })
  it('should add', () => {
    const q = new LinkedList()
    q.add('A')
    q.add('B')
    q.add('C')
    q.add('D')
    assert.equal((<LinkedListNode<string>>q.head()).value, 'A')
    assert.equal((<LinkedListNode<string>>q.tail()).value, 'D')
    assert.deepEqual(toArray(q), ['A', 'B', 'C', 'D'])
    assert.equal(q.length, 4)
  })
  it('should Remove First (non-empty)', () => {
    const q = new LinkedList()
    const a = q.add('A')
    q.add('B')
    q.add('C')
    q.remove(a)

    assert.equal((<LinkedListNode<string>>q.head()).value, 'B')
    assert.equal((<LinkedListNode<string>>q.tail()).value, 'C')
    assert.deepEqual(toArray(q), ['B', 'C'])
    assert.equal(q.length, 2)
  })
  it('should Remove LAST (non-empty)', () => {
    const q = new LinkedList()
    q.add('A')
    q.add('B')
    const c = q.add('C')
    q.remove(c)

    assert.equal((<LinkedListNode<string>>q.head()).value, 'A')
    assert.equal((<LinkedListNode<string>>q.tail()).value, 'B')
    assert.deepEqual(toArray(q), ['A', 'B'])
    assert.equal(q.length, 2)
  })
  it('should Remove MIDDLE (non-empty', () => {
    const q = new LinkedList()
    q.add('A')
    const b = q.add('B')
    q.add('C')

    q.remove(b)
    assert.equal((<LinkedListNode<string>>q.head()).value, 'A')
    assert.equal((<LinkedListNode<string>>q.tail()).value, 'C')
    assert.deepEqual(toArray(q), ['A', 'C'])
    assert.equal(q.length, 2)
  })
  it('should Remove LAST', () => {
    const q = new LinkedList()
    const a = q.add('A')
    q.remove(a)

    assert.equal(q.head(), undefined)
    assert.equal(q.tail(), undefined)
    assert.deepEqual(toArray(q), [])
    assert.equal(q.length, 0)
  })
  it('forEach', () => {
    const results: number[] = []
    const q = new LinkedList<number>()
    q.add(1)
    q.add(2)
    q.add(3)
    q.add(4)
    q.forEach(i => results.push(i.value * 100))
    assert.deepEqual(results, [100, 200, 300, 400])
  })
  it('should Remove LAST more than once', () => {
    const q = new LinkedList()
    const a = q.add('A')
    q.remove(a)
    q.remove(a)
    assert.equal(q.length, 0)
  })
})