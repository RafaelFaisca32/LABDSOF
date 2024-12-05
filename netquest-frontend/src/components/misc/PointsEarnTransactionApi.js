import axios from 'axios';
import { config } from '../../Constants';

export const pointsEarnTransactionApi = {
    getMyPoints
}


function getMyPoints(user,page,pageSize) {
    const parameters = `page=${page}&pageSize=${pageSize}`;
    return instance.get('/api/points-earn/my-points-earn-transactions?'+parameters, {
        headers: { 'Authorization': basicAuth(user) }
    });
}

// -- Axios
const instance = axios.create({
    baseURL: config.url.API_BASE_URL
});


function basicAuth(user) {
    return `Basic ${user.authdata}`;
}
