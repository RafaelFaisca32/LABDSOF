import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import SpotDetailsModal from './SpotDetailsModal';
import { useAuth } from '../context/AuthContext';

// Mock the useAuth hook to return a mock user
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

describe('SpotDetailsModal', () => {
  let userLocation, spot, onClose;

  beforeEach(() => {
    // Mock user object that would be returned by useAuth
    useAuth.mockReturnValue({
      getUser: jest.fn().mockReturnValue({
        id: 'user1',
        name: 'John Doe',
      }),
    });

    userLocation = [40.7128, -74.0060]; // Example user location (latitude, longitude)
    spot = {
      name: 'Central Park',
      size: 'Large',
      coordinates: { lat: 40.7851, lng: -73.9683 }, // Example spot coordinates
    };
    onClose = jest.fn(); // Mock the onClose function
  });

  test('renders correctly with spot details', () => {
    const { getByText } = render(
        <SpotDetailsModal userLocation={userLocation} spot={spot} onClose={onClose} />
    );

    expect(getByText('Spot Details')).toBeInTheDocument();
    expect(getByText('Central Park')).toBeInTheDocument();
    expect(getByText('Size: Large')).toBeInTheDocument();
    expect(getByText('Coordinates: 40.7851, -73.9683')).toBeInTheDocument();
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
    expect(alertMock).toHaveBeenCalledWith("User location is not available.");

    alertMock.mockRestore(); // Restore original implementation of alert
  });
});
