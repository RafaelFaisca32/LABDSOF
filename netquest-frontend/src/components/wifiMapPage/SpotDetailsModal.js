import React from 'react';
import { Modal, Header, Button } from 'semantic-ui-react';

function SpotDetailsModal({ userLocation, spot, onClose }) {
  if (!spot) return null;

  const openDirections = () => {
    const [userLat, userLng] = userLocation || [null, null]; 
    const { lat: spotLat, lng: spotLng } = spot.coordinates; 
    if (userLat === null || userLng === null) {
      alert("User location is not available.");
      return;
    }

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLat},${userLng}&destination=${spotLat},${spotLng}&travelmode=driving`;
    const wazeUrl = `https://waze.com/ul?q=${spot.name}&lat=${spotLat}&lon=${spotLng}&z=10`;


    const isMobile = /Mobi|Android/i.test(navigator.userAgent);

    if (isMobile) {
      const openWith = `Open with:\n1. Google Maps: ${googleMapsUrl}\n2. Waze: ${wazeUrl}`;
      alert(openWith);
    } else {
      window.open(googleMapsUrl, '_blank');
    }
  };

  console.log(userLocation);

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
    </Modal>
  );
}

export default SpotDetailsModal;
