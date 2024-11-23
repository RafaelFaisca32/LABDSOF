import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import WifiSpotFilter from "./WifiSpotFilter";
import { wifiSpotApi } from "../misc/WifiSpotApi";
import { errorNotification } from "../misc/Helpers";
import { useAuth } from "../context/AuthContext";

jest.mock("../misc/WifiSpotApi");
jest.mock("../misc/Helpers");
jest.mock("../context/AuthContext");

describe("WifiSpotFilter Component", () => {
  const mockOnApplyFilters = jest.fn();
  const mockAuth = {
    getUser: jest.fn(() => ({ id: "test-user" })),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAuth.mockReturnValue(mockAuth);
  });

  it("renders all sections and filters", () => {
    render(<WifiSpotFilter onApplyFilters={mockOnApplyFilters} />);

    expect(screen.getByText("Filter WiFi Spots")).toBeInTheDocument();
    expect(screen.getByText("Basic")).toBeInTheDocument();
    expect(screen.getByText("Advanced")).toBeInTheDocument();
    expect(screen.getByText("Facilities")).toBeInTheDocument();
    expect(screen.getByText("Weather Features")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Apply Filters" })).toBeInTheDocument();
  });

  it("handles API error gracefully", async () => {
    wifiSpotApi.getFilteredWifiSpots.mockRejectedValue(new Error("API error"));

    render(<WifiSpotFilter onApplyFilters={mockOnApplyFilters} />);

    const applyButton = screen.getByRole("button", { name: "Apply Filters" });
    fireEvent.click(applyButton);

    await waitFor(() => {
      expect(errorNotification).toHaveBeenCalledWith("Failed to fetch WiFi spots.");
    });
  });

  
});
