import React, { useState } from 'react';
import { Modal, Header, Button } from 'semantic-ui-react';

function SpotDetailsModal({ userLocation, spot, onClose }) {
  const [appSelectionModalOpen, setAppSelectionModalOpen] = useState(false);

  if (!spot) return null;

  const openDirections = () => {
    const [userLat, userLng] = userLocation || [null, null];
    const { lat: spotLat, lng: spotLng } = spot.coordinates;

    if (userLat === null || userLng === null) {
      alert("User location is not available.");
      return;
    }

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${spotLat},${spotLng}&travelmode=driving`;

    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    if (isMobile) {
      setAppSelectionModalOpen(true); 
    } else {
      window.open(googleMapsUrl, '_blank');
    }
  };

  const handleAppSelection = (app) => {
    const [userLat, userLng] = userLocation || [null, null];
    const { lat: spotLat, lng: spotLng } = spot.coordinates;

    if (app === 'googleMaps') {
      window.location.href = `intent://maps/dir/${userLat},${userLng}@${spotLat},${spotLng}?zoom=14#Intent;scheme=geo;package=com.google.android.apps.maps;end`;
    } else if (app === 'waze') {
      window.location.href = `waze://?ll=${spotLat},${spotLng}&navigate=yes`;
    }

    setAppSelectionModalOpen(false);
  };

  return (
    <Modal open={!!spot} onClose={onClose} size="small">
      <Modal.Header>Spot Details</Modal.Header>
      <Modal.Content>
        <Header>{spot.name}</Header>
        <p>Size: {spot.size}</p>
        <p>Coordinates: {spot.coordinates.lat}, {spot.coordinates.lng}</p>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={openDirections}>Get Directions</Button>
        <Button onClick={onClose}>Close</Button>
      </Modal.Actions>
      {appSelectionModalOpen && (
        <Modal open={appSelectionModalOpen} onClose={() => setAppSelectionModalOpen(false)} size="small">
          <Modal.Header>Select App to Open Directions</Modal.Header>
          <Modal.Content>
            <Button onClick={() => handleAppSelection('googleMaps')}>Open with Google Maps</Button>
            <Button onClick={() => handleAppSelection('waze')}>Open with Waze</Button>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => setAppSelectionModalOpen(false)}>Cancel</Button>
          </Modal.Actions>
        </Modal>
      )}
    </Modal>
  );
}

export default SpotDetailsModal;
