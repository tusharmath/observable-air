/**
 * Created by tushar on 13/01/18.
 */

import {h} from 'snabbdom'

type App = {
  isLoading: true
}
const init = (): App => {
  return {
    isLoading: true
  }
}

const update = (action: Action<any>, state: App) => {
  return state
}

const view = (d: Hoe, state: App) => {
  return h('div.container', [
    h('h1', ['Observable Air vs The People'])
  ])
}

export const app = {
  init,
  update,
  view
}
