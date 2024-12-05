import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, CircularProgress } from "@mui/material";
import {useAuth} from "../context/AuthContext";
import {pointsEarnTransactionApi} from "../misc/PointsEarnTransactionApi";
import {errorNotification} from "../misc/Helpers";

const Profile = () => {
    const Auth = useAuth();
    const user = Auth.getUser();
    const [pointsData, setPointsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [rowCount, setRowCount] = useState(0);

    // Mock API call to fetch points data
    const fetchPoints = async (page, pageSize) => {
        setLoading(true);



        /*
        const loadExistingWifiSpots = async () => {
      try {
        const response = await wifiSpotApi.getWifiSpots(user);
        if (response.status === 200) {
          const spotsList = response.data.map((spot) => ({
            ...spot,
            coordinates: { lat: spot.latitude, lng: spot.longitude },
          }));
          setWifiSpots(spotsList);
        }
      } catch (error) {
        errorNotification("Error fetching WiFi spots.");
      }
    };
         */

        try {
            const response = await pointsEarnTransactionApi.getMyPoints(user,page, pageSize);
            if(response.status === 200) {
                console.log(response);
            }
        } catch(ex) {
            errorNotification("Error fetching earned points.");
        } finally {
            setLoading(false);
        }

    };

    // Fetch points when page or pageSize changes
    useEffect(() => {
        fetchPoints(page, pageSize);
    }, [page, pageSize]);

    // Columns definition for DataGrid
    const columns = [
        { field: "id", headerName: "ID", width: 100 },
        { field: "points", headerName: "Points", width: 150 },
        { field: "date", headerName: "Date Earned", width: 200 },
    ];

    return (
        <Box sx={{ height: 400, width: "100%", padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                My Points
            </Typography>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                    <CircularProgress />
                </Box>
            ) : (
                <DataGrid
                    rows={pointsData}
                    columns={columns}
                    pagination
                    pageSize={pageSize}
                    rowsPerPageOptions={[5, 10, 20]}
                    paginationMode="server"
                    onPageChange={(newPage) => setPage(newPage)}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowCount={rowCount}
                    loading={loading}
                />
            )}
        </Box>
    );
};

export default Profile;
