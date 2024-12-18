import React, { useState } from 'react';
import { Container, Form, Button, Divider } from 'semantic-ui-react';
import { wifiSpotApi } from "../misc/WifiSpotApi";
import { errorNotification } from "../misc/Helpers";
import { useAuth } from "../context/AuthContext";

function WifiSpotFilter({ onApplyFilters }) {
  const Auth = useAuth();
  const user = Auth.getUser();
  const [filters, setFilters] = useState({});

  const handleFilterChange = (key, value) => {
    if(!value){
      setFilters((prev) => ({...prev, [key]: null}));
    }else {
      setFilters((prev) => ({...prev, [key]: value}));
    }
  };

  const applyFilters = async () => {
    try {
      const validFilters = Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {});

      const response = await wifiSpotApi.getFilteredWifiSpots(user, validFilters);
      if (response.status === 200) {
        const spotsList = response.data.map((spot) => ({
          ...spot,
          coordinates: { lat: spot.latitude, lng: spot.longitude },
        }));
        onApplyFilters(spotsList)
      }

    } catch (error) {
      errorNotification("Failed to fetch WiFi spots.");
    }
  };



  return (
    <Container>
      <h3>Filter WiFi Spots</h3>
      <Form>
        {/* Basic Filters */}
        <Divider horizontal>Basic</Divider>
        <Form.Group widths="equal">
          <Form.Input
            label="Name"
            placeholder="Enter name"
            onChange={(e) => handleFilterChange('name', e.target.value)}
          />
          <Form.Checkbox
            label="Exact Match"
            onChange={(e, { checked }) => handleFilterChange('exactName', checked)}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input
            label="Description"
            placeholder="Enter description"
            onChange={(e) => handleFilterChange('description', e.target.value)}
          />
          <Form.Checkbox
            label="Exact Match for Description"
            onChange={(e, { checked }) => handleFilterChange('exactDescription', checked)}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input
            label="Radius (KM)"
            type="number"
            placeholder="Enter radius in KM"
            onChange={(e) => handleFilterChange('radius', parseFloat(e.target.value))}
          />
        </Form.Group>

        {/* Advanced Filters */}
        <Divider horizontal>Advanced</Divider>

        {/* Basic Information */}
        <Divider horizontal>Basic Information</Divider>
        <Form.Group widths="equal">
          <Form.Input
            label="Name"
            placeholder="Enter name"
            onChange={(e) => handleFilterChange('advancedName', e.target.value)}
          />
          <Form.Input
            label="Description"
            placeholder="Enter description"
            onChange={(e) => handleFilterChange('advancedDescription', e.target.value)}
          />
          <Form.Select
            label="Location Type"
            options={[
              { key: '', text: '', value: '' },
              { key: 'public', text: 'Public', value: 'PUBLIC' },
              { key: 'cafe', text: 'Cafe', value: 'CAFE' },
              { key: 'library', text: 'Library', value: 'LIBRARY' },
              { key: 'park', text: 'Park', value: 'PARK' },
              { key: 'school', text: 'School', value: 'SCHOOL' },
              { key: 'restaurant', text: 'Restaurant', value: 'RESTAURANT' },
              { key: 'others', text: 'Others', value: 'OTHERS' },
            ]}
            onChange={(e, { value }) => handleFilterChange('locationType', value)}
          />
        </Form.Group>

        {/* Quality */}
        <Divider horizontal>Quality</Divider>
        <Form.Group widths="equal">
          <Form.Select
            label="WiFi Quality"
            options={[
              { key: '', text: '', value: '' },
              { key: 'high', text: 'High', value: 'HIGH' },
              { key: 'medium', text: 'Medium', value: 'MEDIUM' },
              { key: 'low', text: 'Low', value: 'LOW' },
            ]}
            onChange={(e, { value }) => handleFilterChange('wifiQuality', value)}
          />
          <Form.Select
            label="Signal Strength"
            options={[
              { key: '', text: '', value: '' },
              { key: 'strong', text: 'Strong', value: 'STRONG' },
              { key: 'medium', text: 'Medium', value: 'MEDIUM' },
              { key: 'low', text: 'Low', value: 'LOW' },
            ]}
            onChange={(e, { value }) => handleFilterChange('signalStrength', value)}
          />
          <Form.Select
            label="Bandwidth Limitations"
            options={[
              { key: '', text: '', value: '' },
              { key: 'limited', text: 'Limited', value: 'LIMITED' },
              { key: 'unlimited', text: 'Unlimited', value: 'UNLIMITED' },
            ]}
            onChange={(e, { value }) => handleFilterChange('bandwidth', value)}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Input
            label="Peak Usage Start"
            type="time"
            onChange={(e) => handleFilterChange('peakStartTime', e.target.value)}
          />
          <Form.Input
            label="Peak Usage End"
            type="time"
            onChange={(e) => handleFilterChange('peakEndTime', e.target.value)}
          />
        </Form.Group>

        {/* Environmental Features */}
        <Divider horizontal>Environmental Features</Divider>
        <Form.Group widths="equal">
          <Form.Checkbox
            label="Crowded"
            checked={filters.crowded || null}
            onChange={(e, { checked }) => handleFilterChange('crowded', checked)}
          />
          <Form.Checkbox
            label="Covered Area"
            checked={filters.coveredArea || null}
            onChange={(e, { checked }) => handleFilterChange('coveredArea', checked)}
          />
          <Form.Checkbox
            label="Air Conditioning"
            checked={filters.airConditioning || null}
            onChange={(e, { checked }) => handleFilterChange('airConditioning', checked)}
          />
          <Form.Checkbox
            label="Good View"
            checked={filters.goodView || null}
            onChange={(e, { checked }) => handleFilterChange('goodView', checked)}
          />
          <Form.Select
            label="Noise Level"
            options={[
              { key: 'none', text: 'None', value: 'NONE' },
              { key: 'quiet', text: 'Quiet', value: 'QUIET' },
              { key: 'moderate', text: 'Moderate', value: 'MODERATE' },
              { key: 'loud', text: 'Loud', value: 'LOUD' },
            ]}
            onChange={(e, { value }) => handleFilterChange('noiseLevel', value)}
          />
          <Form.Checkbox
            label="Pet Friendly"
            checked={filters.petFriendly || null}
            onChange={(e, { checked }) => handleFilterChange('petFriendly', checked)}
          />
          <Form.Checkbox
            label="Child Friendly"
            checked={filters.childFriendly || null}
            onChange={(e, { checked }) => handleFilterChange('childFriendly', checked)}
          />
          <Form.Checkbox
            label="Disable Access"
            checked={filters.disableAccess || null}
            onChange={(e, { checked }) => handleFilterChange('disableAccess', checked)}
          />
        </Form.Group>

        {/* Facilities */}
        <Divider horizontal>Facilities</Divider>
        <Form.Group widths="equal">
          <Form.Checkbox
            label="Available Power Outlets"
            checked={filters.availablePowerOutlets || null}
            onChange={(e, { checked }) => handleFilterChange('availablePowerOutlets', checked)}
          />
          <Form.Checkbox
            label="Charging Stations"
            checked={filters.chargingStations || null}
            onChange={(e, { checked }) => handleFilterChange('chargingStations', checked)}
          />
          <Form.Checkbox
            label="Restrooms Available"
            checked={filters.restroomsAvailable || null}
            onChange={(e, { checked }) => handleFilterChange('restroomsAvailable', checked)}
          />
          <Form.Checkbox
            label="Parking Availability"
            checked={filters.parkingAvailability || null}
            onChange={(e, { checked }) => handleFilterChange('parkingAvailability', checked)}
          />
          <Form.Checkbox
            label="Food Options"
            checked={filters.foodOptions || null}
            onChange={(e, { checked }) => handleFilterChange('foodOptions', checked)}
          />
          <Form.Checkbox
            label="Drink Options"
            checked={filters.drinkOptions || null}
            onChange={(e, { checked }) => handleFilterChange('drinkOptions', checked)}
          />
        </Form.Group>

        {/* Weather Features */}
        <Divider horizontal>Weather Features</Divider>
        <Form.Group widths="equal">
          <Form.Checkbox
            label="Open during Rain"
            checked={filters.openDuringRain || null}
            onChange={(e, { checked }) => handleFilterChange('openDuringRain', checked)}
          />
          <Form.Checkbox
            label="Open during Heat"
            checked={filters.openDuringHeat || null}
            onChange={(e, { checked }) => handleFilterChange('openDuringHeat', checked)}
          />
          <Form.Checkbox
            label="Heated in Winter"
            checked={filters.heatedInWinter || null}
            onChange={(e, { checked }) => handleFilterChange('heatedInWinter', checked)}
          />
          <Form.Checkbox
            label="Shaded Areas"
            checked={filters.shadedAreas || null}
            onChange={(e, { checked }) => handleFilterChange('shadedAreas', checked)}
          />
          <Form.Checkbox
            label="Outdoor Fans"
            checked={filters.outdoorFans || null}
            onChange={(e, { checked }) => handleFilterChange('outdoorFans', checked)}
          />
        </Form.Group>

        <Button primary onClick={applyFilters}>
          Apply Filters
        </Button>

      </Form>
    </Container>
  );
}

export default WifiSpotFilter;
