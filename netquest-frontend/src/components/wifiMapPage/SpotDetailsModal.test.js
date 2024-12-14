import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react';
import SpotDetailsModal from './SpotDetailsModal';
import { useAuth } from '../context/AuthContext';
import { reviewApi } from '../misc/ReviewApi';

// Mock the useAuth hook to return a mock user
jest.mock('../context/AuthContext', () => ({
  useAuth: jest.fn(),
}));

// Mock the Review API
jest.mock('../misc/ReviewApi');

describe('SpotDetailsModal', () => {
  let userLocation, spot, onClose, mockReviews;

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

    // Mock reviews
    mockReviews = [
      {
        reviewId: 'review1',
        username: 'User1',
        reviewCreateDateTime: '2024-01-01T12:00:00',
        reviewOverallClassification: 5,
        reviewComment: 'Great place!',
        reviewAttributeClassificationDtoList: [
          { name: 'Cleanliness', value: '5' },
          { name: 'Comfort', value: '4' },
        ],
      },
      {
        reviewId: 'review2',
        username: 'User2',
        reviewCreateDateTime: '2024-01-02T14:00:00',
        reviewOverallClassification: 3,
        reviewComment: 'Average experience.',
        reviewAttributeClassificationDtoList: [
          { name: 'Cleanliness', value: '3' },
          { name: 'Comfort', value: '3' },
        ],
      },
    ];
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

  // New Test Cases
  test('displays reviews in the "Reviews" section', async () => {
    reviewApi.getReviewsOfWifiSpot.mockResolvedValueOnce({
      status: 200,
      data: mockReviews,
    });

    const { getByText } = render(
        <SpotDetailsModal userLocation={userLocation} spot={spot} onClose={onClose} />
    );

    await waitFor(() => {
      expect(getByText('User1')).toBeInTheDocument();
      expect(getByText('User2')).toBeInTheDocument();
    });
  });

  test('displays "No reviews available" when there are no reviews', async () => {
    reviewApi.getReviewsOfWifiSpot.mockResolvedValueOnce({
      status: 200,
      data: [],
    });

    const { getByText } = render(
        <SpotDetailsModal userLocation={userLocation} spot={spot} onClose={onClose} />
    );

    await waitFor(() => {
      expect(getByText('No reviews available for this Wi-Fi location.')).toBeInTheDocument();
    });
  });

  test('filters reviews by highest rating', async () => {
    reviewApi.getReviewsOfWifiSpot.mockResolvedValueOnce({
      status: 200,
      data: mockReviews,
    });

    const { getByText, getByRole } = render(
        <SpotDetailsModal userLocation={userLocation} spot={spot} onClose={onClose} />
    );

    await waitFor(() => {
      fireEvent.click(getByRole('option', { name: /Highest Rating/i }));
    });
  });

  test('filters reviews by most recent', async () => {
    reviewApi.getReviewsOfWifiSpot.mockResolvedValueOnce({
      status: 200,
      data: mockReviews,
    });

    const { getByText, getByRole } = render(
        <SpotDetailsModal userLocation={userLocation} spot={spot} onClose={onClose} />
    );

    await waitFor(() => {
      fireEvent.click(getByRole('option', { name: /Most Recent/i }));
    });
  });
});
