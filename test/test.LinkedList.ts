/**
 * Created by tushar.mathur on 09/10/16.
 */


import test from 'ava';
import {LinkedList} from '../src/lib/LinkedList';

function toArray<T> (q: LinkedList<T>) {
  let n = q.element()
  if (!n) return []
  const arr = [n.value]
  while (n.left) {
    n = n.left
    arr.push(n.value)
  }
  return arr.reverse()
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
  t.deepEqual(toArray(q), ['A', 'B', 'C', 'D'])
  t.is(q.length, 4)
})

test('remove(): Remove First (non-empty)', t => {
  const q = LinkedList.of()
  const a = q.add('A')
  const b = q.add('B')
  const c = q.add('C')

  q.remove(a)
  t.deepEqual(toArray(q), ['B', 'C'])
  t.is(q.length, 2)
})

test('remove(): Remove LAST (non-empty)', t => {
  const q = LinkedList.of()
  const a = q.add('A')
  const b = q.add('B')
  const c = q.add('C')
  q.remove(c)
  t.deepEqual(toArray(q), ['A', 'B'])
  t.is(q.length, 2)
})


test('remove(): Remove MIDDLE (non-empty)', t => {
  const q = LinkedList.of()
  const a = q.add('A')
  const b = q.add('B')
  const c = q.add('C')

  q.remove(b)
  t.deepEqual(toArray(q), ['A', 'C'])
  t.is(q.length, 2)
})


test('remove(): Remove LAST', t => {
  const q = LinkedList.of()
  const a = q.add('A')
  q.remove(a)
  t.deepEqual(toArray(q), [])
  t.is(q.length, 0)
})
