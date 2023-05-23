import {
  appendFileSync,
  truncateSync,
  existsSync,
  writeFileSync,
} from "node:fs";
import { EOL } from "node:os";
import getPort, { makeRange } from "get-port";
import { config } from "dotenv";
config();

const preferedWebAppPort = 3000;
const portRangeFallback = [3000, 3999];

const ensureEnvironmentFile = () => {
  if (!existsSync(".env")) {
    writeFileSync(".env", "");
  }
};

const updateEnvFile = (applicationPort, serverPort) => {
  const env = {
    ...getDefaultEnvVariables(),
    PORT: applicationPort,
    REACT_APP_SERVER_PORT: serverPort,
  };

  truncateSync(".env");
  for (const [key, value] of Object.entries(env)) {
    appendFileSync(".env", `${key}=${value}${EOL}`);
  }
};

const getDefaultEnvVariables = () => {
  return {
    REACT_APP_PLATFORM_URL: process.env["REACT_APP_PLATFORM_URL"],
    REACT_APP_ORGANIZATION_ID: process.env["REACT_APP_ORGANIZATION_ID"],
    REACT_APP_API_KEY: process.env["REACT_APP_API_KEY"],
    REACT_APP_USER_EMAIL: process.env["REACT_APP_USER_EMAIL"],
    PORT: process.env["PORT"],
    REACT_APP_SERVER_PORT: process.env["REACT_APP_SERVER_PORT"],
  };
};

const allocatePorts = async () => {
  const applicationPort = await getNextAvailablePorts(
    process.env.PORT || preferedWebAppPort
  );
  const serverPort = await getNextAvailablePorts(
    process.env.REACT_APP_SERVER_PORT
  );
  updateEnvFile(applicationPort, serverPort);
};

const getNextAvailablePorts = async (preferedPort) => {
  if (typeof preferedPort !== "number") {
    preferedPort = isNaN(parseInt(preferedPort))
      ? null
      : parseInt(preferedPort);
  }

  if (await isPortAvailable(preferedPort)) {
    return preferedPort;
  }
  return await getPort({ port: makeRange(...portRangeFallback) });
};

const isPortAvailable = async (port) => {
  const availablePort = await getPort({ port });
  return availablePort === port;
};

const main = async () => {
  ensureEnvironmentFile();
  await allocatePorts();
};

main();
