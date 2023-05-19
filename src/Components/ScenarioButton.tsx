import { useState } from "react";
import { useScenario } from "../scenario/useScenario";
import { ScenarioResultModal } from "./ScenarioResultModal";

export function ScenarioButton() {
  const [showModal, setShowModal] = useState(false);

  const { run } = useScenario();

  async function runScenario() {
    await run();
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
      <button onClick={runScenario}>Run scenario</button>
      <button onClick={show}>Show results</button>
      {showModal && <ScenarioResultModal hideModal={hide} />}
    </div>
  );
}
