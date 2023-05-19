import { buildStore } from "../common/store";

export interface AnalyticsEvent {
  type: string;
  payload: any;
}

const eventStore = buildStore<AnalyticsEvent[]>([])

export function useEventStore() {
  const { subscribe } = eventStore;

  function reset() {
    eventStore.set([])
  }

  function add(event: AnalyticsEvent) {
    eventStore.set([...eventStore.value, event])
  }

  return {
    reset,
    add,
    subscribe
  }
}