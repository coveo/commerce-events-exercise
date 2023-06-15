import { buildSearchEngine } from "@coveo/headless";

function getSearchToken() {
  return process.env.REACT_APP_API_KEY || "";
}

export function initializeHeadlessEngine() {
  return buildSearchEngine({
    configuration: {
      platformUrl: process.env.REACT_APP_PLATFORM_URL,
      organizationId: process.env.REACT_APP_ORGANIZATION_ID!,
      accessToken: getSearchToken(),
    },
  });
}
