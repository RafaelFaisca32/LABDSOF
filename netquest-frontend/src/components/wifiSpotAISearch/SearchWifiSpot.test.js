import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import SearchWifiSpots from "./SearchWifiSpots";
import { wifiSpotApi } from "../misc/WifiSpotApi";
import { errorNotification, warningNotification } from "../misc/Helpers";
import { useAuth } from "../context/AuthContext";

jest.mock("../misc/WifiSpotApi");
jest.mock("../misc/Helpers");
jest.mock("../context/AuthContext");

describe("SearchWifiSpots Component", () => {
  const mockHandleApplyFilters = jest.fn();
  const mockClearFilters = jest.fn();
  const mockAuth = {
    getUser: jest.fn(() => ({ id: "test-user", name: "Test User" })),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue(mockAuth);
  });

  it("renders input and buttons", () => {
    render(
      <SearchWifiSpots
        handleApplyFilters={mockHandleApplyFilters}
        clearFilters={mockClearFilters}
      />
    );

    expect(screen.getByPlaceholderText(/Search WiFi spots/i)).toBeInTheDocument();
    expect(screen.getByText(/Search/i)).toBeInTheDocument();
    expect(screen.getByText(/Clear/i)).toBeInTheDocument();
  });


  it("shows warning notification when no results are found", async () => {
    wifiSpotApi.getWifiSpotsIA.mockResolvedValue({ status: 200, data: [] });

    render(
      <SearchWifiSpots
        handleApplyFilters={mockHandleApplyFilters}
        clearFilters={mockClearFilters}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/Search WiFi spots/i), { target: { value: "no results" } });
    fireEvent.click(screen.getByText(/Search/i));

    await waitFor(() => {
      expect(warningNotification).toHaveBeenCalledWith("No Wi-fi spots apply to that request");
      expect(mockHandleApplyFilters).toHaveBeenCalledWith([]);
    });
  });

  it("displays error notification on API error", async () => {
    wifiSpotApi.getWifiSpotsIA.mockRejectedValue({
      response: { data: { message: "Error fetching spots" } },
    });

    render(
      <SearchWifiSpots
        handleApplyFilters={mockHandleApplyFilters}
        clearFilters={mockClearFilters}
      />
    );

    fireEvent.change(screen.getByPlaceholderText(/Search WiFi spots/i), { target: { value: "error test" } });
    fireEvent.click(screen.getByText(/Search/i));

    await waitFor(() => {
      expect(errorNotification).toHaveBeenCalledWith("Error fetching spots");
    });
  });

  it("clears the search term and filters when Clear is clicked", () => {
    render(
      <SearchWifiSpots
        handleApplyFilters={mockHandleApplyFilters}
        clearFilters={mockClearFilters}
      />
    );

    const input = screen.getByPlaceholderText(/Search WiFi spots/i);
    fireEvent.change(input, { target: { value: "test" } });

    fireEvent.click(screen.getByText(/Clear/i));
    expect(input.value).toBe("");
    expect(mockClearFilters).toHaveBeenCalled();
  });

});
