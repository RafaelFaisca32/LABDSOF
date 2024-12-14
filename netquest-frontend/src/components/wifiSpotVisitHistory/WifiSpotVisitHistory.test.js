import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter
import WifiSpotVisitHistory from "./WifiSpotVisitHistory";
import { wifiSpotVisitApi } from "../misc/WifiSpotVisitApi";
import { useAuth } from "../context/AuthContext";

// Mock dependencies
jest.mock("../misc/WifiSpotVisitApi");
jest.mock("../context/AuthContext");

describe("WifiSpotVisitHistory", () => {
  let mockUser, userLocation;

  beforeEach(() => {
    // Mock user and userLocation
    mockUser = { id: "user1", name: "John Doe" };
    userLocation = { lat: 40.7128, lng: -74.006 };

    // Mock useAuth hook
    useAuth.mockReturnValue({
      getUser: jest.fn().mockReturnValue(mockUser),
    });

    // Mock API response
    wifiSpotVisitApi.getMyVisits.mockResolvedValue({
      status: 200,
      data: [
        {
          id: 1,
          startDateTime: "2024-01-01T10:00:00",
          endDateTime: "2024-01-01T12:00:00",
          wifiSpotDto: {
            name: "Test Wifi Spot",
            address: { addressLine1: "123 Test Street" },
          },
        },
      ],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the component with a header", () => {
    const { getByText } = render(
        <MemoryRouter> {/* Wrap the component with MemoryRouter */}
          <WifiSpotVisitHistory userLocation={userLocation} />
        </MemoryRouter>
    );

    expect(getByText("Visited Locations History")).toBeInTheDocument();
  });

  test("fetches and displays visit data when Apply Filters is clicked", async () => {
    const { getByText, getByRole } = render(
        <MemoryRouter>
          <WifiSpotVisitHistory userLocation={userLocation} />
        </MemoryRouter>
    );

    // Mock API call for Apply Filters
    wifiSpotVisitApi.getMyVisits.mockResolvedValueOnce({
      status: 200,
      data: [
        {
          id: 1,
          startDateTime: "2024-01-01T10:00:00",
          endDateTime: "2024-01-01T12:00:00",
          wifiSpotDto: {
            name: "Test Wifi Spot",
            address: { addressLine1: "123 Test Street" },
          },
        },
      ],
    });

    // Simulate clicking the Apply Filters button
    fireEvent.click(getByRole("button", { name: /apply filters/i }));

    // Wait for the API call and the UI update
    await waitFor(() => {
      expect(wifiSpotVisitApi.getMyVisits).toHaveBeenCalledWith(mockUser, {
        wifiSpotName: null,
        startDate: null,
        endDate: null,
      });

      // Verify the visit data is displayed
      expect(getByText("Test Wifi Spot")).toBeInTheDocument();
      expect(getByText("123 Test Street")).toBeInTheDocument();
    });

  });

  test("opens the SpotDetailsModal when View Details button is clicked", async () => {
    const { getByText, getByRole } = render(
        <MemoryRouter>
          <WifiSpotVisitHistory userLocation={userLocation} />
        </MemoryRouter>
    );

    // Mock API call for Apply Filters
    wifiSpotVisitApi.getMyVisits.mockResolvedValueOnce({
      status: 200,
      data: [
        {
          id: 1,
          startDateTime: "2024-01-01T10:00:00",
          endDateTime: "2024-01-01T12:00:00",
          wifiSpotDto: {
            name: "Test Wifi Spot",
            address: { addressLine1: "123 Test Street" },
          },
        },
      ],
    });

    // Simulate clicking the Apply Filters button
    fireEvent.click(getByRole("button", { name: /apply filters/i }));

    // Wait for the API call and table data to load
    await waitFor(async () => {
      expect(wifiSpotVisitApi.getMyVisits).toHaveBeenCalledWith(mockUser, {
        wifiSpotName: null,
        startDate: null,
        endDate: null,
      });
      fireEvent.click(getByRole("button", {name: /view details/i}));

    });


    await waitFor(() => {
      expect(getByText("Spot Details")).toBeInTheDocument();
    });
  });
});
