interface ISafeFunction<V, C> {
  call(ctx: C, ...t: any[]): ISafeValue<V>
}
