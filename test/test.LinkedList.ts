/**
 * Created by tushar.mathur on 09/10/16.
 */
import * as t from  'assert'
import {LinkedList, LinkedListNode} from '../src/lib/LinkedList'

function toArray<T>(q: LinkedList<T>) {
  const arr: Array<T> = []
  q.forEach(x => arr.push(x.value))
  return arr
}
test('constructor()', () => {
  t.ok(new LinkedList() instanceof LinkedList)
})
test('add()', () => {
  const q = new LinkedList()
  q.add('A')
  q.add('B')
  q.add('C')
  q.add('D')
  t.strictEqual((<LinkedListNode<string>>q.head()).value, 'A')
  t.strictEqual((<LinkedListNode<string>>q.tail()).value, 'D')
  t.deepEqual(toArray(q), ['A', 'B', 'C', 'D'])
  t.strictEqual(q.length, 4)
})

test('remove(): Remove First (non-empty)', () => {
  const q = new LinkedList()
  const a = q.add('A')
  q.add('B')
  q.add('C')
  q.remove(a)

  t.strictEqual((<LinkedListNode<string>>q.head()).value, 'B')
  t.strictEqual((<LinkedListNode<string>>q.tail()).value, 'C')
  t.deepEqual(toArray(q), ['B', 'C'])
  t.strictEqual(q.length, 2)
})

test('remove(): Remove LAST (non-empty)', () => {
  const q = new LinkedList()
  q.add('A')
  q.add('B')
  const c = q.add('C')
  q.remove(c)

  t.strictEqual((<LinkedListNode<string>>q.head()).value, 'A')
  t.strictEqual((<LinkedListNode<string>>q.tail()).value, 'B')
  t.deepEqual(toArray(q), ['A', 'B'])
  t.strictEqual(q.length, 2)
})

test('remove(): Remove MIDDLE (non-empty)', () => {
  const q = new LinkedList()
  q.add('A')
  const b = q.add('B')
  q.add('C')

  q.remove(b)
  t.strictEqual((<LinkedListNode<string>>q.head()).value, 'A')
  t.strictEqual((<LinkedListNode<string>>q.tail()).value, 'C')
  t.deepEqual(toArray(q), ['A', 'C'])
  t.strictEqual(q.length, 2)
})

test('remove(): Remove LAST', () => {
  const q = new LinkedList()
  const a = q.add('A')
  q.remove(a)

  t.strictEqual(q.head(), undefined)
  t.strictEqual(q.tail(), undefined)
  t.deepEqual(toArray(q), [])
  t.strictEqual(q.length, 0)
})

test('forEach()', () => {
  const results: number[] = []
  const q = new LinkedList<number>()
  q.add(1)
  q.add(2)
  q.add(3)
  q.add(4)
  q.forEach(i => results.push(i.value * 100))
  t.deepEqual(results, [100, 200, 300, 400])
})

test('remove(): Remove LAST more than once', () => {
  const q = new LinkedList()
  const a = q.add('A')
  q.remove(a)
  q.remove(a)
  t.strictEqual(q.length, 0)
})
