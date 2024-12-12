import React, { useEffect, useState } from 'react';
import { wifiSpotVisitApi } from '../misc/WifiSpotVisitApi';
import { useAuth } from '../context/AuthContext';
import { errorNotification, successNotification } from "../misc/Helpers";
import {Modal, Header, Button, Segment} from 'semantic-ui-react';
import { countries } from './AddSpotModal';

function SpotDetailsModal({ userLocation, spot, onClose, justDetails }) {
  const [appSelectionModalOpen, setAppSelectionModalOpen] = useState(false);
  const Auth = useAuth();
  const user = Auth.getUser();
  const [existsVisit, setExistsVisit] = useState(null); // Track if visit exists
  const [loading, setLoading] = useState(true);
  const [processingVisitRequest, setProcessingVisitRequest] = useState(false);
  const [wifiSpotVisitId,setWifiSpotVisitId] = useState(null);

  const getCountryByValue = (value) => {
    const country = countries.find((c) => c.value === value);
    return country ? country.text : value;
  };


  useEffect(() => {
    const controller = new AbortController();
    const fetchVisitStatus = async () => {
      if (!spot) return; // Ensure spot is defined
      setLoading(true);
      try {
        const response = await wifiSpotVisitApi.getOngoingWifiSpotVisit(user);
        if (response && response.status === 200) {
          if(response.data.wifiSpotId === spot.uuid) {
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

    if (!justDetails)
      fetchVisitStatus();
    return () => controller.abort();
    // eslint-disable-next-line
  }, [spot]);

  if (!spot) return null;

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



  const startVisit = async () => {
    setProcessingVisitRequest(true);
    try {
      const response = await wifiSpotVisitApi.startVisit(user, spot.uuid);
      if (response && response.status === 201) {
        onClose(); // Close the modal
        successNotification("Wifi Spot Visit started successfully.");
      }
    } catch (err) {
      errorNotification(err.response?.data?.message || "Error starting visit");
    } finally {
      setProcessingVisitRequest(false);
    }
  };

  const finishVisit = async () => {
    setProcessingVisitRequest(true);
    try {
      const response = await wifiSpotVisitApi.finishVisit(user,wifiSpotVisitId);
      if (response && response.status === 200) {
        onClose(); // Close the modal
        successNotification("Wifi Spot Visit finished successfully.");
      }
    } catch (err) {
      errorNotification(err.response?.data?.message || "Error finishing visit");
    } finally {
      setProcessingVisitRequest(false);
    }
  };

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
            <p><strong>Country:</strong> {getCountryByValue(spot.address.country)}</p>
            <p><strong>Zip Code:</strong> {spot.address.zipCode}</p>
            <p><strong>Latitude:</strong> {spot.latitude}</p>
            <p><strong>Longitude:</strong> {spot.longitude}</p>
          </Segment>
        </Modal.Content>
        {!justDetails ? (
        <Modal.Actions>
          {loading ? (
              <Button disabled>
                Loading...
              </Button>
          ) : processingVisitRequest ? (
              <div style={{position: 'relative', display: 'inline-block'}}>
                <div className="loader-small"></div>
                <Button disabled>
                  {existsVisit ? "Finish Visit" : "Start Visit"}
                </Button>
              </div>
          ) : (
              <Button onClick={existsVisit ? finishVisit : startVisit}>
                {existsVisit ? "Finish Visit" : "Start Visit"}
              </Button>
          )}



          <Button onClick={openDirections}>Get Directions</Button>
          <Button onClick={onClose}>Close</Button>
        </Modal.Actions>
        ) : (
          <Modal.Actions>
            <Button onClick={onClose}>Close</Button>
          </Modal.Actions>
        )}
      {appSelectionModalOpen && !justDetails && (
        <Modal open={appSelectionModalOpen} onClose={() => setAppSelectionModalOpen(false)} size="small">
          <Modal.Header>Select App to Open Directions</Modal.Header>
          <Modal.Content>
            {/* add the google maps in the future */}
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
