import React, { useState, useEffect } from "react";
import { wifiSpotApi } from "../misc/WifiSpotApi";
import { useAuth } from "../context/AuthContext";
import "../../index.css";
import EditSpotModal from "../wifiMapPage/AddSpotModal"; // Import the modal component

function WifispotsCreated() {
  const { getUser } = useAuth();
  const user = getUser();

  const [wifiSpots, setWifiSpots] = useState([]);
  const [filteredWifiSpots, setFilteredWifiSpots] = useState([]);
  const [filters, setFilters] = useState({
    wifiQuality: "",
    environmentalFeatures: "",
    locationType: "",
  });

  const [editModalOpen, setEditModalOpen] = useState(false);
  const [spotDetails, setSpotDetails] = useState({ coordinates: { lat: "", lng: "" } });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await wifiSpotApi.fetchWifiSpotsByUser(user);
        const data = Array.isArray(response.data) ? response.data : [];
        console.log(data);
        setWifiSpots(data);
        setFilteredWifiSpots(data);
      } catch (error) {
        console.error("Failed to fetch Wi-Fi spots:", error);
      }
    };
    fetchData();
  }, []);

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

  const handleEditClick = (spot) => {
    setSpotDetails({
      ...spot,
      name: spot.name || "",
      description: spot.description || "",
      locationType: spot.locationType || "",
      wifiQuality: spot.wifiQuality || "",
      signalStrength: spot.signalStrength || "",
      bandwidth: spot.bandwidth || "",
      addressLine1: spot.address?.addressLine1 || "",
      city: spot.address?.city || "",
      district: spot.address?.district || "",
      country: spot.address?.country || "",
      zipCode: spot.address?.zipCode || "",
      coordinates: { lat: spot.latitude, lng: spot.longitude },
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async () => {
    try {
      await wifiSpotApi.updateWifiSpot(spotDetails.uuid, spotDetails,user);
      setEditModalOpen(false);

      // Refresh spots
      const response = await wifiSpotApi.fetchWifiSpotsByUser(user);
      const data = Array.isArray(response.data) ? response.data : [];
      setWifiSpots(data);
    } catch (error) {
      console.error("Failed to save changes:", error);
    }
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
                <p>
                  <strong>Address:</strong> {spot.address?.addressLine1}, {spot.city}
                </p>
                <p>
                  <strong>Wi-Fi Quality:</strong> {spot.wifiQuality}
                </p>
                <p>
                  <strong>Location Type:</strong> {spot.locationType}
                </p>
                <button onClick={() => handleEditClick(spot)} className="edit-button">
                  Edit
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p>No Wi-Fi spots match the selected filters.</p>
        )}
      </div>

      {/* Edit Modal */}
      <EditSpotModal
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        onSave={handleSaveEdit}
        spotDetails={spotDetails}
        setSpotDetails={setSpotDetails}
        isEditing={true} // Pass true to indicate this is for editing
      />
    </div>
  );
}

export default WifispotsCreated;
