interface IContainer {
  next<T>(value: T, id: number): void
  complete(id: number): boolean
  isDone(): boolean
  isOn(): boolean
  readonly values: any[]
}
