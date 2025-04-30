import React from 'react';
import { Paper, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

const DailyLog = ({ log, onDownload }) => {
  return (
    <Paper elevation={3} style={{ padding: '20px', margin: '20px 0' }}>
      <Typography variant="h6" gutterBottom>
        Daily Log for {new Date(log.date).toLocaleDateString()}
      </Typography>
      <Typography variant="body1" gutterBottom>
        Total Miles: {log.total_miles.toFixed(1)}
      </Typography>

      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Time</TableCell>
              <TableCell>Off Duty</TableCell>
              <TableCell>Sleeper Berth</TableCell>
              <TableCell>Driving</TableCell>
              <TableCell>On Duty Not Driving</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* Would render grid rows based on log.graph_grid */}
            <TableRow>
              <TableCell>Sample</TableCell>
              <TableCell>X</TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <Typography variant="subtitle1" style={{ marginTop: '20px' }}>
        Remarks:
      </Typography>
      <Typography variant="body2" style={{ whiteSpace: 'pre-line' }}>
        {log.remarks}
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => onDownload(log.id)}
        style={{ marginTop: '20px' }}
      >
        Download PDF
      </Button>
    </Paper>
  );
};

export default DailyLog;