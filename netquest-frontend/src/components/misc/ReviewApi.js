import axios from 'axios';
import { config } from '../../Constants';

export const reviewApi = {
    userAllowedToCreateReview,
    createReview
}

function createReview(user, review) {
    return instance.post('/api/review', review, {
        headers: { 'Content-type': 'application/json', 'Authorization': basicAuth(user) }
    });
}

function userAllowedToCreateReview(user, wifiSpotId) {
    return instance.get('/api/review/user-allowed-to-create-review/' + wifiSpotId, {
        headers: { 'Content-type': 'application/json', 'Authorization': basicAuth(user) }
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
