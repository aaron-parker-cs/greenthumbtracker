import React, { useEffect, useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import { Input } from "@mui/material";
import { api } from "../../redux/api";
import { toast } from "react-toastify";

interface LocationModalProps {
  visible: boolean;
  onSubmit: (city: string) => void;
  onCancel: () => void;
}

const LocationModal: React.FC<LocationModalProps> = ({
  visible,
  onSubmit,
  onCancel,
}) => {
  const [city, setCity] = useState("");
  const [setLocation, { isLoading, error, isSuccess }] =
    api.useSetWeatherLocationMutation();

  useEffect(() => {
    if (error) {
      console.error("Error setting location:", error);
      toast.error("Error setting location. Please try again.");
    }
  }, [error]);

  useEffect(() => {
    if (isSuccess) {
      toast.success("Location set successfully.");
    }
  }, [isSuccess]);

  const handleCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  const handleSubmit = () => {
    onSubmit(city);
    setLocation({ city });
    setCity("");
  };

  const handleCancel = () => {
    onCancel();
    setCity("");
  };

  return (
    <Modal show={visible} onHide={handleCancel}>
      <Modal.Header closeButton>
        <Modal.Title>Enter Your City</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Input
          placeholder="Enter city name"
          value={city}
          onChange={handleCityChange}
        />
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          disabled={!city.trim()}
        >
          {isLoading && <Spinner animation="border" />} Submit
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default LocationModal;
