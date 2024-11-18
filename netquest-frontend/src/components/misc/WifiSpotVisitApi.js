import axios from 'axios'
import { config } from '../../Constants'

export const wifiSpotVisitApi = {
  createVisit,
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

function createVisit(user,wifiSpotId) {
  let params = {
    wifiSpotId: wifiSpotId,
    startDateTime: new Date().toISOString(),
  };
  return instance.post('/api/wifi-spot-visit', params, {
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