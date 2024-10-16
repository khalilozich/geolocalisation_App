import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import '../Map.css';

const Map = ({ engins, selectedPoint }) => {
  const [points, setPoints] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/tasks/');
        setPoints(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des points :', error);
      }
    };

    fetchPoints();
  }, []);

  const defaultCenter = { lat: 0, lng: 0 };

  if (selectedPoint) {
    const { latitude, longitude } = selectedPoint;
    defaultCenter.lat = latitude;
    defaultCenter.lng = longitude;
  }

  const handleMarkerClick = (point) => {
    setSelectedMarker(point);
    setShowPopup(true);
  };

  return (
    <MapContainer
      center={[defaultCenter.lat, defaultCenter.lng]}
      zoom={10}
      style={{ width: '100%', height: '400px' }}
      className="map-container"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {points.map((point) => (
        <Marker
          key={point.id}
          position={[point.latitude, point.longitude]}
          onClick={() => handleMarkerClick(point)}
        />
      ))}

      {selectedPoint && showPopup && selectedMarker && (
        <Marker
          position={[selectedMarker.latitude, selectedMarker.longitude]}
        >
          <Popup className="info-window">
            <div>
              <h3>{selectedMarker.nom}</h3>
              <p>Latitude: {selectedMarker.latitude}</p>
              <p>Longitude: {selectedMarker.longitude}</p>
            </div>
          </Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default Map;
