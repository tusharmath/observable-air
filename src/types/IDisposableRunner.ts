/**
 * Created by tushar.mathur on 04/10/16.
 */

import {IDisposable} from './IDisposable';

export interface IDisposableRunner extends IDisposable {
  run (): IDisposableRunner
}
