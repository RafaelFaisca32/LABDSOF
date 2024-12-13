import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom"; // Import MemoryRouter
import ReviewHistory from "./ReviewHistory";
import { reviewApi } from "../misc/ReviewApi";
import { useAuth } from "../context/AuthContext";

// Mock dependencies
jest.mock("../misc/ReviewApi");
jest.mock("../context/AuthContext");

describe("ReviewHistory", () => {
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
    reviewApi.getMyReviews.mockResolvedValue({
      status: 200,
      data: [
        {
          reviewId: "123e4567-e89b-12d3-a456-426614174000",
          reviewCreateDateTime: "2024-01-01T10:00:00",
          reviewComment: "Great spot for remote work.",
          reviewOverallClassification: 5,
          reviewAttributeClassificationDtoList: [
            { name: "WiFi Quality", value: 5 },
            { name: "Environment", value: 4 },
          ],
          wifiSpotDto: {
            name: "Test Wifi Spot",
          },
          userId: "user1",
        },
      ],
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders the component with a header", () => {
    const { getByText } = render(
        <MemoryRouter>
          <ReviewHistory userLocation={userLocation} />
        </MemoryRouter>
    );

    expect(getByText("Reviews History")).toBeInTheDocument();
  });

  test("fetches and displays review data when Apply Filters is clicked", async () => {
    const { getByText, getByRole } = render(
        <MemoryRouter>
          <ReviewHistory userLocation={userLocation} />
        </MemoryRouter>
    );

    // Mock API call for Apply Filters
    reviewApi.getMyReviews.mockResolvedValueOnce({
      status: 200,
      data: [
        {
          reviewId: "123e4567-e89b-12d3-a456-426614174000",
          reviewCreateDateTime: "2024-01-01T10:00:00",
          reviewComment: "Great spot for remote work.",
          reviewOverallClassification: 5,
          reviewAttributeClassificationDtoList: [
            { name: "WiFi Quality", value: 5 },
            { name: "Environment", value: 4 },
          ],
          wifiSpotDto: {
            name: "Test Wifi Spot",
          },
          userId: "user1",
        },
      ],
    });

    // Simulate clicking the Apply Filters button
    fireEvent.click(getByRole("button", { name: /apply filters/i }));

    // Wait for the API call and the UI update
    await waitFor(() => {
      expect(reviewApi.getMyReviews).toHaveBeenCalledWith(mockUser, {
        wifiSpotName: null,
        startDate: null,
        endDate: null,
      });

      expect(getByText("Test Wifi Spot")).toBeInTheDocument();
      expect(getByText("Great spot for remote work.")).toBeInTheDocument();
      expect(getByText("WiFi Quality: 5")).toBeInTheDocument();
      expect(getByText("Environment: 4")).toBeInTheDocument();
    });
  });
});
