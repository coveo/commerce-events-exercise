import "./ScenarioResultModal.css";

interface ScenarioResultModalProps {
  hideModal(): void;
}

export function ScenarioResultModal(props: ScenarioResultModalProps) {
  const { hideModal } = props;
  return (
    <div className="modal">
      <button onClick={hideModal}>x</button>
    </div>
  );
}
