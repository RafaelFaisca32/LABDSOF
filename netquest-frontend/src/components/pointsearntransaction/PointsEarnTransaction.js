import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Typography, CircularProgress } from "@mui/material";
import {useAuth} from "../context/AuthContext";
import {pointsEarnTransactionApi} from "../misc/PointsEarnTransactionApi";
import {errorNotification, formatDateTime} from "../misc/Helpers";
import {  Header } from 'semantic-ui-react';

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
                const { content, totalElements } = response.data;
                const transformedRows = content.map( function(item) {

                    let reason = "Unknown Reason";
                    let dateString = "";
                    if(!!item.wifiSpot){

                        if (!!item.wifiSpot.dateTimeCreated){
                            dateString = formatDateTime(item.wifiSpot.dateTimeCreated);
                        } else {
                            dateString = formatDateTime(item.dateTime);
                        }
                        reason = "Created Wifi Spot " + item.wifiSpot.name + ", Location: " + item.wifiSpot.latitude + ", " + item.wifiSpot.longitude;
                    }

                    if(!!item.wifiSpotVisit){


                        const formatedVisitStartDateTime = formatDateTime(item.wifiSpotVisit.startDateTime);
                        const formatedVisitEndDateTime = formatDateTime(item.wifiSpotVisit.endDateTime);

                        reason = "Visited Wifi Spot " + item.wifiSpotVisit.wifiSpot.name + ", Location: " + item.wifiSpotVisit.wifiSpot.latitude + ", " + item.wifiSpotVisit.wifiSpot.longitude;
                        dateString = " ["+ formatedVisitStartDateTime +" - "+ formatedVisitEndDateTime +"]";
                    }

                    if(!!item.wifiSpotVisitByOther){

                        const formatedVisitStartDateTime = formatDateTime(item.wifiSpotVisitByOther.startDateTime);
                        const formatedVisitEndDateTime = formatDateTime(item.wifiSpotVisitByOther.endDateTime);

                        reason = "User "+item.wifiSpotVisitByOther.user.username +" Visited YOUR Created Wifi Spot " + item.wifiSpotVisitByOther.wifiSpot.name + ", Location: " + item.wifiSpotVisitByOther.wifiSpot.latitude + ", " + item.wifiSpotVisitByOther.wifiSpot.longitude;
                        dateString = " ["+ formatedVisitStartDateTime +" - "+ formatedVisitEndDateTime +"]";
                    }

                    if(!!item.review){

                        reason = "Reviewed wifi spot " + item.review.wifiSpot.name+ " with classification "+item.review.reviewOverallClassification+"/5";
                        if(!!item.review.reviewComment){
                            reason += " with the comment \""+item.review.reviewComment+"\" ";
                        }

                        dateString = formatDateTime(item.review.reviewCreateDateTime);
                    }



                    const formatedDateTime = formatDateTime(item.dateTime);


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
            console.error(ex);
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
            <Header as="h2" color="blue" textAlign="center">
            My Points {totalPoints != null && `- ${totalPoints}`}
            </Header>
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
