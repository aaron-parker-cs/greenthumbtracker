import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table } from 'react-bootstrap';
import { Plant } from '../../models/plant';
import { SoilMoistureRecord } from '../../models/soilMoisture';
import { api } from '../../redux/api';
import {
  fetchSoilMoistureRecordsStart,
  fetchSoilMoistureRecordsSuccess,
  fetchSoilMoistureRecordsFailure,
  addSoilMoistureRecord,
  removeSoilMoistureRecord,
  updateSoilMoistureRecord,
} from '../../redux/records/soilMoistureRecord';
import { toast } from 'react-toastify';

const SoilMoistureRecordTable = () => {
  const selectedPlant = useSelector(
    (state: { plant: { selectedPlant: Plant } }) => state.plant.selectedPlant
  );

  const {data: soilMoistureRecords, isLoading, isError, error, refetch} = api.useGetSoilMoistureRecordsQuery(selectedPlant?.id, { skip: !selectedPlant });
  // const [createRecord, {isLoading, isSuccess, isError}] = api.useAddSoilMoistureRecordMutation();
  const [
    createRecord,
    {
      isSuccess: addSuccess,
      isError: addError,
      error: addErrorDetails,
      reset: addReset,
    },
  ] = api.useAddSoilMoistureRecordMutation();
  const dispatch = useDispatch();

  const [
    updateRecord,
    {
      isSuccess: updateSuccess,
      isError: updateError,
      error: updateErrorDetails,
      reset: updateReset,
    },
  ] = api.useUpdateSoilMoistureRecordMutation();

  const [
    deleteRecord,
    {
      isSuccess: deleteSuccess,
      isError: deleteError,
      error: deleteErrorDetails,
      reset: deleteReset,
    },
  ] = api.useDeleteSoilMoistureRecordMutation();

  useEffect(() => {
    if(isLoading) {
      dispatch(fetchSoilMoistureRecordsStart());
    }
    if(isError) {
      console.log(error);
      dispatch(fetchSoilMoistureRecordsFailure(error as string));
    }
    if(soilMoistureRecords) {
      dispatch(fetchSoilMoistureRecordsSuccess(soilMoistureRecords));
    }
  }, [soilMoistureRecords, dispatch, error, isError, isLoading]);

  useEffect(() => {
    if(addSuccess){
      toast.success("SoilMoisture record added successfully!");
      addReset();
    }
    if(addError){
      toast.error("Error adding soilMoisture record: " + addErrorDetails);
      addReset();
    }
  }, [addSuccess, addReset, addError, addErrorDetails]);

  useEffect(() => {
    if(updateSuccess){
      toast.success("SoilMoisture record updated successfully!");
      updateReset();
      setIsEditingRecordId(null);
      refetch();
    }
    if(updateError){
      toast.error("Error updating soilMoisture record: " + updateErrorDetails);
      updateReset();
    }
  }, [updateSuccess, updateReset, updateError, updateErrorDetails]);

  useEffect(() => {
    if(deleteSuccess){
      toast.success("SoilMoisture record deleted successfully!");
      deleteReset();
    }
    if(deleteError){
      toast.error("Error deleting soilMoisture record: " + deleteErrorDetails);
      deleteReset();
    }
  }, [deleteSuccess, deleteReset, deleteError, deleteErrorDetails]);

  const [isAddingSoilMoistureRecord, setIsAddingSoilMoistureRecord] = useState(false);
  const [newSoilMoistureRecord, setNewSoilMoistureRecord] = useState({
    id: 0,
    date: "",
    soil_moisture: "",
  });
  const [isEditingRecordId, setIsEditingRecordId] = useState<number | null>(null);
  const [editedRecord, setEditedRecord] = useState<SoilMoistureRecord | null>(null);

  const handleNewSoilMoistureRecord = () => {
    setIsAddingSoilMoistureRecord(true);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSoilMoistureRecord({
      ...newSoilMoistureRecord,
      [name]: value,
    });
  }

  const handleSubmitNewSoilMoistureRecord = async () => {
    setIsAddingSoilMoistureRecord(false);
    const soilMoistureRecord: SoilMoistureRecord = {
      id: 0,
      plant: selectedPlant.id,
      user: 0,
      soil_moisture: Number(newSoilMoistureRecord.soil_moisture),
      date: new Date(newSoilMoistureRecord.date),
    };

    try{
      await createRecord({plantId: selectedPlant.id, soilMoistureRecord});
      dispatch(addSoilMoistureRecord(soilMoistureRecord));
      setNewSoilMoistureRecord({
        id: 0,
        date: "",
        soil_moisture: "",
      });
      refetch(); // should be a better way to update table without refreshing than this
    } catch(error){
      console.error("Error creating soilMoisture record:", error);
    }
  }

  const handleEditClick = (record: SoilMoistureRecord) => {
    setIsEditingRecordId(record.id);
    setEditedRecord({...record});
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if(editedRecord){
      setEditedRecord({
        ...editedRecord,
        [name]: value,
      });
    }
  };

  const handleSubmitEditRecord = async () => {
    if(editedRecord){
      try {
        setEditedRecord({
          ...editedRecord,
          soil_moisture: Number(editedRecord.soil_moisture), // sets string to number
        });
        await updateRecord({plantId: selectedPlant.id, soilMoistureRecord: editedRecord});
        dispatch(updateSoilMoistureRecord(editedRecord));
        setEditedRecord(null);
        setIsEditingRecordId(null);
        refetch(); // should be a better way to update table without refreshing than this
      } catch (error) {
        console.error("Error updating soilMoisture record:", error);
      }
    }
  };

  const handleAddRecordCancel = () => {
    setIsAddingSoilMoistureRecord(false);
    setNewSoilMoistureRecord({
      id: 0,
      date: "",
      soil_moisture: "",
    });
  };

  const onDelete = async (id: number) => {
    await deleteRecord({plantId: selectedPlant.id, soilMoistureRecordId: id});
    dispatch(removeSoilMoistureRecord(id.toString()));
    refetch(); // should be a better way to update table without refreshing than this
  }

  return (
    <Table striped bordered hover className="text-center">
      <thead>
        <tr>
          <th>#</th>
          <th>Created At</th>
          <th>Soil Moisture (%)</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {soilMoistureRecords?.map((record, index) => (
          <tr key={record.id}>
            {isEditingRecordId === record.id ? (
              <>
                <td>{index + 1}</td>
                <td>
                  <input
                    type="date"
                    name="date"
                    value={new Date(editedRecord?.date ?? "").toISOString().split("T")[0]}
                    onChange={handleEditInputChange}
                    className="form-control"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="soil_moisture"
                    value={editedRecord?.soil_moisture}
                    onChange={handleEditInputChange}
                    className="form-control"
                    placeholder="SoilMoisture in %"
                  />
                </td>
                <td>
                  <button
                    className="btn btn-success m-1"
                    onClick={handleSubmitEditRecord}>
                      Submit
                  </button>
                  <button
                    className="btn btn-secondary m-1"
                    onClick={() => setIsEditingRecordId(null)}>
                      Cancel
                  </button>
                </td>
              </>
              ) : (
                <>
                  <td>{index + 1}</td>
                  <td>{new Date(record.date).toLocaleDateString()}</td>
                  <td>{record.soil_moisture} %</td>
                  <td>
                    <button 
                      className="btn btn-warning m-1"
                      onClick={() => handleEditClick(record)}>
                        Edit
                    </button>
                    <button 
                      className="btn btn-danger m-1"
                      onClick={() => onDelete(record.id)}>
                        Delete
                    </button>
                  </td>
                </>
              )
            }
            
          </tr>
        ))}
        {isAddingSoilMoistureRecord ? (
          <tr>
            <td>
              <input
                type="number"
                name="id"
                value={(soilMoistureRecords?.length ?? 0) + 1}
                readOnly
                className="form-control"
              />
            </td>
            <td>
              <input
                type="date"
                name="date"
                value={newSoilMoistureRecord.date}
                onChange={handleInputChange}
                className="form-control"
              />
            </td>
            <td>
              <input
                type="number"
                name="soil_moisture"
                value={newSoilMoistureRecord.soil_moisture}
                onChange={handleInputChange}
                className="form-control"
                placeholder="SoilMoisture in %"
              />
            </td>
            <td>
              <button
                className="btn btn-success m-1"
                onClick={handleSubmitNewSoilMoistureRecord}>
                  Submit
              </button>
              <button
                className="btn btn-secondary m-1"
                onClick={handleAddRecordCancel}>
                  Cancel
              </button>
            </td>
          </tr>
        ) : (
          <tr>
            <td colSpan={4}>
              <button
                className="btn btn-primary m-3 auto-align-end"
                onClick={handleNewSoilMoistureRecord}>
                  Add SoilMoisture Record
              </button>
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

export default SoilMoistureRecordTable;