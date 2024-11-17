import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AddSpotModal from './AddSpotModal'; // Adjust the import path as needed

describe('AddSpotModal', () => {
  let open, onClose, onSave, spotDetails, setSpotDetails;

  beforeEach(() => {
    open = true; // Set modal to be open
    onClose = jest.fn(); // Mock the onClose function
    onSave = jest.fn(); // Mock the onSave function
    spotDetails = {
      name: 'Test Spot',
      description: 'A great place with Wi-Fi',
      locationType: 'Cafe',
      wifiQuality: 'Excellent',
      signalStrength: 5,
      bandwidth: 100,
      crowded: false,
      coveredArea: true,
      airConditioning: true,
      goodView: true,
      petFriendly: true,
      childFriendly: true,
      disableAccess: true,
      noiseLevel: 'Low',
      availablePowerOutlets: true,
      chargingStations: true,
      restroomsAvailable: true,
      parkingAvailability: true,
      foodOptions: true,
      drinkOptions: true,
      addressLine1: '123 Main St',
      addressLine2: 'Suite 200',
      city: 'Metropolis',
      district: 'Downtown',
      country: 'Countryland',
      zipCode: '12345',
      coordinates: {
        lat: 40.7128,
        lng: -74.0060,
      },
    }; // Initial spot details
    setSpotDetails = jest.fn(); // Mock the setSpotDetails function
  });

  test('renders correctly when open', () => {
    const {getByText } = render(
      <AddSpotModal 
        open={open} 
        onClose={onClose} 
        onSave={onSave} 
        spotDetails={spotDetails} 
        setSpotDetails={setSpotDetails} 
      />
    );

    expect(getByText('Add a New Spot')).toBeInTheDocument();
    expect(getByText('Cancel')).toBeInTheDocument();
    expect(getByText('Add Spot')).toBeInTheDocument();
  });

  test('calls onClose when cancel button is clicked', () => {
    const { getByText } = render(
      <AddSpotModal 
        open={open} 
        onClose={onClose} 
        onSave={onSave} 
        spotDetails={spotDetails} 
        setSpotDetails={setSpotDetails} 
      />
    );

    fireEvent.click(getByText('Cancel'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('calls onSave when add spot button is clicked', () => {
    const { getByText } = render(
      <AddSpotModal
        open={open}
        onClose={onClose}
        onSave={onSave}
        spotDetails={spotDetails}
        setSpotDetails={setSpotDetails}
      />
    );

    fireEvent.click(getByText('Add Spot'));
    expect(onSave).toHaveBeenCalledTimes(1);
  });
});
