import React, { useEffect, useRef } from 'react';
import { Paper, Typography } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const MapDisplay = ({ routeCoordinates }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (!mapInstance.current && routeCoordinates && routeCoordinates.length > 0) {
      mapInstance.current = L.map(mapRef.current).setView([routeCoordinates[0][0][1], routeCoordinates[0][0][0]], 6);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(mapInstance.current);

      routeCoordinates.forEach((coords, idx) => {
        if (coords && coords.length > 0) {
          L.polyline(coords.map(c => [c[1], c[0]]), { color: 'blue' }).addTo(mapInstance.current);
          if (idx === 0) {
            L.marker([coords[0][1], coords[0][0]]).addTo(mapInstance.current)
              .bindPopup('Start Location');
          }
          if (idx === routeCoordinates.length - 1) {
            L.marker([coords[-1][1], coords[-1][0]]).addTo(mapInstance.current)
              .bindPopup('End Location');
          }
        }
      });

      const bounds = routeCoordinates.flat().map(c => [c[1], c[0]]);
      mapInstance.current.fitBounds(bounds);
    }

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [routeCoordinates]);


  return (
    <Paper elevation={3} style={{ padding: '20px', margin: '20px 0', height: '500px' }}>
      <Typography variant="h5" gutterBottom>
        Route Map
      </Typography>
      <div ref={mapRef} style={{ height: '100%', width: '100%' }} />
    </Paper>
  );
};

export default MapDisplay;