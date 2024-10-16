import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../AddEnginForm.css'; // Importe le fichier de styles CSS


const Form = ({ fetchEngins }) => {
  const [nom, setNom] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [nameExistsError, setNameExistsError] = useState(null);
  const [allPoints, setAllPoints] = useState([]);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/tasks/');
        setAllPoints(response.data);
      } catch (error) {
        console.error('Erreur lors de la récupération des points :', error);
      }
    };

    fetchPoints();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!nom || !latitude || !longitude) {
        setErrorMessage('Veuillez remplir tous les champs.');
        setTimeout(() => {
          setErrorMessage(null);
        }, 3000);
        return;
      }

      // Vérification si le nom existe déjà parmi les points existants
      const nameExists = allPoints.some(point => point.nom === nom);
      if (nameExists) {
        setNameExistsError('Le nom existe déjà.');
        setTimeout(() => {
          setNameExistsError(null);
        }, 3000);
        return;
      }

      await axios.post('http://127.0.0.1:8000/api/tasks/', { latitude, longitude, nom });
      fetchEngins();
      setNom('');
      setLatitude('');
      setLongitude('');
      setSuccessMessage('Point ajouté avec succès.');
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
    } catch (error) {
      setErrorMessage('Une erreur s\'est produite lors de l\'ajout du point.');
      setTimeout(() => {
        setErrorMessage(null);
      }, 4000);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6 offset-md-3">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title">Ajouter un Point</h2>
              {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
              {nameExistsError && <div className="alert alert-danger">{nameExistsError}</div>}
              {successMessage && <div className="alert alert-success">{successMessage}</div>}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nom" className="form-label">Nom :</label>
                  <input type="text" className="form-control" id="nom" value={nom} onChange={(e) => setNom(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="latitude" className="form-label">Latitude :</label>
                  <input type="text" className="form-control" id="latitude" value={latitude} onChange={(e) => setLatitude(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label htmlFor="longitude" className="form-label">Longitude :</label>
                  <input type="text" className="form-control" id="longitude" value={longitude} onChange={(e) => setLongitude(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary">Ajouter le Point</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
