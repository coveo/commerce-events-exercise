import React, { useEffect } from "react";
import SearchPage from "./Components/SearchPage";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Grid, Typography, Box } from "@mui/material";
import { initializeHeadlessEngine } from "./common/Engine";
import { SearchEngine } from "@coveo/headless";
import { Checkout } from "./pages/Checkout";
import { ScenarioButton } from "./Components/ScenarioButton";
import {
  useAnalyticsHook,
  useCoveoAnalytics,
} from "./scenario/useCoveoAnalytics";

export default function App() {
  const [engine, setEngine] = React.useState<SearchEngine | null>(null);
  const { coveoua } = useCoveoAnalytics();
  const { hook } = useAnalyticsHook();

  useEffect(() => {
    setEngine(initializeHeadlessEngine(hook));
    coveoua("init", process.env.REACT_APP_ANALYTICS_API_KEY);
  }, []);

  return (
    <Router>
      <ScenarioButton engine={engine} />
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to={isEnvValid() === true ? "/search" : "/error"}
              replace
            />
          }
        />
        <Route path="/search" element={<Search engine={engine} />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/error" element={<Error />} />
      </Routes>
    </Router>
  );
}

const isEnvValid = () => {
  const variables = [
    "REACT_APP_PLATFORM_URL",
    "REACT_APP_ORGANIZATION_ID",
    "REACT_APP_API_KEY",
    "REACT_APP_ANALYTICS_API_KEY",
    "REACT_APP_USER_EMAIL",
    "REACT_APP_SERVER_PORT",
  ];
  const reducer = (previousValue: boolean, currentValue: string) =>
    previousValue && Boolean(process.env[currentValue]);
  return variables.reduce(reducer, true);
};

interface SearchProps {
  engine: SearchEngine | null;
}

const Search = (props: SearchProps) => {
  const { engine } = props;

  if (engine) {
    return (
      <div className="App">{engine && <SearchPage engine={engine} />}</div>
    );
  } else {
    return <div>Waiting for engine</div>;
  }
};

const Error = () => {
  return (
    <Box height="100vh" display="flex" align-items="center">
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Grid item md={9} sm={11}>
          <div className="container">
            <Typography variant="h4" color="error">
              Invalid Environment variables
            </Typography>
            <Typography variant="body1">
              You should have a valid <code>.env</code> file at the root of this
              project. You can use <code>.env.example</code> as starting point
              and make sure to replace all placeholder variables
              <code>&#60;...&#62;</code> by the proper information for your
              organization.
            </Typography>
            <p>
              Refer to the project <b>README</b> file for more information.
            </p>
          </div>
        </Grid>
      </Grid>
    </Box>
  );
};
