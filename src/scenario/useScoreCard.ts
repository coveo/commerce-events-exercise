import { buildStore } from "../common/store";

export interface EventReport {
  event: 'addToCart' | 'pageview',
  payload: Object,
  report: ReportItem[]
}

export interface ReportItem {
  valid: boolean;
  message: string;
}

const store = buildStore<EventReport[]>([])

export function useScoreCardStore() {
  function set(scoreCard: EventReport[]) {
    store.set(scoreCard)
  }

  function get() {
    return store.value
  }

  return {
    set,
    get
  }
}