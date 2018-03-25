import * as O from 'observable-air'
import {IObservable, Observable} from 'observable-air'
import {createElement} from './createElement'
import {CompositeSubscription} from 'observable-air/src/core/internal/Subscription'

export type Optional<T> = {[P in keyof T]?: T[P]}
export interface NodeProps {
  style?: IObservable<Optional<CSSStyleDeclaration>>
  attrs?: IObservable<{[key: string]: string}>
  props?: IObservable<{[key: string]: any}>
}
export type ReactiveElement = Node | string | number
export type NodeWithId = {node: ReactiveElement; id: number}

const toNode = (el: ReactiveElement) => {
  if (el instanceof Node) return el
  const node = createElement('span')
  node.textContent = el.toString()
  return node
}

const insertNode = (node: Node, child: NodeWithId) => {
  const newChild = toNode(child.node)
  // append before someone
  if (node.childNodes.length > child.id) {
    node.insertBefore(newChild, node.childNodes[child.id])
  } else {
    // default case: append to last
    node.appendChild(newChild)
  }
}

const removeNode = (node: Node, child: NodeWithId) => {
  node.removeChild(node.childNodes[child.id])
}

function updateNodeWithChild(node: Node, child: NodeWithId) {
  if (typeof child.node === 'string') {
    node.childNodes[child.id].textContent = child.node
  } else {
    removeNode(node, child)
    insertNode(node, child)
  }
}

const updateStyle = (node: HTMLElement, style: any) => {
  const nodeStyle: any = node.style
  for (var i in style) {
    const styleElement = style[i]
    if (style.hasOwnProperty(i) && nodeStyle[i] !== styleElement) {
      nodeStyle[i] = styleElement
    }
  }
}

const updateAttributes = (node: HTMLElement, attrs: any) => {
  for (var name in attrs) {
    const value = attrs[name]
    if (attrs.hasOwnProperty(name) && node.getAttribute(name) !== value) {
      node.setAttribute(name, value)
    }
  }
}

const NOOP = () => {}
export const domStream = (
  sel: string,
  prop: NodeProps,
  children: Array<IObservable<ReactiveElement>>
) =>
  new Observable((observer, scheduler) => {
    const cSub = new CompositeSubscription()
    var node: HTMLElement
    const childMap: {[key: number]: boolean} = {}
    const onError = (err: Error) => observer.error(err)

    const initializeNode = () => {
      node = createElement(sel)
      if (prop.style) {
        cSub.add(
          prop.style.subscribe(
            {
              next: style => updateStyle(node, style),
              complete: NOOP,
              error: onError
            },
            scheduler
          )
        )
      }

      if (prop.attrs) {
        cSub.add(
          prop.attrs.subscribe(
            {
              next: attrs => updateAttributes(node, attrs),
              complete: NOOP,
              error: onError
            },
            scheduler
          )
        )
      }
      return node
    }

    const childObserver = {
      next: (child: NodeWithId) => {
        if (childMap[child.id]) {
          updateNodeWithChild(node, child)
        } else {
          if (!node) {
            const node = initializeNode()
            insertNode(node, child)
            observer.next(node)
          } else {
            insertNode(node, child)
          }
        }
        childMap[child.id] = true
      },
      complete: () => observer.complete(),
      error: onError
    }

    cSub.add(
      O.merge(
        ...children.map((child$, id) => O.map(node => ({id, node}), child$))
      ).subscribe(childObserver, scheduler)
    )
    return cSub
  })
