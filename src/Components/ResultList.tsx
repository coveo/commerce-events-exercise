import { FunctionComponent, useContext, useEffect, useState } from "react";
import List from "@mui/material/List";
import { ListItem, Box, Typography, Grid } from "@mui/material";
import {
  buildResultList,
  Result,
  buildResultTemplatesManager,
  ResultTemplatesManager,
  ResultList as HeadlessResultList,
  buildInteractiveResult,
  SearchEngine,
} from "@coveo/headless";
import EngineContext from "../common/engineContext";
import { useCart } from "./useCart";
import { useCoveoAnalytics } from "../scenario/useCoveoAnalytics";

type Template = (result: Result) => React.ReactNode;

interface FieldValueInterface {
  value: string;
  caption: string;
}

interface ResultListProps {
  controller: HeadlessResultList;
}
function ListItemLink(engine: SearchEngine, result: Result) {
  const interactiveResult = buildInteractiveResult(engine, {
    options: { result },
  });
  return (
    <a
      onClick={() => interactiveResult.select()}
      onContextMenu={() => interactiveResult.select()}
      onMouseDown={() => interactiveResult.select()}
      onMouseUp={() => interactiveResult.select()}
      onTouchStart={() => interactiveResult.beginDelayedSelect()}
      onTouchEnd={() => interactiveResult.cancelPendingSelect()}
    >
      <Typography variant="body1" color="primary">
        {result.title}
      </Typography>
    </a>
  );
}

function FieldValue(props: FieldValueInterface) {
  return (
    <Box>
      <Typography
        color="textSecondary"
        style={{ fontWeight: "bold" }}
        variant="caption"
      >
        {props.caption}:&nbsp;
      </Typography>
      <Typography color="textSecondary" variant="caption">
        {props.value}
      </Typography>
    </Box>
  );
}

const ResultListRenderer: FunctionComponent<ResultListProps> = (props) => {
  const { controller } = props;
  const engine = useContext(EngineContext)!;
  const { addProduct, openCart } = useCart();
  const [state, setState] = useState(controller.state);
  const { coveoua } = useCoveoAnalytics();

  function addToCart(result: Result) {
    addProduct(result);
    openCart();
    logClick(result);
    logAddToCart(result);
  }

  function logClick(result: Result) {}

  function logAddToCart(result: Result) {}

  const headlessResultTemplateManager: ResultTemplatesManager<Template> =
    buildResultTemplatesManager(engine);

  headlessResultTemplateManager.registerTemplates({
    conditions: [],
    content: (result: Result) => (
      <ListItem disableGutters key={result.uniqueId}>
        <Grid container>
          <Grid item xs={4} my={2}>
            <img style={{ width: 160 }} src={result.raw.ec_images as string} />
          </Grid>
          <Grid item xs={8}>
            <Box my={2}>
              <Box pb={1}>{ListItemLink(engine, result)}</Box>
              <Box pb={1}>
                <Typography color="textPrimary" variant="body1">
                  ${(result.raw as any).ec_price}
                </Typography>
              </Box>
              {result.excerpt && (
                <Box pb={1}>
                  <Typography color="textPrimary" variant="body2">
                    {result.excerpt}
                  </Typography>
                </Box>
              )}

              {result.raw.source && (
                <FieldValue caption="Source" value={result.raw.source} />
              )}
              {result.raw.objecttype && (
                <FieldValue
                  caption="Object Type"
                  value={result.raw.objecttype}
                />
              )}
              <button
                className="add-to-cart-btn"
                onClick={() => addToCart(result)}
              >
                Add to cart
              </button>
            </Box>
          </Grid>
        </Grid>
      </ListItem>
    ),
  });

  useEffect(
    () => controller.subscribe(() => setState(controller.state)),
    [controller]
  );

  return (
    <List>
      {state.results.map((result: Result) => {
        const template = headlessResultTemplateManager.selectTemplate(result);
        return template ? template(result) : null;
      })}
    </List>
  );
};

const ResultList = () => {
  const engine = useContext(EngineContext)!;
  const controller = buildResultList(engine, {
    options: {
      fieldsToInclude: [
        "ec_name",
        "ec_brand",
        "ec_category",
        "ec_price",
        "ec_productid",
        "ec_images",
      ],
    },
  });
  return <ResultListRenderer controller={controller} />;
};

export default ResultList;
