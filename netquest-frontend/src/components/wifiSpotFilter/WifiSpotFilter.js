import React, { useState } from 'react';
import { Container, Form, Table, Button, Divider } from 'semantic-ui-react';
import { wifiSpotApi } from "../misc/WifiSpotApi";
import { errorNotification } from "../misc/Helpers";
import { useAuth } from "../context/AuthContext";

function WifiSpotFilter() {
  const Auth = useAuth();
  const user = Auth.getUser();
  const [filters, setFilters] = useState({});
  const [wifiSpots, setWifiSpots] = useState([]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
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
        setWifiSpots(response.data);
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

        {/* Advanced Filters */}
        <Divider horizontal>Advanced</Divider>

        {/* Basic Information */}
        <Divider horizontal>Basic Information</Divider>
        <Form.Group widths="equal">
          <Form.Select
            label="Location Type"
            options={[
              { key: 'public', text: 'Public', value: 'Public' },
              { key: 'cafe', text: 'Cafe', value: 'Cafe' },
              { key: 'library', text: 'Library', value: 'Library' },
              { key: 'park', text: 'Park', value: 'Park' },
              { key: 'school', text: 'School', value: 'School' },
              { key: 'restaurant', text: 'Restaurant', value: 'Restaurant' },
              { key: 'others', text: 'Others', value: 'Others' },
            ]}
            onChange={(e, { value }) => handleFilterChange('locationType', value)}
          />
        </Form.Group>

        {/* Quality Filters */}
        <Divider horizontal>Quality</Divider>
        <Form.Group widths="equal">
          <Form.Select
            label="WiFi Quality"
            options={[
              { key: 'high', text: 'High', value: 'High' },
              { key: 'medium', text: 'Medium', value: 'Medium' },
              { key: 'low', text: 'Low', value: 'Low' },
            ]}
            onChange={(e, { value }) => handleFilterChange('wifiQuality', value)}
          />
          <Form.Select
            label="Signal Strength"
            options={[
              { key: 'strong', text: 'Strong', value: 'Strong' },
              { key: 'medium', text: 'Medium', value: 'Medium' },
              { key: 'low', text: 'Low', value: 'Low' },
            ]}
            onChange={(e, { value }) => handleFilterChange('signalStrength', value)}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Select
            label="Bandwidth"
            options={[
              { key: 'limited', text: 'Limited', value: 'Limited' },
              { key: 'unlimited', text: 'Unlimited', value: 'Unlimited' },
            ]}
            onChange={(e, { value }) => handleFilterChange('bandwidth', value)}
          />
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
            checked={filters.crowded || false}
            onChange={(e, { checked }) => handleFilterChange('crowded', checked)}
          />
        </Form.Group>
        <Form.Group widths="equal">
          <Form.Checkbox
            label="Covered Area"
            checked={filters.coveredArea || false}
            onChange={(e, { checked }) => handleFilterChange('coveredArea', checked)}
          />
        </Form.Group>
        {/* Facilities */}
        <Divider horizontal>Facilities</Divider>
        <Form.Group widths="equal">
          <Form.Checkbox
            label="Available Power Outlets"
            checked={filters.availablePowerOutlets || false}
            onChange={(e, { checked }) => handleFilterChange('availablePowerOutlets', checked)}
          />
        </Form.Group>

        {/* Weather Features */}
        <Divider horizontal>Weather Features</Divider>
        <Form.Group widths="equal">
          <Form.Group widths="equal">
            <Form.Checkbox
              label="Open During Rain"
              checked={filters.openDuringRain || false}
              onChange={(e, { checked }) => handleFilterChange('openDuringRain', checked)}
            />
          </Form.Group>
        </Form.Group>

        {/* Apply Filters Button */}
        <Button primary onClick={applyFilters}>
          Apply Filters
        </Button>
      </Form>

      <h3>WiFi Spot List</h3>
      {wifiSpots.length > 0 ? (
        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Name</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Location Type</Table.HeaderCell>
              <Table.HeaderCell>WiFi Quality</Table.HeaderCell>
              <Table.HeaderCell>Actions</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {wifiSpots.map((spot, index) => (
              <Table.Row key={index}>
                <Table.Cell>{spot.name}</Table.Cell>
                <Table.Cell>{spot.description}</Table.Cell>
                <Table.Cell>{spot.locationType}</Table.Cell>
                <Table.Cell>{spot.wifiQuality}</Table.Cell>
                <Table.Cell>
                  <Button size="small" onClick={() => console.log(`View details of ${spot.name}`)}>
                    View
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table>
      ) : (
        <p>No WiFi spots found. Please apply different filters.</p>
      )}
    </Container>
  );
}

export default WifiSpotFilter;
