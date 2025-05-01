import { useSelector } from "react-redux";
import { Accordion } from "react-bootstrap";
import { Plant } from "../models/plant";
import "../styles/recordsPage.scss";
import GrowthRecordTable from "../components/records/GrowthRecordTable";
import WaterRecordTable from "../components/records/WaterRecordTable";
import TemperatureRecordTable from "../components/records/TemperatureRecordTable";
import HumidityRecordTable from "../components/records/HumidityRecordTable";
import LightRecordTable from "../components/records/LightRecordTable";
import SoilMoistureRecordTable from "../components/records/SoilMoistureRecordTable";

const RecordsPage = () => {
  const selectedPlant = useSelector(
    (state: { plant: { selectedPlant: Plant } }) => state.plant.selectedPlant
  );

  // add other records once implemented
  // light record
  // soil moisture record
  // temperature record
  // humidity record

  return (
    <div className="page-container">
      <div className="d-flex w-100 mt-3">
        <h1 className="center-heading">
          {selectedPlant
            ? `${selectedPlant.name} Records`
            : "No Plant Selected"}
        </h1>
      </div>

      {selectedPlant ? (
        <Accordion defaultActiveKey="0" className="mt-4">
          {/* Growth Records Dropdown */}
          <Accordion.Item eventKey="0">
            <Accordion.Header>Growth Records</Accordion.Header>
            <Accordion.Body>
              <GrowthRecordTable/>
            </Accordion.Body>
          </Accordion.Item>

          {/* Water Records Dropdown */}
          
          <Accordion.Item eventKey="1">
            <Accordion.Header>Water Records</Accordion.Header>
            <Accordion.Body>
              <WaterRecordTable/>
            </Accordion.Body>
          </Accordion.Item>

          {/* Temperature Records Dropdown */}
          
          <Accordion.Item eventKey="2">
            <Accordion.Header>Temperature Records</Accordion.Header>
            <Accordion.Body>
              <TemperatureRecordTable/>
            </Accordion.Body>
          </Accordion.Item>

          {/* Humidity Records Dropdown */}
          
          <Accordion.Item eventKey="3">
            <Accordion.Header>Humidity Records</Accordion.Header>
            <Accordion.Body>
              <HumidityRecordTable/>
            </Accordion.Body>
          </Accordion.Item>

          {/* Light Records Dropdown */}
          
          <Accordion.Item eventKey="4">
            <Accordion.Header>Light Records</Accordion.Header>
            <Accordion.Body>
              <LightRecordTable/>
            </Accordion.Body>
          </Accordion.Item>

          {/* Soil Moisture Records Dropdown */}
          
          <Accordion.Item eventKey="5">
            <Accordion.Header>Soil Moisture Records</Accordion.Header>
            <Accordion.Body>
              <SoilMoistureRecordTable/>
            </Accordion.Body>
          </Accordion.Item>
          
        </Accordion>
      ) : (
        <p className="text-center mt-4">Please select a plant to view records.</p>
      )}
    </div>
  );
};

export default RecordsPage;
