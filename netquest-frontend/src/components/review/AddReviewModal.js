import React, {useEffect, useState} from "react";
import { Button, Modal, Form, Segment, Header } from "semantic-ui-react";
import {errorNotification, successNotification} from "../misc/Helpers";
import {reviewApi} from "../misc/ReviewApi";

function AddReviewModal({ spot, open, onClose,user }) {
    const initialReviewDetails = {
        reviewComment: "",
        reviewOverallClassification: 0,
        reviewAttributeClassificationDtoList: [],
        wifiSpotId: spot.uuid
    };

    const [reviewDetails, setReviewDetails] = useState(initialReviewDetails);
    useEffect(() => {
        if (open) {
            setReviewDetails(initialReviewDetails);
        }
    }, [open]);
    const handleInputChange = (e, { name, value }) => {
        setReviewDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleAttributeChange = (index, field, value) => {
        const updatedAttributes = [...reviewDetails.reviewAttributeClassificationDtoList];
        updatedAttributes[index] = { ...updatedAttributes[index], [field]: value };
        setReviewDetails((prev) => ({
            ...prev,
            reviewAttributeClassificationDtoList: updatedAttributes,
        }));
    };

    const addAttributeField = () => {
        setReviewDetails((prev) => ({
            ...prev,
            reviewAttributeClassificationDtoList: [
                ...prev.reviewAttributeClassificationDtoList,
                { name: "", value: "" },
            ],
        }));
    };

    const removeAttributeField = (index) => {
        const updatedAttributes = reviewDetails.reviewAttributeClassificationDtoList.filter(
            (_, idx) => idx !== index
        );
        setReviewDetails((prev) => ({
            ...prev,
            reviewAttributeClassificationDtoList: updatedAttributes,
        }));
    };

    const onSave = async () => {

        try {
            const response = await reviewApi.createReview(user,reviewDetails);
            if (response && response.status === 201) {
                onClose(); // Close the modal
                successNotification("Review posted successfully.");
            }
        } catch (err) {
            errorNotification(err.response?.data?.message || "Error posting review");
        }
    };

    const isMandatoryFilled = () => {
        return (
            reviewDetails.reviewOverallClassification >= 0 &&
            reviewDetails.reviewOverallClassification <= 5 &&
            (
                reviewDetails.reviewAttributeClassificationDtoList.length === 0 ||
                reviewDetails.reviewAttributeClassificationDtoList.every(
                    (attr) => attr.name.trim() !== "" && attr.value.trim() !== ""
                )
            )
        );

    };

    return (
        <Modal open={open} onClose={onClose} size="large">
            <Modal.Header>Make a Review for Wifi Spot - {spot.name}</Modal.Header>
            <Modal.Content scrolling style={{ maxHeight: "70vh", overflowY: "auto" }}>
                <Form>
                    <Segment>
                        <Header as="h4">Review Information</Header>
                        <Form.Group >
                            <Form.TextArea
                                label="Review Comment"
                                name="reviewComment"
                                value={reviewDetails.reviewComment}
                                onChange={handleInputChange}
                                placeholder="Enter your review comment"
                                width={12}
                            />
                            <Form.Input
                                label="Overall Classification (0-5)"
                                name="reviewOverallClassification"
                                type="number"
                                min="0"
                                max="5"
                                value={reviewDetails.reviewOverallClassification}
                                onChange={handleInputChange}
                                placeholder="Rate overall experience"
                                required
                                width={4}
                            />
                        </Form.Group>
                    </Segment>

                    <Segment>
                        <Header as="h4">Attribute Classifications</Header>
                        {reviewDetails.reviewAttributeClassificationDtoList.map((attribute, index) => (
                            <Form.Group key={index} widths="equal">
                                <Form.Input
                                    label="Attribute Name"
                                    placeholder="Enter attribute name"
                                    value={attribute.name}
                                    onChange={(e) =>
                                        handleAttributeChange(index, "name", e.target.value)
                                    }
                                    required
                                />
                                <Form.Input
                                    label="Value (Qualitative or Quantitative)"
                                    placeholder="Enter value"
                                    value={attribute.value}
                                    onChange={(e) =>
                                        handleAttributeChange(index, "value", e.target.value)
                                    }
                                    required
                                />
                                <Button
                                    icon="trash"
                                    color="red"
                                    onClick={() => removeAttributeField(index)}
                                    style={{ marginTop: "1.8em" }}
                                />
                            </Form.Group>
                        ))}
                        <Button primary onClick={addAttributeField} type="button">
                            Add Attribute
                        </Button>
                    </Segment>
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    primary
                    onClick={onSave}
                    disabled={!isMandatoryFilled()}
                >
                    Post
                </Button>
            </Modal.Actions>
        </Modal>
    );
}

export default AddReviewModal;
