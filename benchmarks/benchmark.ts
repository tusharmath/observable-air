/**
 * Created by tushar on 13/01/18.
 */

import * as hoe from 'hoe'
import * as snabbdom from 'snabbdom'
import {app} from './components/app'

const patch = snabbdom.init([
  require('snabbdom/modules/class').default,
  require('snabbdom/modules/style').default
])

const root = document.body.querySelector('.container')
let state = app.init()

const emitter = hoe.create<Action<any>>(action => {
  state = app.update(action, state)
  patch(root, app.view(emitter, state))
})

document.addEventListener('DOMContentLoaded', emitter.of('@@init').emit)
