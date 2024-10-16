
import React, { useState } from 'react';
import './App.css';
import { LoadScript } from '@react-google-maps/api';
import Map from './components/Map';
import Form from './components/Form';
import EnginList from './components/EnginList';
import Chemin from './components/Chemin';
import Routelist from './components/Routelist';
import MyErrorBoundary from './MyErrorBoundary';
import axios from 'axios';

function App() {
  const [activeTab, setActiveTab] = useState('map');
  const [engins, setEngins] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);

  const fetchEngins = async () => {
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/tasks/'); // L'URL de l'API peut varier
      setEngins(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowOnMap = (point) => {
    setActiveTab('map');
    setSelectedPoint(point);
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'add':
        return <Form fetchEngins={fetchEngins} />;
      case 'list':
        return <EnginList engins={engins} onShowOnMap={handleShowOnMap} />;
      case 'map':
        return <Map engins={engins} selectedPoint={selectedPoint} />;
      case 'Chemin':
        return <Chemin engins={engins}  />;
      case 'routelist':
        return <Routelist engins={engins}  />;
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <h1>Gestion des Engins</h1>
      <div className="flex-container">
        <div className="side-bar">
          <button onClick={() => setActiveTab('add')}>Ajouter</button>
          <button onClick={() => setActiveTab('list')}>Lister les Engins</button>
          <button onClick={() => setActiveTab('map')}>Maps</button>
          <button onClick={() => setActiveTab('Chemin')}>Ajouter Chemin </button>
          <button onClick={() => setActiveTab('routelist')}>Lister Les Route </button>
        </div>
        <div className="main-content">
          <MyErrorBoundary>
            <LoadScript googleMapsApiKey="AIzaSyDQydt4Jw0s24eMgfsP3ijYfAlgBfH-1Fg"  libraries={['places']}> {/* Remplace avec ta clé API Google Maps */}
              {renderContent()}
              
            </LoadScript>
          </MyErrorBoundary>
        </div>
      </div>
    </div>
  );
}

export default App;


