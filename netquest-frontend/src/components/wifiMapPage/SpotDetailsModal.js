import React, { useEffect, useState } from 'react';
import { Modal, Header, Button } from 'semantic-ui-react';
import { wifiSpotVisitApi } from '../misc/WifiSpotVisitApi';
import { useAuth } from '../context/AuthContext';
import { errorNotification, successNotification } from "../misc/Helpers";

function SpotDetailsModal({ userLocation, spot, onClose }) {
  const Auth = useAuth();
  const user = Auth.getUser();
  const [existsVisit, setExistsVisit] = useState(null); // Track if visit exists
  const [loading, setLoading] = useState(true);
  const [wifiSpotVisitId,setWifiSpotVisitId] = useState(null);


  useEffect(() => {
    const fetchVisitStatus = async () => {
      if (!spot) return; // Ensure spot is defined
      setLoading(true);
      try {
        const response = await wifiSpotVisitApi.getOngoingWifiSpotVisit(user);
        if (response && response.status === 200) {
          if(response.data.wifiSpotId === spot.id) {
            setExistsVisit(true);
            setWifiSpotVisitId(response.data.id);
          }
        }
      } catch (err) {
        if(err.response && err.response.status !== 404) {
          errorNotification(err.response?.data?.message || "Error checking visit");
        }
        setExistsVisit(false);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitStatus();
  }, [spot]);

  if (!spot) return null;

  spot.id = "3fa85f64-5717-4562-b3fc-2c963f66afa6"; // Hardcoded spot ID for now

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




  const createVisit = async () => {
    try {
      const response = await wifiSpotVisitApi.createVisit(user, spot.id);
      if (response && response.status === 201) {
        onClose(); // Close the modal
        successNotification("Wifi Spot Visit created successfully.");
      }
    } catch (err) {
      errorNotification(err.response?.data?.message || "Error creating visit");
    }
  };

  const finishVisit = async () => {
    try {
      const response = await wifiSpotVisitApi.endVisit(user,wifiSpotVisitId);
      if (response && response.status === 200) {
        onClose(); // Close the modal
        successNotification("Wifi Spot Visit finished successfully.");
      }
    } catch (err) {
      errorNotification(err.response?.data?.message || "Error finishing visit");
    }
  };

  return (
      <Modal open={!!spot} onClose={onClose} size="small">
        <Modal.Header>Spot Details</Modal.Header>
        <Modal.Content>
          <Header>{spot.name}</Header>
          <p>Size: {spot.size}</p>
          <p>Coordinates: {spot.coordinates.lat}, {spot.coordinates.lng}</p>
          {loading && <p>Loading visit status...</p>}
        </Modal.Content>
        <Modal.Actions>
          {existsVisit ? (
              <Button onClick={finishVisit}>Finish Visit</Button>
          ) : (
              <Button onClick={createVisit}>Record Visit</Button>
          )}
          <Button onClick={openDirections}>Get Directions</Button>
          <Button onClick={onClose}>Close</Button>
        </Modal.Actions>
      </Modal>
  );
}

export default SpotDetailsModal;
