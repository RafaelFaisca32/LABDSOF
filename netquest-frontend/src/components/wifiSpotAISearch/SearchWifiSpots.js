import React, { useState } from 'react';
import { Input, Button } from 'semantic-ui-react';
import { wifiSpotApi } from '../misc/WifiSpotApi';
import { errorNotification, warningNotification } from '../misc/Helpers';
import { useAuth } from "../context/AuthContext";

function SearchWifiSpots({ handleApplyFilters, clearFilters }) {
  const Auth = useAuth();
  const user = Auth.getUser();
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (searchTerm.trim() === '') {
      errorNotification('Search term must not be empty.');
      return;
    }

    setLoading(true);
    try {
      const response = await wifiSpotApi.getWifiSpotsIA(searchTerm, user); 
      if (response.status === 200) {
        const filteredSpots = response.data.map((spot) => ({
          ...spot,
          coordinates: { lat: spot.latitude, lng: spot.longitude },
        }));
        if(filteredSpots.length === 0){
            warningNotification("No wi-fi spots apply to that request");
        }
        handleApplyFilters(filteredSpots); 
      } else {
        errorNotification(response.data.message || 'Failed to fetch WiFi spots matching your search.');
      }
    } catch (error) {
      errorNotification(error.response?.data?.message || 'Error occurred while searching for WiFi spots.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setSearchTerm('')
    clearFilters(); 
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    if (value.length <= 200) {
      setSearchTerm(value);
    }
  };

  return (
    <div style={{ marginBottom: '20px' }}>
      <Input
        placeholder="Search WiFi spots..."
        value={searchTerm}
        onChange={handleInputChange}
        style={{ marginRight: '10px', width: '400px', fontSize: '1.2em' }}
      />
      <Button primary onClick={handleSearch} loading={loading} disabled={loading || searchTerm.trim() === ''}>
        Search
      </Button>
      <Button onClick={handleClear} disabled={loading} style={{ marginLeft: '10px' }}>
        Clear
      </Button>
    </div>
  );
}

export default SearchWifiSpots;
