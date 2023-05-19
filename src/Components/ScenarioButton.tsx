import { useState } from "react";
import { useScenario } from "../scenario/useScenario";
import { ScenarioResultModal } from "./ScenarioResultModal";

export function ScenarioButton() {
  const [showModal, setShowModal] = useState(false);
  const { run } = useScenario();

  async function runScenario() {
    await run();
    showResults();
  }

  function showResults() {
    setShowModal(true);
  }

  function hideResults() {
    setShowModal(false);
  }

  return (
    <div>
      <button onClick={runScenario}>Run scenario</button>
      <button onClick={showResults}>Show results</button>
      {showModal && <ScenarioResultModal hideModal={hideResults} />}
    </div>
  );
}
