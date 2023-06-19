import "./ScenarioResultModal.css";
import {
  EventReport,
  ReportItem,
  useScoreCardStore,
} from "../scenario/useScoreCard";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { OverallScore } from "./ScenarioOverallScore";

interface ScenarioResultModalProps {
  hideModal(): void;
}

export function ScenarioResultModal(props: ScenarioResultModalProps) {
  const { hideModal } = props;
  const { get } = useScoreCardStore();

  const scoreCard = get();

  return (
    <div className="modal">
      <button onClick={hideModal}>x</button>
      <OverallScore scoreCard={scoreCard} />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Event</TableCell>
              <TableCell>Payload</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {scoreCard.map((row, i) => (
              <TableRow
                key={i}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {row.event}
                </TableCell>
                <TableCell sx={{ maxWidth: 560, overflowX: "scroll" }}>
                  <pre>{JSON.stringify(row.payload, null, 2)}</pre>
                </TableCell>
                <TableCell>{displayScore(row)}</TableCell>
                <TableCell>
                  <ul>
                    {row.report.map((item, i) => (
                      <li key={i}>{displayItem(item)}</li>
                    ))}
                  </ul>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

function displayScore(eventReport: EventReport) {
  const { missing, report } = eventReport;
  return missing ? "missing" : displayScoreAsFraction(report);
}

function displayScoreAsFraction(report: ReportItem[]) {
  return `${numOfValidItems(report)}/${report.length}`;
}

function numOfValidItems(report: ReportItem[]) {
  return report.filter((item) => item.valid).length;
}

function displayItem(item: ReportItem) {
  const { valid, key, received, expected } = item;
  if (valid) {
    return (
      <p>
        {box("green")} {bold(key)} equal to {bold(received)} is correct
      </p>
    );
  }
  return (
    <p>
      {box("red")} Expected {bold(key)} to be {bold(expected)} instead of{" "}
      {bold(received)}
    </p>
  );
}

function box(color: string) {
  return (
    <span
      style={{
        height: 16,
        width: 16,
        backgroundColor: color,
        display: "inline-block",
        verticalAlign: "middle",
        borderRadius: 8,
      }}
    ></span>
  );
}

function bold(value: string) {
  return <b>{value}</b>;
}
