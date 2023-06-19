import { EventReport, ReportItem } from "../scenario/useScoreCard";

interface OverallScoreProps {
  scoreCard: EventReport[];
}

export function OverallScore(props: OverallScoreProps) {
  const { scoreCard } = props;

  const max = scoreCard.length;
  const actual = sum(scoreCard.map(calculateEventScore));

  return (
    <div style={{ textAlign: "center" }}>
      Overall score: {normalize(actual).toFixed(1)} / {normalize(max)}
    </div>
  );
}

function calculateEventScore(event: EventReport) {
  const { missing, report } = event;
  const emitted = missing ? 0 : 1;
  const correct = percentageCorrect(report);

  return (emitted + correct) / 2;
}

function percentageCorrect(report: ReportItem[]) {
  const correct = report.filter((item) => item.valid).length;
  const total = report.length;

  return total ? correct / total : 0;
}

function sum(arr: number[]) {
  return arr.reduce((acc, curr) => acc + curr, 0);
}

function normalize(num: number) {
  return num * 2;
}
