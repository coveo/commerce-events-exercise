import { buildScenario } from "../scenario/scenario";
import { useCart } from "./useCart";

export function ScenarioButton() {
  const scenario = buildScenario();
  const { removeAll } = useCart();

  async function run() {
    removeAll();
    await scenario.run();
    removeAll();
  }
  
  return <button onClick={run}>Run scenario</button>;
}
