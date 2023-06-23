import {
  AnalyticsClientSendEventHook,
  buildSearchEngine,
} from "@coveo/headless";

function getSearchToken() {
  return process.env.REACT_APP_API_KEY || "";
}

export function initializeHeadlessEngine(hook: AnalyticsClientSendEventHook) {
  return buildSearchEngine({
    configuration: {
      platformUrl: process.env.REACT_APP_PLATFORM_URL,
      organizationId: process.env.REACT_APP_ORGANIZATION_ID!,
      accessToken: getSearchToken(),
      analytics: {
        anonymous: true,
        analyticsClientMiddleware: hook,
      },
    },
  });
}
