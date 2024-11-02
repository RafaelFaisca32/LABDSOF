import React from 'react';
import { Modal, Form, Button } from 'semantic-ui-react';

function AddSpotModal({ open, onClose, onSave, spotDetails, setSpotDetails }) {
  const handleInputChange = (e, { name, value }) => {
    setSpotDetails((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <Modal open={open} onClose={onClose} size="small">
      <Modal.Header>Add a New Spot</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Input
            label="Spot Name"
            name="name"
            value={spotDetails.name}
            onChange={handleInputChange}
            placeholder="Enter spot name"
          />
          <Form.Input
            label="Spot Size"
            name="size"
            value={spotDetails.size}
            onChange={handleInputChange}
            placeholder="Enter spot size"
          />
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>Cancel</Button>
        <Button primary onClick={onSave}>
          Add Spot
        </Button>
      </Modal.Actions>
    </Modal>
  );
}

export default AddSpotModal;
