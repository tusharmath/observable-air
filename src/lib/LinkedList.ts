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

// TODO: Use singly linked list
export class LinkedList<T> {
  public length = 0
  private __tail: LinkedListNode<T> | undefined = undefined
  private __head: LinkedListNode<T> | undefined = undefined

  tail () {
    return this.__tail
  }

  head () {
    return this.__head
  }


  add (val: T) {
    const node = LinkedListNode.of(val)
    if (this.length === 0) this.__head = node
    if (!this.__tail) {
      this.__tail = node
    } else {
      this.__tail.right = node
      node.left = this.__tail
      this.__tail = node
    }
    this.length++
    return node
  }

  forEach (f: ((value: LinkedListNode<T>) => void), ctx?: any) {
    var node = this.__head
    while (node) {
      f.call(ctx, node)
      node = node.right
    }
  }

  remove (n: LinkedListNode<T>) {
    if (n.left && n.right) {
      n.left.right = n.right
      n.right.left = n.left
    }
    else if (n.left) {
      this.__tail = n.left
      n.left.right = undefined
    }
    else if (n.right) {
      this.__head = n.right
      n.right.left = undefined
    } else {
      this.__tail = undefined
      this.__head = undefined
    }
    this.length--
  }

  static of<T> () {
    return new LinkedList<T>()
  }
}
