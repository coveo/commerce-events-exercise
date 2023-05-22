import { buildStore } from "../common/store";

export interface AnalyticsEvent {
  type: string;
  payload: any;
}

const eventStore = buildStore<AnalyticsEvent[]>([])

export function useEventStore() {
  function reset() {
    eventStore.set([])
  }

  function add(event: AnalyticsEvent) {
    eventStore.set([...eventStore.value, event])
  }

  function get() {
    return eventStore.value
  }

  return {
    reset,
    add,
    get
  }
}