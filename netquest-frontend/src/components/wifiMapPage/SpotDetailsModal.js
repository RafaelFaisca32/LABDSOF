import React from 'react';
import {Modal, Header, Button, Segment} from 'semantic-ui-react';

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
      <Modal.Content scrolling style={{maxHeight: "70vh", overflowY: "auto"}}>
        <Segment>
          <Header as="h4">Basic Information</Header>
          <p><strong>Name:</strong> {spot.name}</p>
          <p><strong>Description:</strong> {spot.description}</p>
          <p><strong>Location Type:</strong> {spot.locationType}</p>
        </Segment>

        <Segment>
          <Header as="h4">Quality</Header>
          <p><strong>Wifi Quality:</strong> {spot.wifiQuality}</p>
          <p><strong>Signal Strength:</strong> {spot.signalStrength}</p>
          <p><strong>Bandwidth Limitations:</strong> {spot.bandwidth}</p>
          <p><strong>Peak Usage Start:</strong> {spot.peakUsageStart}</p>
          <p><strong>Peak Usage End:</strong> {spot.peakUsageEnd}</p>
        </Segment>

        <Segment>
          <Header as="h4">Environmental Features</Header>
          <p><strong>Crowded:</strong> {spot.crowded ? "Yes" : "No"}</p>
          <p><strong>Covered Area:</strong> {spot.coveredArea ? "Yes" : "No"}</p>
          <p><strong>Air Conditioning:</strong> {spot.airConditioning ? "Yes" : "No"}</p>
          <p><strong>Good View:</strong> {spot.goodView ? "Yes" : "No"}</p>
          <p><strong>Noise Level:</strong> {spot.noiseLevel}</p>
          <p><strong>Pet Friendly:</strong> {spot.petFriendly ? "Yes" : "No"}</p>
          <p><strong>Child Friendly:</strong> {spot.childFriendly ? "Yes" : "No"}</p>
          <p><strong>Disable Access:</strong> {spot.disableAccess ? "Yes" : "No"}</p>
        </Segment>

        <Segment>
          <Header as="h4">Facilities</Header>
          <p><strong>Available Power Outlets:</strong> {spot.availablePowerOutlets ? "Yes" : "No"}</p>
          <p><strong>Charging Stations:</strong> {spot.chargingStations ? "Yes" : "No"}</p>
          <p><strong>Restrooms Available:</strong> {spot.restroomsAvailable ? "Yes" : "No"}</p>
          <p><strong>Parking Availability:</strong> {spot.parkingAvailability ? "Yes" : "No"}</p>
          <p><strong>Food Options:</strong> {spot.foodOptions ? "Yes" : "No"}</p>
          <p><strong>Drink Options:</strong> {spot.drinkOptions ? "Yes" : "No"}</p>
        </Segment>

        <Segment>
          <Header as="h4">Weather Features</Header>
          <p><strong>Open during Rain:</strong> {spot.openDuringRain ? "Yes" : "No"}</p>
          <p><strong>Open during Heat:</strong> {spot.openDuringHeat ? "Yes" : "No"}</p>
          <p><strong>Heated in Winter:</strong> {spot.heatedInWinter ? "Yes" : "No"}</p>
          <p><strong>Shaded Areas:</strong> {spot.shadedAreas ? "Yes" : "No"}</p>
          <p><strong>Outdoor Fans:</strong> {spot.outdoorFans ? "Yes" : "No"}</p>
        </Segment>

        <Segment>
          <Header as="h4">Address</Header>
          <p><strong>Address Line 1:</strong> {spot.address.addressLine1}</p>
          <p><strong>Address Line 2:</strong> {spot.address.addressLine2}</p>
          <p><strong>City:</strong> {spot.address.city}</p>
          <p><strong>District:</strong> {spot.address.district}</p>
          <p><strong>Country:</strong> {spot.address.country}</p>
          <p><strong>Zip Code:</strong> {spot.address.zipCode}</p>
          <p><strong>Latitude:</strong> {spot.latitude}</p>
          <p><strong>Longitude:</strong> {spot.longitude}</p>
        </Segment>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={openDirections}>Get Directions</Button>
        <Button onClick={onClose}>Close</Button>
      </Modal.Actions>
    </Modal>
  );
}

export default SpotDetailsModal;
