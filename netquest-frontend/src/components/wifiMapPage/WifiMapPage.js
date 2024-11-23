import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Container, Button, Modal } from 'semantic-ui-react';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import SpotDetailsModal from './SpotDetailsModal';
import AddSpotModal from './AddSpotModal';
import WifiSpotFilter from '../wifiSpotFilter/WifiSpotFilter';
import { wifiSpotApi } from "../misc/WifiSpotApi";
import { errorNotification } from "../misc/Helpers";

const userIcon = new L.Icon({
  iconUrl: '/icons/user.png',
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const wifiSpotIcon = new L.Icon({
  iconUrl: '/icons/wifi.png',
  iconSize: [32, 32],
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
  const isUser = (user.role === 'USER' || user.role === 'USER_PREMIUM');

  const [userLocation, setUserLocation] = useState(null);
  const [wifiSpots, setWifiSpots] = useState([]); // Agora, o estado dos spots é compartilhado
  const [modalOpen, setModalOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);
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

    // Carregar todos os spots inicialmente
    const loadExistingWifiSpots = async () => {
      try {
        const response = await wifiSpotApi.getWifiSpots(user);
        if (response.status === 200) {
          const spotsList = response.data.map((spot) => ({
            ...spot,
            coordinates: { lat: spot.latitude, lng: spot.longitude },
          }));
          setWifiSpots(spotsList);
        }
      } catch (error) {
        errorNotification("Error fetching WiFi spots.");
      }
    };
    loadExistingWifiSpots();
  }, []);

  // Atualiza os WiFi spots
  function handleApplyFilters(filteredSpots) {
    setWifiSpots(filteredSpots); // Atualiza os spots no mapa
    setFilterModalOpen(false); // Fecha o modal
  };
  // Função para limpar os filtros
  const clearFilters = async () => {
    try {
      const response = await wifiSpotApi.getWifiSpots(user); // Busca todos os spots
      if (response.status === 200) {
        const spotsList = response.data.map((spot) => ({
          ...spot,
          coordinates: { lat: spot.latitude, lng: spot.longitude },
        }));
        setWifiSpots(spotsList); // Atualiza os spots no mapa
      }
    } catch (error) {
      errorNotification("Failed to fetch WiFi spots.");
    }
  };

  if (!isUser) {
    return <Navigate to="/" />;
  }

  return (
    <Container>
      <h3>WiFi Map</h3>
      <Button primary onClick={() => setFilterModalOpen(true)} style={{ marginBottom: '15px' }}>
        Filtrar
      </Button>
      <Button secondary onClick={clearFilters}>
        Clear Filters
      </Button>
      {userLocation ? (
        <MapContainer center={userLocation} zoom={13} style={{ height: '60vh', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          />
          <MapClickHandler onMapClick={(coordinates) => setNewSpotDetails({ coordinates, name: '', size: '' })} />
          <Marker position={userLocation} icon={userIcon}>
            <Tooltip direction="top" offset={[0, -20]} opacity={1}>
              You are here
            </Tooltip>
            <Popup>Your current location</Popup>
          </Marker>
          {wifiSpots.map((spot, index) => (
            <Marker
              key={index}
              position={spot.coordinates}
              icon={wifiSpotIcon}
              eventHandlers={{
                click: () => setSelectedSpot(spot),
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

      <Modal open={filterModalOpen} onClose={() => setFilterModalOpen(false)}>
        <Modal.Content>
          <WifiSpotFilter onApplyFilters={handleApplyFilters} />
        </Modal.Content>
        <Modal.Actions>
          <Button onClick={() => setFilterModalOpen(false)}>Close</Button>
        </Modal.Actions>
      </Modal>

      <AddSpotModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        spotDetails={newSpotDetails}
        setSpotDetails={setNewSpotDetails}
      />
      {selectedSpot && (
        <SpotDetailsModal
          userLocation={userLocation}
          onClose={() => setSelectedSpot(null)}
          spot={selectedSpot}
        />
      )}
    </Container>
  );
}

export default WifiMapPage;
