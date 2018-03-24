interface IScheduler {
  delay(task: () => void, relativeTime: number): ISubscription

  periodic(task: () => void, interval: number): ISubscription

  frame(task: () => void): ISubscription

  frames(task: () => void): ISubscription

  asap(task: () => void): ISubscription

  now(): number
}
