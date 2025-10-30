type Listener = (data: any) => void

class Emitter {
  private listeners = new Set<Listener>()
  on(l: Listener) {
    this.listeners.add(l)
    return () => this.listeners.delete(l)
  }
  emit(data: any) {
    for (const l of this.listeners) l(data)
  }
}

export const realtime = new Emitter()

