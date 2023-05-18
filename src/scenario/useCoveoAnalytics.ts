import { CoveoAnalyticsClient } from 'coveo.analytics'
import { useEventStore } from './useEventStore'
import { IAnalyticsRequestOptions } from 'coveo.analytics/dist/definitions/client/analyticsRequestClient'

export function useCoveoAnalytics() {
  const { add } = useEventStore()

  function preprocessRequest(request: IAnalyticsRequestOptions) {
    add(request)
    return request;
  }

  const client = new CoveoAnalyticsClient({
    preprocessRequest
  })

  return { client }
}