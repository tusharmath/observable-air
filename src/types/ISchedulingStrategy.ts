import {IDisposable} from './IDisposable';
/**
 * Created by tushar.mathur on 04/10/16.
 */

export interface ISchedulingStrategy extends IDisposable {
  run(): IDisposable
}
