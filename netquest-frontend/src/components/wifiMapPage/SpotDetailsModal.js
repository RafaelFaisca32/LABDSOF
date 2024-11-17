import React, { useEffect, useState } from 'react';
import { Modal, Header, Button } from 'semantic-ui-react';
import { wifiSpotVisitApi } from '../misc/WifiSpotVisitApi';
import { useAuth } from '../context/AuthContext';
import { errorNotification, successNotification } from "../misc/Helpers";

function SpotDetailsModal({ userLocation, spot, onClose }) {
  const [appSelectionModalOpen, setAppSelectionModalOpen] = useState(false);
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

  if(spot.name === "TESTE1"){
    spot.id = "3fa85f64-5717-4562-b3fc-2c963f66afa6";
  } else {
    spot.id = "640e326f-2bce-4851-93fc-d982050dd85a";
  }
   // Hardcoded spot ID for now

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

    const googleMapsUrl = `google.maps://?daddr=${spotLat},${spotLng}`;
    const wazeUrl = `waze://?ll=${spotLat},${spotLng}&navigate=yes`;

    const androidGoogleMapsUrl = `intent://maps/dir/${userLat},${userLng}@${spotLat},${spotLng}?zoom=14#Intent;scheme=geo;package=com.google.android.apps.maps;end`;

    if (app === 'googleMaps') {
      if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
        window.location.href = googleMapsUrl; 
      } else if (navigator.userAgent.includes('Android')) {
        window.location.href = androidGoogleMapsUrl;
      }
    } else if (app === 'waze') {
      if (navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
        window.location.href = wazeUrl; 
      } else if (navigator.userAgent.includes('Android')) {
        window.location.href = wazeUrl; 
      }
    }

    setAppSelectionModalOpen(false); 
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
      {appSelectionModalOpen && (
        <Modal open={appSelectionModalOpen} onClose={() => setAppSelectionModalOpen(false)} size="small">
          <Modal.Header>Select App to Open Directions</Modal.Header>
          <Modal.Content>
            <Button onClick={() => handleAppSelection('googleMaps')}>Open with Google Maps</Button>
            <Button onClick={() => handleAppSelection('waze')}>Open with Waze</Button>
          </Modal.Content>
          <Modal.Actions>
          </Modal.Actions>
            <Button onClick={() => setAppSelectionModalOpen(false)}>Cancel</Button>
        </Modal>
      )}
    </Modal>
  );
}

export default SpotDetailsModal;
