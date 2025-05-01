import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table } from 'react-bootstrap';
import { Plant } from '../../models/plant';
import { LightRecord } from '../../models/light';
import { api } from '../../redux/api';
import {
  fetchLightRecordsStart,
  fetchLightRecordsSuccess,
  fetchLightRecordsFailure,
  addLightRecord,
  removeLightRecord,
  updateLightRecord,
} from '../../redux/records/lightRecord';
import { toast } from 'react-toastify';

const LightRecordTable = () => {
  const selectedPlant = useSelector(
    (state: { plant: { selectedPlant: Plant } }) => state.plant.selectedPlant
  );

  const {data: lightRecords, isLoading, isError, error, refetch} = api.useGetLightRecordsQuery(selectedPlant?.id, { skip: !selectedPlant });
  // const [createRecord, {isLoading, isSuccess, isError}] = api.useAddLightRecordMutation();
  const [
    createRecord,
    {
      isSuccess: addSuccess,
      isError: addError,
      error: addErrorDetails,
      reset: addReset,
    },
  ] = api.useAddLightRecordMutation();
  const dispatch = useDispatch();

  const [
    updateRecord,
    {
      isSuccess: updateSuccess,
      isError: updateError,
      error: updateErrorDetails,
      reset: updateReset,
    },
  ] = api.useUpdateLightRecordMutation();

  const [
    deleteRecord,
    {
      isSuccess: deleteSuccess,
      isError: deleteError,
      error: deleteErrorDetails,
      reset: deleteReset,
    },
  ] = api.useDeleteLightRecordMutation();

  useEffect(() => {
    if(isLoading) {
      dispatch(fetchLightRecordsStart());
    }
    if(isError) {
      console.log(error);
      dispatch(fetchLightRecordsFailure(error as string));
    }
    if(lightRecords) {
      dispatch(fetchLightRecordsSuccess(lightRecords));
    }
  }, [lightRecords, dispatch, error, isError, isLoading]);

  useEffect(() => {
    if(addSuccess){
      toast.success("Light record added successfully!");
      addReset();
    }
    if(addError){
      toast.error("Error adding light record: " + addErrorDetails);
      addReset();
    }
  }, [addSuccess, addReset, addError, addErrorDetails]);

  useEffect(() => {
    if(updateSuccess){
      toast.success("Light record updated successfully!");
      updateReset();
      setIsEditingRecordId(null);
      refetch();
    }
    if(updateError){
      toast.error("Error updating light record: " + updateErrorDetails);
      updateReset();
    }
  }, [updateSuccess, updateReset, updateError, updateErrorDetails]);

  useEffect(() => {
    if(deleteSuccess){
      toast.success("Light record deleted successfully!");
      deleteReset();
    }
    if(deleteError){
      toast.error("Error deleting light record: " + deleteErrorDetails);
      deleteReset();
    }
  }, [deleteSuccess, deleteReset, deleteError, deleteErrorDetails]);

  const [isAddingLightRecord, setIsAddingLightRecord] = useState(false);
  const [newLightRecord, setNewLightRecord] = useState({
    id: 0,
    date: "",
    light: "",
  });
  const [isEditingRecordId, setIsEditingRecordId] = useState<number | null>(null);
  const [editedRecord, setEditedRecord] = useState<LightRecord | null>(null);

  const handleNewLightRecord = () => {
    setIsAddingLightRecord(true);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewLightRecord({
      ...newLightRecord,
      [name]: value,
    });
  }

  const handleSubmitNewLightRecord = async () => {
    setIsAddingLightRecord(false);
    const lightRecord: LightRecord = {
      id: 0,
      plant: selectedPlant.id,
      user: 0,
      light: Number(newLightRecord.light),
      date: new Date(newLightRecord.date),
    };

    try{
      await createRecord({plantId: selectedPlant.id, lightRecord});
      dispatch(addLightRecord(lightRecord));
      setNewLightRecord({
        id: 0,
        date: "",
        light: "",
      });
      refetch(); // should be a better way to update table without refreshing than this
    } catch(error){
      console.error("Error creating light record:", error);
    }
  }

  const handleEditClick = (record: LightRecord) => {
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
          light: Number(editedRecord.light), // sets string to number
        });
        await updateRecord({plantId: selectedPlant.id, lightRecord: editedRecord});
        dispatch(updateLightRecord(editedRecord));
        setEditedRecord(null);
        setIsEditingRecordId(null);
        refetch(); // should be a better way to update table without refreshing than this
      } catch (error) {
        console.error("Error updating light record:", error);
      }
    }
  };

  const handleAddRecordCancel = () => {
    setIsAddingLightRecord(false);
    setNewLightRecord({
      id: 0,
      date: "",
      light: "",
    });
  };

  const onDelete = async (id: number) => {
    await deleteRecord({plantId: selectedPlant.id, lightRecordId: id});
    dispatch(removeLightRecord(id.toString()));
    refetch(); // should be a better way to update table without refreshing than this
  }

  return (
    <Table striped bordered hover className="text-center">
      <thead>
        <tr>
          <th>#</th>
          <th>Created At</th>
          <th>Light (lx)</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {lightRecords?.map((record, index) => (
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
                    name="light"
                    value={editedRecord?.light}
                    onChange={handleEditInputChange}
                    className="form-control"
                    placeholder="Light in lx"
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
                  <td>{record.light} lx</td>
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
        {isAddingLightRecord ? (
          <tr>
            <td>
              <input
                type="number"
                name="id"
                value={(lightRecords?.length ?? 0) + 1}
                readOnly
                className="form-control"
              />
            </td>
            <td>
              <input
                type="date"
                name="date"
                value={newLightRecord.date}
                onChange={handleInputChange}
                className="form-control"
              />
            </td>
            <td>
              <input
                type="number"
                name="light"
                value={newLightRecord.light}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Light in lx"
              />
            </td>
            <td>
              <button
                className="btn btn-success m-1"
                onClick={handleSubmitNewLightRecord}>
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
                onClick={handleNewLightRecord}>
                  Add Light Record
              </button>
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

export default LightRecordTable;