import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table } from 'react-bootstrap';
import { Plant } from '../../models/plant';
import { TemperatureRecord } from '../../models/temperature';
import { api } from '../../redux/api';
import {
  fetchTemperatureRecordsStart,
  fetchTemperatureRecordsSuccess,
  fetchTemperatureRecordsFailure,
  addTemperatureRecord,
  removeTemperatureRecord,
  updateTemperatureRecord,
} from '../../redux/records/temperatureRecord';
import { toast } from 'react-toastify';

const TemperatureRecordTable = () => {
  const selectedPlant = useSelector(
    (state: { plant: { selectedPlant: Plant } }) => state.plant.selectedPlant
  );

  const {data: temperatureRecords, isLoading, isError, error, refetch} = api.useGetTemperatureRecordsQuery(selectedPlant?.id, { skip: !selectedPlant });
  // const [createRecord, {isLoading, isSuccess, isError}] = api.useAddTemperatureRecordMutation();
  const [
    createRecord,
    {
      isSuccess: addSuccess,
      isError: addError,
      error: addErrorDetails,
      reset: addReset,
    },
  ] = api.useAddTemperatureRecordMutation();
  const dispatch = useDispatch();

  const [
    updateRecord,
    {
      isSuccess: updateSuccess,
      isError: updateError,
      error: updateErrorDetails,
      reset: updateReset,
    },
  ] = api.useUpdateTemperatureRecordMutation();

  const [
    deleteRecord,
    {
      isSuccess: deleteSuccess,
      isError: deleteError,
      error: deleteErrorDetails,
      reset: deleteReset,
    },
  ] = api.useDeleteTemperatureRecordMutation();

  useEffect(() => {
    if(isLoading) {
      dispatch(fetchTemperatureRecordsStart());
    }
    if(isError) {
      console.log(error);
      dispatch(fetchTemperatureRecordsFailure(error as string));
    }
    if(temperatureRecords) {
      dispatch(fetchTemperatureRecordsSuccess(temperatureRecords));
    }
  }, [temperatureRecords, dispatch, error, isError, isLoading]);

  useEffect(() => {
    if(addSuccess){
      toast.success("Temperature record added successfully!");
      addReset();
    }
    if(addError){
      toast.error("Error adding temperature record: " + addErrorDetails);
      addReset();
    }
  }, [addSuccess, addReset, addError, addErrorDetails]);

  useEffect(() => {
    if(updateSuccess){
      toast.success("Temperature record updated successfully!");
      updateReset();
      setIsEditingRecordId(null);
      refetch();
    }
    if(updateError){
      toast.error("Error updating temperature record: " + updateErrorDetails);
      updateReset();
    }
  }, [updateSuccess, updateReset, updateError, updateErrorDetails]);

  useEffect(() => {
    if(deleteSuccess){
      toast.success("Temperature record deleted successfully!");
      deleteReset();
    }
    if(deleteError){
      toast.error("Error deleting temperature record: " + deleteErrorDetails);
      deleteReset();
    }
  }, [deleteSuccess, deleteReset, deleteError, deleteErrorDetails]);

  const [isAddingTemperatureRecord, setIsAddingTemperatureRecord] = useState(false);
  const [newTemperatureRecord, setNewTemperatureRecord] = useState({
    id: 0,
    date: "",
    temperature: "",
  });
  const [isEditingRecordId, setIsEditingRecordId] = useState<number | null>(null);
  const [editedRecord, setEditedRecord] = useState<TemperatureRecord | null>(null);

  const handleNewTemperatureRecord = () => {
    setIsAddingTemperatureRecord(true);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewTemperatureRecord({
      ...newTemperatureRecord,
      [name]: value,
    });
  }

  const handleSubmitNewTemperatureRecord = async () => {
    setIsAddingTemperatureRecord(false);
    const temperatureRecord: TemperatureRecord = {
      id: 0,
      plant: selectedPlant.id,
      user: 0,
      temperature: Number(newTemperatureRecord.temperature),
      date: new Date(newTemperatureRecord.date),
    };

    try{
      await createRecord({plantId: selectedPlant.id, temperatureRecord});
      dispatch(addTemperatureRecord(temperatureRecord));
      setNewTemperatureRecord({
        id: 0,
        date: "",
        temperature: "",
      });
      refetch(); // should be a better way to update table without refreshing than this
    } catch(error){
      console.error("Error creating temperature record:", error);
    }
  }

  const handleEditClick = (record: TemperatureRecord) => {
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
          temperature: Number(editedRecord.temperature), // sets string to number
        });
        await updateRecord({plantId: selectedPlant.id, temperatureRecord: editedRecord});
        dispatch(updateTemperatureRecord(editedRecord));
        setEditedRecord(null);
        setIsEditingRecordId(null);
        refetch(); // should be a better way to update table without refreshing than this
      } catch (error) {
        console.error("Error updating temperature record:", error);
      }
    }
  };

  const handleAddRecordCancel = () => {
    setIsAddingTemperatureRecord(false);
    setNewTemperatureRecord({
      id: 0,
      date: "",
      temperature: "",
    });
  };

  const onDelete = async (id: number) => {
    await deleteRecord({plantId: selectedPlant.id, temperatureRecordId: id});
    dispatch(removeTemperatureRecord(id.toString()));
    refetch(); // should be a better way to update table without refreshing than this
  }

  return (
    <Table striped bordered hover className="text-center">
      <thead>
        <tr>
          <th>#</th>
          <th>Created At</th>
          <th>Temperature (C&deg;)</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {temperatureRecords?.map((record, index) => (
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
                    name="temperature"
                    value={editedRecord?.temperature}
                    onChange={handleEditInputChange}
                    className="form-control"
                    placeholder="Temperature in C&deg;"
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
                  <td>{record.temperature} C&deg;</td>
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
        {isAddingTemperatureRecord ? (
          <tr>
            <td>
              <input
                type="number"
                name="id"
                value={(temperatureRecords?.length ?? 0) + 1}
                readOnly
                className="form-control"
              />
            </td>
            <td>
              <input
                type="date"
                name="date"
                value={newTemperatureRecord.date}
                onChange={handleInputChange}
                className="form-control"
              />
            </td>
            <td>
              <input
                type="number"
                name="temperature"
                value={newTemperatureRecord.temperature}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Degrees in C&deg;"
              />
            </td>
            <td>
              <button
                className="btn btn-success m-1"
                onClick={handleSubmitNewTemperatureRecord}>
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
                onClick={handleNewTemperatureRecord}>
                  Add Temperature Record
              </button>
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

export default TemperatureRecordTable;