type Callback<T> = (value: T) => void;

type Unsubscribe = () => void;

interface Store<T> {
  value: T
  set(value: T): void;
  subscribe(cb: Callback<T>): Unsubscribe
}


export function buildStore<T>(defaultValue: T): Store<T> {
  let value = defaultValue
  const subscribers: Record<string, Callback<T>> = {}
  const notify = () => Object.values(subscribers).forEach(cb => cb(value))

  return {
    get value() {
      return value;
    },
    set(newValue: T) {
      value = newValue;
      notify()
    },
    subscribe(cb: Callback<T>) {
      const uuid = crypto.randomUUID()
      subscribers[uuid] = cb

      cb(value)

      return () => {
        delete subscribers[uuid]
      }
    }
  }
}