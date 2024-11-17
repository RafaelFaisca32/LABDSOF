import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SpotDetailsModal from './SpotDetailsModal'; // Adjust the import path as needed

describe('SpotDetailsModal', () => {
  let userLocation, spot, onClose;

  beforeEach(() => {
    userLocation = [40.7128, -74.0060]; // Example user location (latitude, longitude)
    spot = {
      name: 'Central Park',
      description: 'A large public park in New York City.',
      locationType: 'Park',
      wifiQuality: 'Good',
      signalStrength: 'Strong',
      bandwidth: 'Unlimited',
      peakUsageStart: '08:00',
      peakUsageEnd: '20:00',
      crowded: false,
      coveredArea: true,
      airConditioning: false,
      goodView: true,
      noiseLevel: 'Low',
      petFriendly: true,
      childFriendly: true,
      disableAccess: true,
      availablePowerOutlets: true,
      chargingStations: true,
      restroomsAvailable: true,
      parkingAvailability: false,
      foodOptions: true,
      drinkOptions: true,
      openDuringRain: true,
      openDuringHeat: true,
      heatedInWinter: false,
      shadedAreas: true,
      outdoorFans: false,
      coordinates: { lat: 40.7851, lng: -73.9683 }, // Example spot coordinates
      address: {
        addressLine1: '59th St to 110th St',
        addressLine2: 'Between 5th and 8th Ave',
        city: 'New York',
        district: 'Manhattan',
        country: 'USA',
        zipCode: '10022',
      },
      latitude: 40.7851,
      longitude: -73.9683,
    };
    onClose = jest.fn(); // Mock the onClose function
  });

  test('renders correctly with spot details', () => {
    const { getByText } = render(
        <SpotDetailsModal userLocation={userLocation} spot={spot} onClose={onClose} />
    );

    expect(getByText('Spot Details')).toBeInTheDocument();
    expect(getByText('Central Park')).toBeInTheDocument();
    expect(getByText('A large public park in New York City.')).toBeInTheDocument();
  });

  test('does not render when spot is not provided', () => {
    const { container } = render(
        <SpotDetailsModal userLocation={userLocation} spot={null} onClose={onClose} />
    );

    expect(container.firstChild).toBeNull(); // Modal should not render
  });

  test('calls onClose when Close button is clicked', () => {
    const { getByText } = render(
        <SpotDetailsModal userLocation={userLocation} spot={spot} onClose={onClose} />
    );

    fireEvent.click(getByText('Close'));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('opens directions in a new tab when Get Directions button is clicked', () => {
    global.open = jest.fn(); // Mock window.open
    const { getByText } = render(
        <SpotDetailsModal userLocation={userLocation} spot={spot} onClose={onClose} />
    );

    fireEvent.click(getByText('Get Directions'));

    const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${userLocation[0]},${userLocation[1]}&destination=${spot.coordinates.lat},${spot.coordinates.lng}&travelmode=driving`;
    expect(global.open).toHaveBeenCalledWith(googleMapsUrl, '_blank');
  });

  test('alerts the user when location is not available', () => {
    const alertMock = jest.spyOn(window, 'alert').mockImplementation(() => {});

    // Set userLocation to null
    userLocation = [null, null];
    const { getByText } = render(
        <SpotDetailsModal userLocation={userLocation} spot={spot} onClose={onClose} />
    );

    fireEvent.click(getByText('Get Directions'));
    expect(alertMock).toHaveBeenCalledWith('User location is not available.');

    alertMock.mockRestore(); // Restore original implementation of alert
  });
});
