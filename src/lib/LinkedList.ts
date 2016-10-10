/**
 * Created by tushar.mathur on 09/10/16.
 */


export class Node<T> {
  public left: Node<T> | null;
  public right: Node<T> | null;

  constructor (public value: T) {
    this.right = null
    this.left = null
  }

  static of <T> (val: T) {
    return new Node(val)
  }
}

export class LinkedList<T> {
  public length: number
  private __head: Node<T> | null;

  constructor () {
    this.length = 0
    this.__head = null
  }

  element () {
    return this.__head
  }

  add (val: T) {
    const node = Node.of(val)
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

  remove (n: Node<T>) {
    if (n.left && n.right) {
      n.left.right = n.right
      n.right.left = n.left
    }
    else if (n.left) {
      this.__head = n.left
      n.left.right = null
    }
    else if (n.right) {
      n.right.left = null
    } else {
      this.__head = null
    }
    this.length--
  }

  static of<T> () {
    return new LinkedList<T>()
  }
}
