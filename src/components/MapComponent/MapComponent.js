import React, { useState } from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import './MapComponent.css';

const MapComponent = () => {
  const [error, setError] = useState(null);

  if (error) {
    return <div className="map-error">Failed to load map: {error.message}</div>;
  }

  return (
    <div className="map-component" data-testid="map">
      <h2>Route Map</h2>
      <MapContainer 
        center={[51.505, -0.09]} 
        zoom={13} 
        style={{ height: '400px', width: '100%' }}
        onError={(e) => setError(e)}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
      </MapContainer>
    </div>
  );
};

export default MapComponent;