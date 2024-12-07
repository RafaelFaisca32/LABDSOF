import axios from 'axios'
import { config } from '../../Constants'

export const wifiSpotVisitApi = {
  startVisit,
  finishVisit,
  getOngoingWifiSpotVisit
}

function getOngoingWifiSpotVisit(user){
  return instance.get('/api/wifi-spot-visit/ongoing', {
    headers: {
      'Content-type': 'application/json',
      'Authorization': basicAuth(user)
    }
  })
}

function finishVisit(user,wifiSpotVisitId) {
  let params = {
    dateTime: new Date().toISOString(),
  }
  return instance.post('/api/wifi-spot-visit/finish/'+wifiSpotVisitId, params, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': basicAuth(user)
    }
  })
}

function startVisit(user, wifiSpotId) {
  return instance.post('/api/wifi-spot-visit/start/'+wifiSpotId, null, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': basicAuth(user)
    }
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