import axios from 'axios'
import { config } from '../../Constants'

export const wifiSpotApi = {
  getWifiSpots,
  createWifiSpot,
  getNumberWifiSpots
}

function getNumberWifiSpots() {
  return instance.get('/public/number-wifi-spots')
}

function createWifiSpot(user, wifiSpot) {
  return instance.post('/api/wifi-spot', wifiSpot, {
    headers: { 'Content-type': 'application/json', 'Authorization': basicAuth(user) }
  })
}

function getWifiSpots(user) {
  return instance.get('/api/wifi-spot', {
    headers: { 'Authorization': basicAuth(user) }
  })
}

// -- Axios

const instance = axios.create({
  baseURL: config.url.API_BASE_URL
})

// -- Helper functions

function basicAuth(user) {
  return `Basic ${user.authdata}`
}
