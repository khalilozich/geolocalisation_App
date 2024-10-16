import React, { useState, useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import "leaflet-routing-machine";
import axios from "axios";

const Chemin = () => {
  const [startPointOptions, setStartPointOptions] = useState([]);
  const [selectedStartPoint, setSelectedStartPoint] = useState(null);
  const [destination, setDestination] = useState(null);
  const [distance, setDistance] = useState("");
  const [duration, setDuration] = useState("");
  const [success, setSuccess] = useState(false);
  const mapRef = useRef(null);
  const routingControlRef = useRef(null);
  const destinationMarkerRef = useRef(null);

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/tasks/");
        const points = response.data;

        const startPointOptions = points.map((point) => ({
          id: point.id,
          lat: parseFloat(point.latitude),
          lng: parseFloat(point.longitude),
          nom: point.nom,
        }));
        setStartPointOptions(startPointOptions);
      } catch (error) {
        console.error("Une erreur s'est produite lors de la récupération des points:", error);
      }
    };

    fetchPoints();
  }, []);

  const handleMapClick = (e) => {
    if (selectedStartPoint) {
      const { lat, lng } = e.latlng;
      setDestination({ lat, lng });

      if (destinationMarkerRef.current) {
        destinationMarkerRef.current.setLatLng([lat, lng]);
      } else {
        // Créer un marqueur pour la destination
        destinationMarkerRef.current = L.marker([lat, lng]).addTo(mapRef.current).bindPopup("Destination").openPopup();
      }

      if (routingControlRef.current) {
        routingControlRef.current.setWaypoints([
          L.latLng(selectedStartPoint.lat, selectedStartPoint.lng),
          L.latLng(lat, lng),
        ]);
      }
    }
  };

  const handleStartPointChange = (e) => {
    const selectedId = e.target.value;
    const selectedOption = startPointOptions.find((option) => option.id.toString() === selectedId);
    setSelectedStartPoint(selectedOption ? { ...selectedOption } : null);
  };

  const handleCalculateDistance = async (e) => {
    e.preventDefault();

    if (!selectedStartPoint || !destination) {
      
      return;
    }

    try {
      const response = await axios.post("http://localhost:8000/api/routes/", {
        start_point: {
          latitude: selectedStartPoint.lat,
          longitude: selectedStartPoint.lng,
          nom: selectedStartPoint.nom,
        },
        destination_latitude: destination.lat,
        destination_longitude: destination.lng,
      });

      console.log("Route enregistrée avec succès :", response.data);

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Erreur lors de l'enregistrement de la route :", error);
    }
  };

  useEffect(() => {
    if (!mapRef.current) {
      mapRef.current = L.map("map").setView([0, 0], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png").addTo(mapRef.current);
    }
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      if (selectedStartPoint) {
        // Créez un marqueur pour le point de départ
        L.marker([selectedStartPoint.lat, selectedStartPoint.lng])
          .addTo(mapRef.current)
          .bindPopup("Point de départ")
          .openPopup();
      }

      // Ajoutez le gestionnaire de clic de carte pour définir la destination
      mapRef.current.on("click", handleMapClick);

      if (!routingControlRef.current) {
        // Créez une instance de contrôle de routage
        routingControlRef.current = L.Routing.control({
          waypoints: [], // Les waypoints sont vides initialement
        }).addTo(mapRef.current);
      }
    }
  }, [selectedStartPoint]);

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Formulaire de Route</h2>
              <form onSubmit={handleCalculateDistance}>
                <div className="form-group">
                  <label className="text-primary font-weight-bold text-uppercase">Point De Départ:</label>
                  <select className="form-control" value={selectedStartPoint ? selectedStartPoint.id : ""} onChange={handleStartPointChange}>
                    <option value="">Sélectionnez un point</option>
                    {startPointOptions.map((point) => (
                      <option key={point.id} value={point.id}>
                        {point.nom}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="font-weight-bold ">Cliquez sur la carte pour définir la destination.</label>
                  <div id="map" style={{ width: "100%", height: "300px" }}></div>
                </div>
                <button className="btn btn-primary btn-block">Ajouter Route</button>
                {success && <div className="alert alert-success mt-3">Ajout réussi !</div>}
                {distance && <div>Distance: {distance}</div>}
                {duration && <div>Durée: {duration}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chemin;
