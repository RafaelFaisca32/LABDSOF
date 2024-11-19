import axios from 'axios'
import { config } from '../../Constants'

export const wifiSpotVisitApi = {
  createVisitSimple,
  endVisit,
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

function endVisit(user,wifiSpotVisitId) {
  let params = {
    dateTime: new Date().toISOString(),
  }
  return instance.patch('/api/wifi-spot-visit/update-end-date-time/'+wifiSpotVisitId, params, {
    headers: {
      'Content-type': 'application/json',
      'Authorization': basicAuth(user)
    }
  })
}

function createVisitSimple(user,wifiSpotId) {
  return instance.post('/api/wifi-spot-visit/simple/'+wifiSpotId, null, {
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