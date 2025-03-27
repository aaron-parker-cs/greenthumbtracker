import { useSelector } from "react-redux";
import { Accordion, Card, Button } from "react-bootstrap";
import { Plant } from "../models/plant";
import { GrowthRecord } from "../models/growth";
import { WaterRecord } from "../models/water";
import "../styles/recordsPage.scss";

const RecordsPage = () => {
  const selectedPlant = useSelector(
    (state: { plant: { selectedPlant: Plant } }) => state.plant.selectedPlant
  );

  // Dummy data for demonstration purposes
  // Replace with real fetched records once records are refactored
  const today = new Date(Date.now());
  const growthRecords: GrowthRecord[] = [
    { id: 1, date: new Date("2025-03-15"), height: 15, plant: 5, uom: 1, created_: today, updated_: today },
    { id: 2, date: new Date("2025-03-15"), height: 18, plant: 5, uom: 1, created_: today, updated_: today },
  ];

  const waterRecords: WaterRecord[] = [
    { id: 1, date: new Date("2025-03-15"), amount: 24, plant: 5, uom: 3, created_: today, updated_: today },
    { id: 2, date: new Date("2025-03-15"), amount: 31, plant: 5, uom: 3, created_: today, updated_: today },
  ];

  return (
    <div className="page-container">
      <div className="d-flex w-100 mt-3">
        <h1 className="center-heading">
          {selectedPlant ? `${selectedPlant.name} Records` : "No Plant Selected"}
        </h1>
      </div>

      {selectedPlant ? (
        <Accordion defaultActiveKey="0" className="mt-4">
          {/* Growth Records Dropdown */}
          <Accordion.Item eventKey="0">
            <Accordion.Header>Growth Records</Accordion.Header>
            <Accordion.Body>
              {growthRecords.length > 0 ? (
                <ul>
                  {growthRecords.map((record) => (
                    <li key={record.id}>
                      Date: {record.date.toLocaleDateString()}, Height: {record.height} cm
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No growth records available.</p>
              )}
            </Accordion.Body>
          </Accordion.Item>

          {/* Water Records Dropdown */}
          <Accordion.Item eventKey="1">
            <Accordion.Header>Water Records</Accordion.Header>
            <Accordion.Body>
              {waterRecords.length > 0 ? (
                <ul>
                  {waterRecords.map((record) => (
                    <li key={record.id}>
                      Date: {record.date.toLocaleDateString()}, Amount: {record.amount} ml
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No water records available.</p>
              )}
            </Accordion.Body>
          </Accordion.Item>

          {/* Add more dropdowns for other record types as needed */}
        </Accordion>
      ) : (
        <p className="text-center mt-4">Please select a plant to view records.</p>
      )}
    </div>
  );
};

export default RecordsPage;