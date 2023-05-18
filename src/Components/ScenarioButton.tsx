import { buildScenario } from "../scenario/scenario";
import { useCart } from "./useCart";

export function ScenarioButton() {
  const scenario = buildScenario();
  const { removeAll } = useCart();

  function run() {
    removeAll();
    scenario.run();
  }
  return <button onClick={run}>Run scenario</button>;
}
