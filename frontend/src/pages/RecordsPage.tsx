import { useSelector } from "react-redux";
import { Accordion } from "react-bootstrap";
import { Plant } from "../models/plant";
import { api } from "../redux/api";
import "../styles/recordsPage.scss";
import GrowthRecordTable from "../components/records/GrowthRecordTable";

const RecordsPage = () => {
  const selectedPlant = useSelector(
    (state: { plant: { selectedPlant: Plant } }) => state.plant.selectedPlant
  );

  // use useEffect to update growthRecords when added. Make sure they are being added to database
  const { data: waterRecords } = api.useGetWaterRecordsQuery(selectedPlant?.id, { skip: !selectedPlant });
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
          {waterRecords && (
            <Accordion.Item eventKey="1">
              <Accordion.Header>Water Records</Accordion.Header>
              <Accordion.Body>
                {waterRecords.length > 0 ? (
                  <ul>
                    {waterRecords.map((record) => (
                      <li key={record.id}>
                        Date: {record.date.toLocaleDateString()}, Amount:{" "}
                        {record.amount} ml
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No water records available.</p>
                )}
              </Accordion.Body>
            </Accordion.Item>
          )}
        </Accordion>
      ) : (
        <p className="text-center mt-4">Please select a plant to view records.</p>
      )}
    </div>
  );
};

export default RecordsPage;
