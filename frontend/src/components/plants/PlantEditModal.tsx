import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { Plant } from "../../models/plant";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

interface PlantEditModalProps {
  show: boolean;
  onHide: () => void;
  onSave: (plant: Plant) => void;
  plant?: Plant;
}

const PlantEditModal: React.FC<PlantEditModalProps> = ({
  show,
  onHide,
  onSave,
  plant,
}) => {
  const user = useSelector((state: RootState) => state.user);
  const [formData, setFormData] = useState<Plant>({
    id: 0,
    user: Number(user.id),
    name: "",
    species: "",
    created_: undefined,
    updated_: undefined,
  });

  useEffect(() => {
    if (plant) {
      setFormData(plant);
    } else {
      setFormData({
        id: 0,
        user: Number(user.id),
        name: "",
        species: "",
        created_: undefined,
        updated_: undefined,
      });
    }
  }, [plant, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = () => {
    onSave(formData);
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{plant ? "Edit Plant" : "Add New Plant"}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formPlantName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter plant name"
            />
          </Form.Group>
          <Form.Group controlId="formPlantSpecies">
            <Form.Label>Species</Form.Label>
            <Form.Control
              type="text"
              name="species"
              value={formData.species}
              onChange={handleChange}
              placeholder="Enter plant species"
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PlantEditModal;
