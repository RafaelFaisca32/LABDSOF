import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Container } from 'semantic-ui-react';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import SpotDetailsModal from './SpotDetailsModal';
import AddSpotModal from './AddSpotModal';


const userIcon = new L.Icon({
  iconUrl: '/icons/user.png', 
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const wifiSpotIcon = new L.Icon({
  iconUrl: '/icons/wifi.png', 
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

function MapClickHandler({ onMapClick }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}


function WifiMapPage() {
  const Auth = useAuth();
  const user = Auth.getUser();
  const isUser = user.role === 'USER';

  const [userLocation, setUserLocation] = useState(null);
  // Existing wi-fi spots will be grabbed from the back-end
  const [spots, setSpots] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newSpotDetails, setNewSpotDetails] = useState({ coordinates: null, name: '', size: '' });
  const [selectedSpot, setSelectedSpot] = useState(null); 

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation([position.coords.latitude, position.coords.longitude]);
      },
      (error) => console.error(error),
      { enableHighAccuracy: true }
    );
  }, []);

  const handleMapClick = (coordinates) => {
    setNewSpotDetails({ coordinates, name: '', size: '' });
    setModalOpen(true);
  };

  const addSpot = () => {
    if (newSpotDetails.coordinates && newSpotDetails.name) {
      setSpots([...spots, newSpotDetails]);
    }
    setModalOpen(false);
  };

  const openSpotModal = (spot) => {
    setSelectedSpot(spot);
  };

  const closeSpotModal = () => {
    setSelectedSpot(null);
  };

  if (!isUser) {
    return <Navigate to="/" />;
  }

  return (
    <Container>
      <h3>WiFi Map</h3>
      {userLocation ? (
        <MapContainer center={userLocation} zoom={13} style={{ height: '60vh', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler onMapClick={handleMapClick} />
          <Marker position={userLocation} icon={userIcon}>
            <Tooltip direction="top" offset={[0, -20]} opacity={1}>
              You are here
            </Tooltip>
            <Popup>Your current location</Popup>
          </Marker>
          {spots.map((spot, index) => (
            <Marker
              key={index}
              position={spot.coordinates}
              icon={wifiSpotIcon}
              eventHandlers={{
                click: () => openSpotModal(spot),
              }}
            >
              <Tooltip direction="top" offset={[0, -20]} opacity={1}>
                {spot.name}
              </Tooltip>
            </Marker>
          ))}
        </MapContainer>
      ) : (
        <p>Loading map... You should activate the location sharing for it to load.</p>
      )}
      <AddSpotModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={addSpot}
        spotDetails={newSpotDetails}
        setSpotDetails={setNewSpotDetails}
      />
      {selectedSpot && (
        <SpotDetailsModal userLocation={userLocation} onClose={closeSpotModal} spot={selectedSpot}></SpotDetailsModal>
      )}

    </Container>
  );
}

export default WifiMapPage;
