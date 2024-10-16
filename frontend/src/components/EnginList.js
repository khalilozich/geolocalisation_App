import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../ListerEngin.css';

const EnginList = ({ engins, onShowOnMap }) => {
  const [points, setPoints] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pointsPerPage] = useState(10);

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

  const handleShowOnMap = (point) => {
    onShowOnMap(point);
  };
  const handleDeletePoint = async (point) => {
    try {
      await axios.delete(`http://127.0.0.1:8000/api/tasks/${point.id}/`);
      // Après la suppression réussie, vous pouvez mettre à jour l'état pour refléter les modifications.
      // Par exemple, vous pouvez refetcher la liste des points.
      setPoints((prevPoints) => prevPoints.filter((point) => point.id !== point.id));
    } catch (error) {
      console.error('Erreur lors de la suppression du point :', error);
    }
  };
  

  const filteredPoints = points.filter(point =>
    point.nom.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastPoint = currentPage * pointsPerPage;
  const indexOfFirstPoint = indexOfLastPoint - pointsPerPage;
  const currentPoints = filteredPoints.slice(indexOfFirstPoint, indexOfLastPoint);

  const renderPoints = currentPoints.map(point => (
    <tr key={point.id}>
      <td>{point.nom}</td>
      <td>{point.latitude}</td>
      <td>{point.longitude}</td>
      <td>
        <button className="action-button" onClick={() => handleShowOnMap(point)}>
          Afficher sur la carte
        </button>
        <button className="action-button delete-button" onClick={() => handleDeletePoint(point)}>
            Supprimer
        </button>
      </td>
    </tr>
  ));

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredPoints.length / pointsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="lister-engin">
      <h2>Liste des Points</h2>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Rechercher un point par nom"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <table className="point-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Latitude</th>
            <th>Longitude</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {renderPoints}
        </tbody>
      </table>
      <div className="pagination">
        <ul>
          {pageNumbers.map(number => (
            <li key={number}>
              <button className={currentPage === number ? "active" : ""} onClick={() => setCurrentPage(number)}>
                {number}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EnginList;







