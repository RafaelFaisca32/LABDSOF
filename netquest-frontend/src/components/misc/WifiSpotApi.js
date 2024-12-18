import axios from 'axios';
import { config } from '../../Constants';

export const wifiSpotApi = {
  getWifiSpots,
  createWifiSpot,
  getNumberWifiSpots,
  getFilteredWifiSpots,
  fetchWifiSpotsByUser,
  getWifiSpotsIA,
  updateWifiSpot
};

function getNumberWifiSpots() {
  return instance.get('/public/number-wifi-spots');
}

function createWifiSpot(user, wifiSpot) {
  return instance.post('/api/wifi-spot', wifiSpot, {
    headers: { 'Content-type': 'application/json', 'Authorization': basicAuth(user) }
  });
}

function getWifiSpots(user) {
  return instance.get('/api/wifi-spot', {
    headers: { 'Authorization': basicAuth(user) }
  });
}

function updateWifiSpot(uuid, spotDetails, user) {
  return instance.put(`/api/wifi-spot/${uuid}`, spotDetails, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': basicAuth(user)
    }
  });
}


function fetchWifiSpotsByUser(user) {
  return instance.post('/api/wifi-spot/search-wifi-spots-by-user',null, {
    headers: { 'Content-type': 'application/json', 'Authorization': basicAuth(user) }
  });
}

function getFilteredWifiSpots(user, filters) {
  return instance.post(`/api/wifi-spot/search-wifi-spots`,filters, {
    headers: { 'Content-type': 'application/json', 'Authorization': basicAuth(user) }
  });
}

function getWifiSpotsIA(searchTerm,user) {
  return instance.get(`/api/wifi-spot/getAIWifiSpots?request=`+ searchTerm.toString(), {
    headers: { 'Authorization': basicAuth(user) }
  });
}

// -- Axios
const instance = axios.create({
  baseURL: config.url.API_BASE_URL
});

// -- Helper functions
function basicAuth(user) {
  return `Basic ${user.authdata}`;
}
