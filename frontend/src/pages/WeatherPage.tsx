import { useState } from "react";
import Forecast from "../components/weather/Forecast";
import LocationModal from "../components/weather/LocationModal";
import { Button } from "react-bootstrap";

const WeatherPage = () => {
  const [visible, setVisible] = useState(false);

  const onSubmit = () => {
    setVisible(false);
  };

  const onCancel = () => {
    setVisible(false);
  };

  const onButtonClick = () => {
    console.log("showing modal");
    setVisible(true);
  };

  return (
    <div className="page-container">
      <div>
        <h1 className="text-center">Weather Forecast</h1>
        <p className="text-center">
          Want to see a forecast and get frost alerts? Press the button below!
        </p>
      </div>
      <div className="d-flex justify-content-center mt-3 mb-3">
        <Button variant="primary" onClick={onButtonClick}>
          Set Location
        </Button>
      </div>
      <LocationModal
        visible={visible}
        onCancel={onCancel}
        onSubmit={onSubmit}
      />
      <Forecast />
    </div>
  );
};

export default WeatherPage;
