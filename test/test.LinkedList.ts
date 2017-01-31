/**
 * Created by tushar.mathur on 09/10/16.
 */
import test from 'ava'
import {LinkedList, LinkedListNode} from '../src/lib/LinkedList'

function toArray<T> (q: LinkedList<T>) {
  const arr: Array<T> = []
  q.forEach(x => arr.push(x.value))
  return arr
}
test('constructor()', t => {
  t.true(LinkedList.of() instanceof LinkedList)
})
test('add()', t => {
  const q = LinkedList.of()
  q.add('A')
  q.add('B')
  q.add('C')
  q.add('D')
  t.is((<LinkedListNode<string>> q.head()).value, 'A')
  t.is((<LinkedListNode<string>> q.tail()).value, 'D')
  t.deepEqual(toArray(q), ['A', 'B', 'C', 'D'])
  t.is(q.length, 4)
})

test('remove(): Remove First (non-empty)', t => {
  const q = LinkedList.of()
  const a = q.add('A')
  q.add('B')
  q.add('C')
  q.remove(a)

  t.is((<LinkedListNode<string>> q.head()).value, 'B')
  t.is((<LinkedListNode<string>> q.tail()).value, 'C')
  t.deepEqual(toArray(q), ['B', 'C'])
  t.is(q.length, 2)
})

test('remove(): Remove LAST (non-empty)', t => {
  const q = LinkedList.of()
  q.add('A')
  q.add('B')
  const c = q.add('C')
  q.remove(c)

  t.is((<LinkedListNode<string>> q.head()).value, 'A')
  t.is((<LinkedListNode<string>> q.tail()).value, 'B')
  t.deepEqual(toArray(q), ['A', 'B'])
  t.is(q.length, 2)
})


test('remove(): Remove MIDDLE (non-empty)', t => {
  const q = LinkedList.of()
  q.add('A')
  const b = q.add('B')
  q.add('C')

  q.remove(b)
  t.is((<LinkedListNode<string>> q.head()).value, 'A')
  t.is((<LinkedListNode<string>> q.tail()).value, 'C')
  t.deepEqual(toArray(q), ['A', 'C'])
  t.is(q.length, 2)
})


test('remove(): Remove LAST', t => {
  const q = LinkedList.of()
  const a = q.add('A')
  q.remove(a)

  t.is(q.head(), undefined)
  t.is(q.tail(), undefined)
  t.deepEqual(toArray(q), [])
  t.is(q.length, 0)
})

test('forEach()', t => {
  const results: number[] = []
  const q = LinkedList.of<number>()
  q.add(1)
  q.add(2)
  q.add(3)
  q.add(4)
  q.forEach(i => results.push(i.value * 100))
  t.deepEqual(results, [100, 200, 300, 400])
})


test('remove(): Remove LAST more than once', t => {
  const q = LinkedList.of()
  const a = q.add('A')
  q.remove(a)
  q.remove(a)
  t.is(q.length, 0)
})