import { IAnalyticsRequestOptions } from "coveo.analytics/dist/definitions/client/analyticsRequestClient";
import { buildStore } from "../common/store";


const eventStore = buildStore<IAnalyticsRequestOptions[]>([])

export function useEventStore() {
  const { subscribe } = eventStore;

  function reset() {
    eventStore.set([])
  }

  function add(event: IAnalyticsRequestOptions) {
    eventStore.set([...eventStore.value, event])
  }


  return {
    reset,
    add,
    subscribe
  }
}