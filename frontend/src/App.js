import React, { useState } from 'react';
import { Container, CssBaseline, Typography } from '@mui/material';
import RouteForm from './components/RouteForm';
import MapDisplay from './components/MapDisplay';
import DailyLog from './components/DailyLog';
import { planTrip, downloadLog } from './services/api';

function App() {
  const [dailyLogs, setDailyLogs] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  const handlePlanTrip = async (tripData) => {
    try {
      const response = await planTrip(tripData);
      setDailyLogs(response.daily_logs);
      setRouteCoordinates(response.trip_plan.route_coordinates);
    } catch (error) {
      console.error('Error planning trip:', error);
    }
  };


  const handleDownloadLog = async (logId) => {
    try {
      const pdfBlob = await downloadLog(logId);
      const url = window.URL.createObjectURL(new Blob([pdfBlob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `daily_log_${logId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading log:', error);
    }
  };

  return (
    <>
      <CssBaseline />
      <Container maxWidth="lg">
        <Typography variant="h3" component="h1" align="center" gutterBottom style={{ marginTop: '20px' }}>
          FMCSA Trip Logger
        </Typography>

        <RouteForm onSubmit={handlePlanTrip} />

        {routeCoordinates.length > 0 && (
          <MapDisplay routeCoordinates={routeCoordinates} />
        )}

        {dailyLogs.map((log) => (
          <DailyLog
            key={log.date}
            log={log}
            onDownload={handleDownloadLog}
          />
        ))}
      </Container>
    </>
  );
}

export default App;