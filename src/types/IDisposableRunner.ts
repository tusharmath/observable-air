import {IDisposable} from './IDisposable';
/**
 * Created by tushar.mathur on 04/10/16.
 */

export interface IDisposableRunner extends IDisposable {
  run (): IDisposableRunner
}
