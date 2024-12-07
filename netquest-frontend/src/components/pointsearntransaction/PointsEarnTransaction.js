import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, CircularProgress } from "@mui/material";
import {useAuth} from "../context/AuthContext";
import {pointsEarnTransactionApi} from "../misc/PointsEarnTransactionApi";
import {errorNotification} from "../misc/Helpers";

const PointsEarnTransaction = () => {
    const Auth = useAuth();
    const user = Auth.getUser();
    const [pointsData, setPointsData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [pageSize, setPageSize] = useState(5);
    const [rowCount, setRowCount] = useState(0);
    const [totalPoints, setTotalPoints] = useState(null);


    const fetchPoints = async (page, pageSize) => {
        setLoading(true);
        try {
            const response = await pointsEarnTransactionApi.getMyPoints(user,page, pageSize);
            if(response.status === 200) {
                //console.log(response);
                const { content, totalElements } = response.data;
                const transformedRows = content.map( function(item) {

                    let reason = "Unknown Reason";
                    let dateString = "";
                    if(!!item.wifiSpot){
                        //dateString = item.wifiSpot.dateTimeCreated
                        reason = "Created Wifi Spot " + item.wifiSpot.name + ", Location: " + item.wifiSpot.latitude + ", " + item.wifiSpot.longitude;
                    }

                    if(!!item.wifiSpotVisit){


                        const formatedVisitStartDateTime = new Intl.DateTimeFormat('pt-PT', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                        }).format(new Date(item.wifiSpotVisit.startDateTime));

                        const formatedVisitEndDateTime = new Intl.DateTimeFormat('pt-PT', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit',
                            second: '2-digit',
                        }).format(new Date(item.wifiSpotVisit.endDateTime));

                        reason = "Visited Wifi Spot " + item.wifiSpotVisit.wifiSpot.name + ", Location: " + item.wifiSpotVisit.wifiSpot.latitude + ", " + item.wifiSpotVisit.wifiSpot.longitude;
                        dateString = " ["+ formatedVisitStartDateTime +" - "+ formatedVisitEndDateTime +"]";
                    }

                    const formatedDateTime = new Intl.DateTimeFormat('pt-PT', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    }).format(new Date(item.dateTime));


                    return {
                        id: item.id,
                        dateTime: formatedDateTime,
                        points: item.amount,
                        reason: reason,
                        dateString: dateString
                    }
                });

                setPointsData(transformedRows);
                setRowCount(totalElements);
            }
        } catch(ex) {
            errorNotification("Error fetching earned points.");
        } finally {
            setLoading(false);
        }

    };


    useEffect(() => {
        const controller = new AbortController();
        const fetchTotalPoints = async () => {
            try {
                const response = await pointsEarnTransactionApi.getMyTotalPoints(user);
                if(response.status === 200) {
                    //console.log(response);
                    setTotalPoints(response.data);
                }
            } catch (ex){
                errorNotification("Error fetching total earned points.");
            }
        }
        fetchTotalPoints();
        return () => controller.abort();
        // eslint-disable-next-line
    },[])

    // Fetch points when page or pageSize changes
    useEffect(() => {
        fetchPoints(page, pageSize);
        // eslint-disable-next-line
    }, [page, pageSize]);

    // Columns definition for DataGrid
    const columns = [
        { field: "dateTime", headerName: "Date Time", flex: 1 },
        { field: "points", headerName: "Points", flex: 1 },
        { field: "reason", headerName: "Reason", flex: 3 },
        { field: "dateString", headerName: "Date Action", flex: 1 },
    ];

    return (
        <Box sx={{ height: "auto", width: "100%", padding: 2 }}>
            <Typography variant="h4" gutterBottom>
                My Points {totalPoints != null && `- ${totalPoints}`}
            </Typography>
            {totalPoints === 0 && (
                <Typography
                    variant="h5"
                    style={{ color: "black", fontStyle: "italic", marginTop: "8px" }}
                >
                    Start earning points by creating, visiting, or reviewing a spot!
                </Typography>
            )}
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
                    rowsPerPageOptions={[5, 10, 20]} // Options for rows per page
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

export default PointsEarnTransaction;
