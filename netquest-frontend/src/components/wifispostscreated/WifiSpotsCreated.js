import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { wifiSpotApi } from "../misc/WifiSpotApi";
import { useAuth } from "../context/AuthContext";
import "../../index.css";

function WifispotsCreated() {
  const navigate = useNavigate();
  const { getUser } = useAuth();
  const user = getUser();

  const [wifiSpots, setWifiSpots] = useState([]);
  const [filteredWifiSpots, setFilteredWifiSpots] = useState([]);
  const [filters, setFilters] = useState({
    wifiQuality: "",
    environmentalFeatures: "",
    locationType: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await wifiSpotApi.fetchWifiSpotsByUser(user);
        console.log("API response:", response); // Ensure we are getting correct data
        const data = Array.isArray(response.data) ? response.data : [];
        setWifiSpots(data);
        setFilteredWifiSpots(data);
      } catch (error) {
        console.error("Failed to fetch Wi-Fi spots:", error);
      }
    };

    fetchData();
  }, []); // Fetches only once when the component mounts

  // Filter handler
  useEffect(() => {
    let filtered = [...wifiSpots];

    if (filters.wifiQuality) {
      filtered = filtered.filter((spot) => spot.wifiQuality === filters.wifiQuality);
    }

    if (filters.environmentalFeatures) {
      filtered = filtered.filter(
        (spot) =>
          spot.environmentalFeatures &&
          spot.environmentalFeatures.includes(filters.environmentalFeatures)
      );
    }

    if (filters.locationType) {
      filtered = filtered.filter((spot) => spot.locationType === filters.locationType);
    }

    setFilteredWifiSpots(filtered);
  }, [filters, wifiSpots]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container">
      <h1 className="header">Your Created Wi-Fi Spots</h1>

      {/* Filter Section */}
      <div className="filter-section">
        <h2 className="filter-title">Filters</h2>
        <div className="filter-group">
          <div>
            <label className="filter-label">Wi-Fi Quality:</label>
            <select
              name="wifiQuality"
              value={filters.wifiQuality}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All</option>
              <option value="HIGH">High</option>
              <option value="MEDIUM">Medium</option>
              <option value="LOW">Low</option>
            </select>
          </div>
          <div>
            <label className="filter-label">Location Type:</label>
            <select
              name="locationType"
              value={filters.locationType}
              onChange={handleFilterChange}
              className="filter-select"
            >
              <option value="">All</option>
              <option value="PUBLIC">Public</option>
              <option value="CAFE">Cafe</option>
              <option value="LIBRARY">Library</option>
              <option value="PARK">Park</option>
              <option value="SCHOOL">School</option>
              <option value="RESTAURANT">Restaurant</option>
            </select>
          </div>
        </div>
      </div>

      {/* Wi-Fi Spots List */}
      <div className="wifi-spots-list">
        <h2 className="wifi-spots-title">Wi-Fi Spots</h2>
        {filteredWifiSpots.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            {filteredWifiSpots.map((spot) => (
              <div className="wifi-spot" key={spot.uuid}>
                <h3 className="wifi-spot-title">{spot.name}</h3>
                <p className="wifi-spot-info">
                  <strong>Address:</strong> {spot.address?.addressLine1}, {spot.address?.city},{" "}
                  {spot.address?.district}
                </p>
                <p className="wifi-spot-info">
                  <strong>Wi-Fi Quality:</strong> {spot.wifiQuality}
                </p>
                <p className="wifi-spot-info">
                  <strong>Location Type:</strong> {spot.locationType}
                </p>
                <div className="environmental-features">
                  <strong>Environmental Features:</strong>
                  {spot.environmentalFeatures && spot.environmentalFeatures.length > 0 ? (
                    <div>
                      {spot.environmentalFeatures.map((feature, index) => (
                        <span className="feature-badge" key={index}>
                          {feature}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="no-data"> None</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No Wi-Fi spots match the selected filters.</p>
        )}
      </div>
    </div>
  );
}

export default WifispotsCreated;
