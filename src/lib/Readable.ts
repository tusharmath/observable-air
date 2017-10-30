
export interface Readable {
  on(event: string, listener: EventListener): void
  destroy(): void
}