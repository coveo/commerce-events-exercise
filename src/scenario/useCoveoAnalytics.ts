import 'coveo.analytics'
import { handleOneAnalyticsEvent } from 'coveo.analytics';
import { useEventStore } from './useEventStore'
import { IAnalyticsRequestOptions } from 'coveo.analytics/dist/definitions/client/analyticsRequestClient'

type CoveoUAGlobal = typeof handleOneAnalyticsEvent

declare global {
  var coveoua: CoveoUAGlobal;
}

export function useCoveoAnalytics() {
  const { add } = useEventStore()

  function preprocessRequest(request: IAnalyticsRequestOptions) {
    add(request)
    return request;
  }

  const coveoua = window.coveoua || (() => console.log('noop coveoua'));
  return { preprocessRequest, coveoua }
}