/**
 * Created by tushar.mathur on 15/10/16.
 */

export interface ICurriedFunction extends Function {
}

export interface ICurriedFunction0 <R> extends ICurriedFunction {
  (): R
}


export interface ICurriedFunction1 <T, R> extends ICurriedFunction {
  (t: T): R
}

export interface ICurriedFunction2 <T1, T2, R> extends ICurriedFunction {
  (t1: T1, t2: T2): R
  (t1: T1): ICurriedFunction1<T2, R>
}

export interface ICurriedFunction3 <T1, T2, T3, R> extends ICurriedFunction {
  (t1: T1, t2: T2, t3: T3): R
  (t1: T1, t2: T2): ICurriedFunction1<T3, R>
  (t1: T1): ICurriedFunction2<T2, T3, R>
}
