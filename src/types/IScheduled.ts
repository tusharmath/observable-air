/**
 * Created by tushar.mathur on 30/09/16.
 */

export interface IScheduled {
  run(): void
  readonly completed: boolean
}
