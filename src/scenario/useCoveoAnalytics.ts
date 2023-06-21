import 'coveo.analytics'
import { AnalyticsClientSendEventHook, handleOneAnalyticsEvent } from 'coveo.analytics';
import { useEventStore } from './useEventStore'

type CoveoUAGlobal = typeof handleOneAnalyticsEvent

declare global {
  var coveoua: CoveoUAGlobal;
  var coveoanalytics: any;
}

export function useCoveoAnalytics() {
  const { hook } = useAnalyticsHook()
  const client = window.coveoanalytics?.SimpleAnalytics.coveoua.client

  if (client && !client.hookAttached) {
    window.coveoanalytics.SimpleAnalytics.coveoua.client.registerBeforeSendEventHook(hook);
    client.hookAttached = true;
  }

  const coveoua = window.coveoua || (() => console.log('noop coveoua'));
  return { coveoua }
}

function useAnalyticsHook() {
  const { add } = useEventStore();
  const hook: AnalyticsClientSendEventHook = (type, payload) => {
    const event = { type, payload }
    add(event)
    return payload
  }

  return { hook }
}