import { render, screen, fireEvent } from "@testing-library/react";
import { axe } from "jest-axe";
import WifispotsCreated from "./WifispotsCreated";
import { wifiSpotApi } from "../misc/WifiSpotApi";
import { useAuth } from "../context/AuthContext";

jest.mock("../misc/WifiSpotApi");
jest.mock("../context/AuthContext");

describe("WifispotsCreated Component", () => {
  beforeEach(() => {
    useAuth.mockReturnValue({ getUser: () => ({ id: "test-user" }) });
  });

  test("renders initial layout correctly", () => {
    render(<WifispotsCreated />);
    expect(screen.getByText(/Your Created Wi-Fi Spots/i)).toBeInTheDocument();
    expect(screen.getByText(/Filters/i)).toBeInTheDocument();
  });

  test("fetches Wi-Fi spots and displays them", async () => {
    wifiSpotApi.fetchWifiSpotsByUser.mockResolvedValueOnce({
      data: [
        { uuid: "1", name: "Spot A", wifiQuality: "HIGH", locationType: "CAFE", environmentalFeatures: [] },
        { uuid: "2", name: "Spot B", wifiQuality: "LOW", locationType: "PARK", environmentalFeatures: ["Outdoor"] },
      ],
    });

    render(<WifispotsCreated />);
    expect(await screen.findByText(/Spot A/i)).toBeInTheDocument();
    expect(await screen.findByText(/Spot B/i)).toBeInTheDocument();
  });

  test("filters Wi-Fi spots based on selected filters", async () => {
    wifiSpotApi.fetchWifiSpotsByUser.mockResolvedValueOnce({
      data: [
        { uuid: "1", name: "Spot A", wifiQuality: "HIGH", locationType: "CAFE", environmentalFeatures: [] },
        { uuid: "2", name: "Spot B", wifiQuality: "LOW", locationType: "PARK", environmentalFeatures: ["Outdoor"] },
      ],
    });

    render(<WifispotsCreated />);
    const wifiQualitySelect = screen.getByLabelText(/Wi-Fi Quality/i);

    fireEvent.change(wifiQualitySelect, { target: { value: "HIGH" } });

    expect(await screen.findByText(/Spot A/i)).toBeInTheDocument();
    expect(screen.queryByText(/Spot B/i)).not.toBeInTheDocument();
  });

  test("is accessible", async () => {
    const { container } = render(<WifispotsCreated />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
