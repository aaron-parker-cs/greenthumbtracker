import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table } from 'react-bootstrap';
import { Plant } from '../../models/plant';
import { HumidityRecord } from '../../models/humidity';
import { api } from '../../redux/api';
import {
  fetchHumidityRecordsStart,
  fetchHumidityRecordsSuccess,
  fetchHumidityRecordsFailure,
  addHumidityRecord,
  removeHumidityRecord,
  updateHumidityRecord,
} from '../../redux/records/humidityRecord';
import { toast } from 'react-toastify';

const HumidityRecordTable = () => {
  const selectedPlant = useSelector(
    (state: { plant: { selectedPlant: Plant } }) => state.plant.selectedPlant
  );

  const {data: humidityRecords, isLoading, isError, error, refetch} = api.useGetHumidityRecordsQuery(selectedPlant?.id, { skip: !selectedPlant });
  // const [createRecord, {isLoading, isSuccess, isError}] = api.useAddHumidityRecordMutation();
  const [
    createRecord,
    {
      isSuccess: addSuccess,
      isError: addError,
      error: addErrorDetails,
      reset: addReset,
    },
  ] = api.useAddHumidityRecordMutation();
  const dispatch = useDispatch();

  const [
    updateRecord,
    {
      isSuccess: updateSuccess,
      isError: updateError,
      error: updateErrorDetails,
      reset: updateReset,
    },
  ] = api.useUpdateHumidityRecordMutation();

  const [
    deleteRecord,
    {
      isSuccess: deleteSuccess,
      isError: deleteError,
      error: deleteErrorDetails,
      reset: deleteReset,
    },
  ] = api.useDeleteHumidityRecordMutation();

  useEffect(() => {
    if(isLoading) {
      dispatch(fetchHumidityRecordsStart());
    }
    if(isError) {
      console.log(error);
      dispatch(fetchHumidityRecordsFailure(error as string));
    }
    if(humidityRecords) {
      dispatch(fetchHumidityRecordsSuccess(humidityRecords));
    }
  }, [humidityRecords, dispatch, error, isError, isLoading]);

  useEffect(() => {
    if(addSuccess){
      toast.success("Humidity record added successfully!");
      addReset();
    }
    if(addError){
      toast.error("Error adding humidity record: " + addErrorDetails);
      addReset();
    }
  }, [addSuccess, addReset, addError, addErrorDetails]);

  useEffect(() => {
    if(updateSuccess){
      toast.success("Humidity record updated successfully!");
      updateReset();
      setIsEditingRecordId(null);
      refetch();
    }
    if(updateError){
      toast.error("Error updating humidity record: " + updateErrorDetails);
      updateReset();
    }
  }, [updateSuccess, updateReset, updateError, updateErrorDetails]);

  useEffect(() => {
    if(deleteSuccess){
      toast.success("Humidity record deleted successfully!");
      deleteReset();
    }
    if(deleteError){
      toast.error("Error deleting humidity record: " + deleteErrorDetails);
      deleteReset();
    }
  }, [deleteSuccess, deleteReset, deleteError, deleteErrorDetails]);

  const [isAddingHumidityRecord, setIsAddingHumidityRecord] = useState(false);
  const [newHumidityRecord, setNewHumidityRecord] = useState({
    id: 0,
    date: "",
    humidity: "",
  });
  const [isEditingRecordId, setIsEditingRecordId] = useState<number | null>(null);
  const [editedRecord, setEditedRecord] = useState<HumidityRecord | null>(null);

  const handleNewHumidityRecord = () => {
    setIsAddingHumidityRecord(true);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewHumidityRecord({
      ...newHumidityRecord,
      [name]: value,
    });
  }

  const handleSubmitNewHumidityRecord = async () => {
    setIsAddingHumidityRecord(false);
    const humidityRecord: HumidityRecord = {
      id: 0,
      plant: selectedPlant.id,
      user: 0,
      humidity: Number(newHumidityRecord.humidity),
      date: new Date(newHumidityRecord.date),
    };

    try{
      await createRecord({plantId: selectedPlant.id, humidityRecord});
      dispatch(addHumidityRecord(humidityRecord));
      setNewHumidityRecord({
        id: 0,
        date: "",
        humidity: "",
      });
      refetch(); // should be a better way to update table without refreshing than this
    } catch(error){
      console.error("Error creating humidity record:", error);
    }
  }

  const handleEditClick = (record: HumidityRecord) => {
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
          humidity: Number(editedRecord.humidity), // sets string to number
        });
        await updateRecord({plantId: selectedPlant.id, humidityRecord: editedRecord});
        dispatch(updateHumidityRecord(editedRecord));
        setEditedRecord(null);
        setIsEditingRecordId(null);
        refetch(); // should be a better way to update table without refreshing than this
      } catch (error) {
        console.error("Error updating humidity record:", error);
      }
    }
  };

  const handleAddRecordCancel = () => {
    setIsAddingHumidityRecord(false);
    setNewHumidityRecord({
      id: 0,
      date: "",
      humidity: "",
    });
  };

  const onDelete = async (id: number) => {
    await deleteRecord({plantId: selectedPlant.id, humidityRecordId: id});
    dispatch(removeHumidityRecord(id.toString()));
    refetch(); // should be a better way to update table without refreshing than this
  }

  return (
    <Table striped bordered hover className="text-center">
      <thead>
        <tr>
          <th>#</th>
          <th>Created At</th>
          <th>Humidity (%)</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {humidityRecords?.map((record, index) => (
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
                    name="humidity"
                    value={editedRecord?.humidity}
                    onChange={handleEditInputChange}
                    className="form-control"
                    placeholder="Humidity in C&deg;"
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
                  <td>{record.humidity}%</td>
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
        {isAddingHumidityRecord ? (
          <tr>
            <td>
              <input
                type="number"
                name="id"
                value={(humidityRecords?.length ?? 0) + 1}
                readOnly
                className="form-control"
              />
            </td>
            <td>
              <input
                type="date"
                name="date"
                value={newHumidityRecord.date}
                onChange={handleInputChange}
                className="form-control"
              />
            </td>
            <td>
              <input
                type="number"
                name="humidity"
                value={newHumidityRecord.humidity}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Humidity in %"
              />
            </td>
            <td>
              <button
                className="btn btn-success m-1"
                onClick={handleSubmitNewHumidityRecord}>
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
                onClick={handleNewHumidityRecord}>
                  Add Humidity Record
              </button>
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

export default HumidityRecordTable;