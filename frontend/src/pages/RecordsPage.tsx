import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Accordion, Table } from "react-bootstrap";
import { Plant } from "../models/plant";
import { GrowthRecord } from "../models/growth";
import { api } from "../redux/api";
import * as GrowthRecordSlice from "../redux/records/growthRecord";
import "../styles/recordsPage.scss";

const RecordsPage = () => {
  const selectedPlant = useSelector(
    (state: { plant: { selectedPlant: Plant } }) => state.plant.selectedPlant
  );

  const { data: growthRecords } = api.useGetGrowthRecordsQuery(selectedPlant?.id, { skip: !selectedPlant });
  // use useEffect to update growthRecords when added. Make sure they are being added to database
  const { data: waterRecords } = api.useGetWaterRecordsQuery(selectedPlant?.id, { skip: !selectedPlant });
  // add other records once implemented
  // light record
  // soil moisture record
  // temperature record
  // humidity record

  const dispatch = useDispatch();

  const [isAddingGrowthRecord, setIsAddingGrowthRecord] = useState(false);
  const [newGrowthRecord, setNewGrowthRecord] = useState({
    id: 0,
    created_: "",
    height: "",
  });

  const handleNewGrowthRecord = () => {
    setIsAddingGrowthRecord(true);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewGrowthRecord({
      ...newGrowthRecord,
      [name]: value,
    });
  }

  const handleSubmitNewGrowthRecord = () => {
    setIsAddingGrowthRecord(false);
    const [addGrowthRecordMutation] = api.useAddGrowthRecordMutation();
    const growthRecord: GrowthRecord = {
      id: 0,
      created_: new Date(newGrowthRecord.created_),
      height: Number(newGrowthRecord.height),
      plant: selectedPlant.id,
      uom: 3,
      date: new Date(newGrowthRecord.created_),
      updated_: new Date(),
    };
    let plantId = selectedPlant.id;
    addGrowthRecordMutation({plantId, growthRecord});
    dispatch(GrowthRecordSlice.addGrowthRecord(growthRecord));
    setNewGrowthRecord({
      id: 0,
      created_: "",
      height: "",
    });
  }

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
          {growthRecords && (
            <Accordion.Item eventKey="0">
              <Accordion.Header>Growth Records</Accordion.Header>
              <Accordion.Body>
                <Table striped bordered hover className="text-center">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Created At</th>
                      <th>Height (cm)</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {growthRecords.map((record, index) => (
                      <tr key={record.id}>
                        <td>{index + 1}</td>
                        <td>{record.created_.toLocaleDateString()}</td>
                        <td>{record.height} cm</td>
                        <td>
                          <button className="btn btn-warning m-1">Edit</button>
                          <button className="btn btn-danger m-1">Delete</button>
                        </td>
                      </tr>
                    ))}
                    {isAddingGrowthRecord ? (
                      <tr>
                        <td>
                          <input
                            type="number"
                            name="id"
                            value={growthRecords.length + 1}
                            readOnly
                            className="form-control"
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            name="created_"
                            value={newGrowthRecord.created_}
                            onChange={handleInputChange}
                            className="form-control"
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="height"
                            value={newGrowthRecord.height}
                            onChange={handleInputChange}
                            className="form-control"
                            placeholder="Height in cm"
                          />
                        </td>
                        <td>
                          <button
                            className="btn btn-success m-1"
                            onClick={handleSubmitNewGrowthRecord}>
                              Submit
                          </button>
                          <button
                            className="btn btn-secondary m-1"
                            onClick={() => setIsAddingGrowthRecord(false)}>
                              Cancel
                          </button>
                        </td>
                      </tr>
                    ) : (
                      <tr>
                        <td colSpan={4}>
                          <button
                            className="btn btn-primary m-3 auto-align-end"
                            onClick={handleNewGrowthRecord}
                          >
                            Add New Growth Record
                          </button>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </Table>
              </Accordion.Body>
            </Accordion.Item>
          )}

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
