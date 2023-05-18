import { useState } from "react";
import { buildScenario } from "../scenario/scenario";
import { useCart } from "./useCart";
import { ScenarioResultModal } from "./ScenarioResultModal";

export function ScenarioButton() {
  const [showModal, setShowModal] = useState(false);

  const scenario = buildScenario();
  const { removeAll } = useCart();

  async function run() {
    removeAll();
    await scenario.run();
    removeAll();
    show();
  }

  function show() {
    setShowModal(true);
  }

  function hide() {
    setShowModal(false);
  }

  return (
    <div>
      <button onClick={run}>Run scenario</button>
      <button onClick={show}>Show results</button>
      {showModal && <ScenarioResultModal hideModal={hide} />}
    </div>
  );
}
