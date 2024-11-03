import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AddSpotModal from './AddSpotModal'; // Adjust the import path as needed

describe('AddSpotModal', () => {
  let open, onClose, onSave, spotDetails, setSpotDetails;

  beforeEach(() => {
    open = true; // Set modal to be open
    onClose = jest.fn(); // Mock the onClose function
    onSave = jest.fn(); // Mock the onSave function
    spotDetails = { name: '', size: '' }; // Initial spot details
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
    expect(getByText('Spot Size')).toBeInTheDocument();
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
