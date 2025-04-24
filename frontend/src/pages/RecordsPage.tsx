import { useSelector } from "react-redux";
import { Accordion } from "react-bootstrap";
import { Plant } from "../models/plant";
import { GrowthRecord } from "../models/growth";
import { WaterRecord } from "../models/water";
import "../styles/recordsPage.scss";
// import GrowthRecordTable from "../components/records/GrowthRecordTable";
// import WaterRecordTable from "../components/records/WaterRecordTable";
import GenericRecordTable from "../components/records/GenericRecordTable";
import { api } from "../redux/api";
import {
  fetchGrowthRecordsStart,
  fetchGrowthRecordsSuccess,
  fetchGrowthRecordsFailure,
  addGrowthRecord,
  removeGrowthRecord,
  updateGrowthRecord,
} from '../redux/records/growthRecord';
import {
  fetchWaterRecordsStart,
  fetchWaterRecordsSuccess,
  fetchWaterRecordsFailure,
  addWaterRecord,
  removeWaterRecord,
  updateWaterRecord,
} from '../redux/records/waterRecord';

const RecordsPage = () => {
  const selectedPlant = useSelector(
    (state: { plant: { selectedPlant: Plant } }) => state.plant.selectedPlant
  );

  // add other records once implemented
  // light record
  // soil moisture record
  // temperature record
  // humidity record

  /*
    The following items need to be added as props into the Generic Record Table:
    fetchRecordStart
    fetchRecordSuccess
    fetchRecordFailure
    stateAddRecord
    stateRemoveRecord
    stateUpdateRecord
    ApiGetRecords
    ApiAddRecord
    ApiUpdateRecord
    ApiDeleteRecord
    recordedValueName  (height, amount, temperature, etc.)
    recordType         (water, growth, soil_moisture, etc.)
    defaultRecord      (default structure for this record type)
  */

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
              <GenericRecordTable<GrowthRecord> 
              fetchRecordStart={fetchGrowthRecordsStart} 
              fetchRecordSuccess={fetchGrowthRecordsSuccess} 
              fetchRecordFailure={fetchGrowthRecordsFailure} 
              stateAddRecord={addGrowthRecord} 
              stateRemoveRecord={removeGrowthRecord} 
              stateUpdateRecord={updateGrowthRecord} 
              ApiGetRecords={api.useGetGrowthRecordsQuery}
              ApiAddRecord={api.useAddGrowthRecordMutation} 
              ApiUpdateRecord={api.useUpdateGrowthRecordMutation}
              ApiDeleteRecord={api.useDeleteGrowthRecordMutation}
              recordedValueName="height" 
              recordType="growthRecord" 
              defaultRecord={{
                plant: selectedPlant?.id || 0,
                height: 0,
                uom: 3,
                date: new Date(),
                created_: new Date(),
                updated_: new Date(),
                id: 0,
              }}
              />
            </Accordion.Body>
          </Accordion.Item>

          {/* Water Records Dropdown */}
          
          <Accordion.Item eventKey="1">
            <Accordion.Header>Water Records</Accordion.Header>
            <Accordion.Body>
              <GenericRecordTable<WaterRecord> 
                fetchRecordStart={fetchWaterRecordsStart}
                fetchRecordSuccess={fetchWaterRecordsSuccess}
                fetchRecordFailure={fetchWaterRecordsFailure}
                stateAddRecord={addWaterRecord}
                stateRemoveRecord={removeWaterRecord}
                stateUpdateRecord={updateWaterRecord}
                ApiGetRecords={api.useGetWaterRecordsQuery}
                ApiAddRecord={api.useAddWaterRecordMutation}
                ApiUpdateRecord={api.useUpdateWaterRecordMutation}
                ApiDeleteRecord={api.useDeleteWaterRecordMutation}
                recordedValueName="amount"
                recordType="waterRecord"
                defaultRecord={{
                  plant: selectedPlant?.id || 0,
                  amount: 0,
                  uom: 7,
                  date: new Date(),
                  created_: new Date(),
                  updated_: new Date(),
                  id: 0,
                }}
              />
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
