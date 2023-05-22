import "./ScenarioResultModal.css";
import { ReportItem, useScoreCardStore } from "../scenario/useScoreCard";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

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
                <TableCell>{`${validCount(row.report)}/${
                  row.report.length
                }`}</TableCell>
                <TableCell>
                  <ul>
                    {row.report.map((item) => (
                      <li>{item.message}</li>
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

function validCount(report: ReportItem[]) {
  return report.filter((item) => item.valid).length;
}
