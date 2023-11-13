import { buildStore } from "../common/store";

export interface EventReport {
  event: 'addToCart' | 'click' | 'purchase'
  payload: Object
  report: ReportItem[]
  missing: boolean
}

export interface ReportItem {
  valid: boolean;
  key: string;
  expected: string;
  received: string;
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