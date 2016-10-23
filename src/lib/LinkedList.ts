/**
 * Created by tushar.mathur on 09/10/16.
 */


export class LinkedListNode<T> {
  public left: LinkedListNode<T> | undefined
  public right: LinkedListNode<T> | undefined

  constructor (public value: T) {
    this.right = undefined
    this.left = undefined
  }

  static of <T> (val: T) {
    return new LinkedListNode(val)
  }
}

export class LinkedList<T> {
  public length: number
  private __head: LinkedListNode<T> | undefined

  constructor () {
    this.length = 0
    this.__head = undefined
  }

  element () {
    return this.__head
  }

  add (val: T) {
    const node = LinkedListNode.of(val)
    if (!this.__head) {
      this.__head = node
    } else {
      this.__head.right = node
      node.left = this.__head
      this.__head = node
    }
    this.length++
    return node
  }

  forEach (f: ((value: T) => void)) {
    var node = this.__head
    while (node) {
      f(node.value)
      node = node.left
    }
  }

  remove (n: LinkedListNode<T>) {
    if (n.left && n.right) {
      n.left.right = n.right
      n.right.left = n.left
    }
    else if (n.left) {
      this.__head = n.left
      n.left.right = undefined
    }
    else if (n.right) {
      n.right.left = undefined
    } else {
      this.__head = undefined
    }
    this.length--
  }

  static of<T> () {
    return new LinkedList<T>()
  }
}
