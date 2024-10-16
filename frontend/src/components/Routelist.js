import React, { useState, useEffect } from 'react';
import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-routing-machine/dist/leaflet-routing-machine.css';
import 'leaflet-routing-machine';

const RouteList = ({ onShowOnMap }) => {
  const [routes, setRoutes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [routesPerPage] = useState(10);
  const [enginLocation, setEnginLocation] = useState(null);
  const [isEnginInRoute, setIsEnginInRoute] = useState('');

  useEffect(() => {
    const fetchRoutes = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/routes/');
        setRoutes(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des routes :', error);
      }
    };

    fetchRoutes();
  }, []);

  useEffect(() => {
    // Simulez la mise à jour de l'emplacement de l'engin toutes les 5 secondes.
    const interval = setInterval(() => {
      // Remplacez cette partie par la logique réelle pour obtenir l'emplacement de l'engin depuis votre API.
      const enginLat = 48.858844;
      const enginLng = 2.294351;
      setEnginLocation({ lat: enginLat, lng: enginLng });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleShowOnMap = (route) => {
    const mapContainer = L.DomUtil.create('div');
    mapContainer.id = 'route-map';
    const map = L.map(mapContainer).setView(
      [route.start_point.latitude, route.start_point.longitude],
      13
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map);

    const control = L.Routing.control({
      waypoints: [
        L.latLng(route.start_point.latitude, route.start_point.longitude),
        L.latLng(route.destination_latitude, route.destination_longitude),
      ],
    }).addTo(map);

    L.marker([route.start_point.latitude, route.start_point.longitude])
      .addTo(map)
      .bindPopup(route.start_point.nom);

    L.marker([
      route.destination_latitude,
      route.destination_longitude,
    ])
      .addTo(map)
      .bindPopup('Destination');

    // Vérifiez si l'engin est dans l'itinéraire tracé toutes les 5 secondes.
    const checkEnginLocation = () => {
      if (enginLocation) {
        const routePolyline = L.Routing.line([
          L.latLng(route.start_point.latitude, route.start_point.longitude),
          L.latLng(route.destination_latitude, route.destination_longitude),
        ]).addTo(map);

        const enginLatLng = L.latLng(enginLocation.lat, enginLocation.lng);
        if (routePolyline.getLayers().length > 0) {
          const routeBounds = routePolyline.getBounds();
          if (routeBounds.contains(enginLatLng)) {
            setIsEnginInRoute('Valide');
          } else {
            setIsEnginInRoute('Non Valide');
          }
        }
      }
    };

    // Vérifiez l'emplacement de l'engin toutes les 5 secondes.
    setInterval(checkEnginLocation, 5000);

    const existingMap = document.getElementById('route-map');
    if (existingMap) {
      existingMap.remove();
    }

    mapContainer.style.width = '100%';
    mapContainer.style.height = '400px';
    document.getElementById('map-container').appendChild(mapContainer);
  };

  const filteredRoutes = routes.filter((route) =>
    route.start_point.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastRoute = currentPage * routesPerPage;
  const indexOfFirstRoute = indexOfLastRoute - routesPerPage;
  const currentRoutes = filteredRoutes.slice(indexOfFirstRoute, indexOfLastRoute);

  const renderRoutes = currentRoutes.map((route) => (
    <tr key={route.id}>
      <td>{route.start_point.nom}</td>
      <td>{route.start_point.latitude}</td>
      <td>{route.start_point.longitude}</td>
      <td>{route.destination_latitude}</td>
      <td>{route.destination_longitude}</td>
      <td>{isEnginInRoute}</td>
      <td>
        <button className="action-button" onClick={() => handleShowOnMap(route)}>
          Afficher sur la carte
        </button>
      </td>
    </tr>
  ));

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredRoutes.length / routesPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="lister-engin">
      <h2>Liste des Routes</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher par nom de point"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <table className="point-table">
        <thead>
          <tr>
            <th>Nom du Point</th>
            <th>start_p Latitude</th>
            <th>start_p Longitude</th>
            <th>destination latitude</th>
            <th>destination Longitude</th>
            <th>Verifie</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>{renderRoutes}</tbody>
      </table>
      <div className="pagination">
        <ul>
          {pageNumbers.map((number) => (
            <li key={number}>
              <button
                className={currentPage === number ? 'active' : ''}
                onClick={() => setCurrentPage(number)}
              >
                {number}
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div id="map-container"></div>
    </div>
  );
};

export default RouteList;
