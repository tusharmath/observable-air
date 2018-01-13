/**
 * Created by tushar on 13/01/18.
 */

import * as R from 'ramda'
import {h} from 'snabbdom'

type BenchmarkData = {name: string; ops?: number}
type SuiteData = {name: string; benchmarks: Array<BenchmarkData>}
type App = {
  name: string
  data: Array<SuiteData>
}

namespace theme {
  export const secondaryColor = '#888'
  export const light = '#EEE'
}

const init = (): App => {
  return {
    name: 'Observable Air',
    data: [
      {
        name: 'array ~ filter ~ map ~ reduce',
        benchmarks: [{name: 'air', ops: 450}, {name: 'rxjs', ops: 14}]
      },
      {
        name: 'array ~ scan ~ reduce',
        benchmarks: [{name: 'air', ops: 300}, {name: 'rxjs'}]
      }
    ]
  }
}

const update = (action: Action<any>, state: App) => {
  return state
}

const IconButton = (e: Hoe, icon: string) =>
  h(
    'button',
    {
      style: {
        margin: '0',
        padding: '0',
        border: '0',
        height: '32px',
        width: '32px'
      }
    },
    [h('i.material-icons', icon)]
  )

const BenchMark = (i: BenchmarkData) =>
  h(
    'div',
    {
      style: {
        minWidth: '100px',
        textAlign: 'center'
      }
    },
    [
      h(
        'div',
        {
          style: {
            textTransform: 'uppercase',
            fontWeight: '400',
            minHeight: '65px'
          }
        },
        [
          i.ops
            ? h('span', [
                h('span', {style: {fontSize: '3em'}}, i.ops.toString()),
                h(
                  'span',
                  {style: {color: theme.secondaryColor, marginLeft: '4px'}},
                  'op/s'
                )
              ])
            : h('span', {style: {fontSize: '3em'}}, '...')
        ]
      ),
      h(
        'div',
        {
          style: {
            color: theme.secondaryColor,
            padding: '0 8px'
          }
        },
        i.name
      )
    ]
  )

const Suite = R.curry((d: Hoe, s: SuiteData, i: number, l: Array<SuiteData>) =>
  h(
    'div',
    {
      style: {
        borderBottom: i === l.length - 1 ? '' : '1px solid #eee',
        margin: '30px',
        padding: '60px 0'
      }
    },
    [
      h(
        'div',
        {
          style: {
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }
        },
        [
          h(
            'div',
            {
              style: {
                textTransform: 'uppercase',
                letterSpacing: '4px'
              }
            },
            s.name
          ),
          IconButton(d, 'replay')
        ]
      ),
      h(
        'div',
        {style: {display: 'flex', justifyContent: 'space-between'}},
        s.benchmarks.map(BenchMark)
      )
    ]
  )
)

const view = (d: Hoe, state: App) => {
  return h('div.container', [
    h(
      'div',
      {
        style: {
          fontSize: '3em'
        }
      },
      state.name
    ),
    h(
      'div',
      {
        style: {
          maxWidth: '600px'
        }
      },
      state.data.map(Suite(d))
    )
  ])
}

export const app = {
  init,
  update,
  view
}
