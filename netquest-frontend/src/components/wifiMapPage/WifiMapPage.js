import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {Container, Message} from 'semantic-ui-react';
import { useAuth } from '../context/AuthContext';
import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import SpotDetailsModal from './SpotDetailsModal';
import AddSpotModal from './AddSpotModal';
import { wifiSpotApi } from "../misc/WifiSpotApi"

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
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const loadExistingWifiSpots = async () => {
    const responseGetWifiSpots = await wifiSpotApi.getWifiSpots(user);
    if (responseGetWifiSpots.status === 200) {
      const wifiSpotsList = responseGetWifiSpots.data;
      const formattedSpots = wifiSpotsList.map((spot) => {
        const coordinates = {
          lat: spot.latitude,
          lng: spot.longitude
        };
        return {
          ...spot,
          coordinates,
          addressLine1: spot.address.addressLine1,
          addressLine2: spot.address.addressLine2,
          city: spot.address.city,
          district: spot.address.district,
          country: spot.address.country,
          zipCode: spot.address.zipCode
        };
      });
      setSpots(formattedSpots); // Set all spots at once to avoid stale state issues
    }
  }

  useEffect( () => {
    navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
        },
        (error) => console.error(error),
        {enableHighAccuracy: true}
    );

    loadExistingWifiSpots();
  }, []);

  const handleMapClick = (coordinates) => {
    setNewSpotDetails({ coordinates, name: '', size: '' });
    setModalOpen(true);
  };

  const addSpot = async () => {
    if (
        newSpotDetails.coordinates &&
        newSpotDetails.coordinates.lat &&
        newSpotDetails.coordinates.lng &&
        newSpotDetails.name &&
        newSpotDetails.description &&
        newSpotDetails.locationType &&
        newSpotDetails.wifiQuality &&
        newSpotDetails.signalStrength &&
        newSpotDetails.bandwidth &&
        newSpotDetails.crowded !== undefined &&
        newSpotDetails.coveredArea !== undefined &&
        newSpotDetails.airConditioning !== undefined &&
        newSpotDetails.goodView !== undefined &&
        newSpotDetails.noiseLevel &&
        newSpotDetails.petFriendly !== undefined &&
        newSpotDetails.childFriendly !== undefined &&
        newSpotDetails.disableAccess !== undefined &&
        newSpotDetails.availablePowerOutlets !== undefined &&
        newSpotDetails.chargingStations !== undefined &&
        newSpotDetails.restroomsAvailable !== undefined &&
        newSpotDetails.parkingAvailability !== undefined &&
        newSpotDetails.foodOptions !== undefined &&
        newSpotDetails.drinkOptions !== undefined &&
        newSpotDetails.addressLine1 &&
        newSpotDetails.city &&
        newSpotDetails.district &&
        newSpotDetails.country &&
        newSpotDetails.zipCode
    ) {
      newSpotDetails.latitude = newSpotDetails.coordinates.lat;
      newSpotDetails.longitude = newSpotDetails.coordinates.lng;
      newSpotDetails.address = {
        addressLine1: newSpotDetails.addressLine1,
        addressLine2: newSpotDetails.addressLine2,
        city: newSpotDetails.city,
        district: newSpotDetails.district,
        country: newSpotDetails.country,
        zipCode: newSpotDetails.zipCode
      }
      const responseCreateWifiSpot = await wifiSpotApi.createWifiSpot(user, newSpotDetails);
      if (responseCreateWifiSpot && responseCreateWifiSpot.status === 201) {
        setSpots([...spots, newSpotDetails]);
        setShowSuccessMessage(true);
        setModalOpen(false);
      }
    } else {
      alert("Missing mandatory fields!");
    }

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
      {showSuccessMessage && (
          <Message positive>
            <Message.Header>Wi-Fi spot registered successfully and shared with others!</Message.Header>
          </Message>
      )}
    </Container>
  );
}

export default WifiMapPage;
