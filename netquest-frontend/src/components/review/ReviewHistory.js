import React, { useState } from "react";
import {
    Box,
    Button,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    TextField,
    Paper,
} from "@mui/material";
import { useAuth } from "../context/AuthContext";
import { reviewApi } from "../misc/ReviewApi";
import { errorNotification, formatDateTime } from "../misc/Helpers";
import SpotDetailsModal from "../wifiMapPage/SpotDetailsModal";
import {  Header } from 'semantic-ui-react';

const ReviewHistory = ({ userLocation }) => {
    const Auth = useAuth();
    const user = Auth.getUser();

    const [reviewData, setReviewData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [filters, setFilters] = useState({ wifiSpotName: "", startDate: "", endDate: "" });
    const [rowCount, setRowCount] = useState(0);
    const [open, setOpen] = useState(false);
    const [selectedSpot, setSelectedSpot] = useState(null);

    // Fetch data from API
    const fetchReviewData = async () => {
        setLoading(true);
        try {
            const response = await reviewApi.getMyReviews(user, {
                wifiSpotName: filters.wifiSpotName || null,
                startDate: filters.startDate ? `${filters.startDate}T00:00:00` : null,
                endDate: filters.endDate ? `${filters.endDate}T23:59:59` : null,
            });
            if (response.status === 200) {
                const content = response.data;
                const transformedRows = content.map((item) => ({
                    reviewId: item.reviewId,
                    reviewCreateDateTime: formatDateTime(item.reviewCreateDateTime),
                    reviewComment: item.reviewComment,
                    reviewOverallClassification: item.reviewOverallClassification,
                    reviewAttributeClassificationDtoList: item.reviewAttributeClassificationDtoList,
                    wifiSpotDto: item.wifiSpotDto,
                }));
                setRowCount(content.length);
                setReviewData(transformedRows);
            }
        } catch (err) {
            errorNotification(err.response?.data?.message || "Error fetching reviews");
        } finally {
            setLoading(false);
        }
    };

    // Pagination controls
    const handlePageChange = (event, newPage) => {
        setPage(newPage);
        fetchReviewData();
    };

    const handleRowsPerPageChange = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
        fetchReviewData();
    };

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const handleOpenModal = (spot) => {
        setSelectedSpot(spot); // Set the selected spot
        setOpen(true); // Open the modal
    };

    const handleCloseModal = () => {
        setSelectedSpot(null); // Clear the selected spot
        setOpen(false); // Close the modal
    };

    return (
        <Box sx={{ padding: 2 }}>
            <Header as="h2" color="blue" textAlign="center">
                  Reviews History
            </Header>
            {/* Filters */}
            <Box display="flex" gap={2} mb={2}>
                <TextField
                    label="Filter by Wifi Spot Name"
                    value={filters.wifiSpotName}
                    onChange={(e) => handleFilterChange("wifiSpotName", e.target.value)}
                    variant="outlined"
                />
                <TextField
                    label="Start Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange("startDate", e.target.value)}
                />
                <TextField
                    label="End Date"
                    type="date"
                    InputLabelProps={{ shrink: true }}
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange("endDate", e.target.value)}
                />
                <Button variant="contained" onClick={fetchReviewData}>
                    Apply Filters
                </Button>
            </Box>

            {/* Table */}
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                    <CircularProgress />
                </Box>
            ) : (
                <Paper>
                    <TableContainer>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Comment</TableCell>
                                    <TableCell>Overall Classification</TableCell>
                                    <TableCell>Attribute Classifications</TableCell>
                                    <TableCell>Wifi Spot Name</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {reviewData
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((row) => (
                                        <TableRow key={row.reviewId}>
                                            <TableCell>{row.reviewCreateDateTime}</TableCell>
                                            <TableCell>{row.reviewComment}</TableCell>
                                            <TableCell>{row.reviewOverallClassification}</TableCell>
                                            <TableCell>
                                                {row.reviewAttributeClassificationDtoList.map(
                                                    (attr, index) => (
                                                        <div key={index}>
                                                            {attr.name}: {attr.value}
                                                        </div>
                                                    )
                                                )}
                                            </TableCell>
                                            <TableCell>{row.wifiSpotDto.name}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    onClick={() => handleOpenModal(row.wifiSpotDto)}
                                                >
                                                    View Details
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TablePagination
                        component="div"
                        count={rowCount}
                        page={page}
                        onPageChange={handlePageChange}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleRowsPerPageChange}
                    />
                </Paper>
            )}

            {selectedSpot && (
                <SpotDetailsModal
                    userLocation={userLocation}
                    spot={selectedSpot}
                    onClose={handleCloseModal}
                    justDetails={true}
                />
            )}
        </Box>
    );
};

export default ReviewHistory;
