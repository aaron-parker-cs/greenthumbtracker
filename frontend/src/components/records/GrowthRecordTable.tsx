import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table } from 'react-bootstrap';
import { Plant } from '../../models/plant';
import { GrowthRecord } from '../../models/growth';
import { api } from '../../redux/api';
import {
  fetchGrowthRecordsStart,
  fetchGrowthRecordsSuccess,
  fetchGrowthRecordsFailure,
  selectGrowthRecord,
  addGrowthRecord,
  removeGrowthRecord,
  updateGrowthRecord,
} from '../../redux/records/growthRecord';
import { toast } from 'react-toastify';

const GrowthRecordTable = () => {
  const selectedPlant = useSelector(
    (state: { plant: { selectedPlant: Plant } }) => state.plant.selectedPlant
  );

  const {data: growthRecords, isLoading, isError, error, refetch} = api.useGetGrowthRecordsQuery(selectedPlant?.id, { skip: !selectedPlant });
  // const [createRecord, {isLoading, isSuccess, isError}] = api.useAddGrowthRecordMutation();
  const [
    createRecord,
    {
      isSuccess: addSuccess,
      isLoading: addInProgress,
      isError: addError,
      error: addErrorDetails,
      reset: addReset,
    },
  ] = api.useAddGrowthRecordMutation();
  const dispatch = useDispatch();

  const [
    updateRecord,
    {
      isSuccess: updateSuccess,
      isLoading: updateInProgress,
      isError: updateError,
      error: updateErrorDetails,
      reset: updateReset,
    },
  ] = api.useUpdateGrowthRecordMutation();

  const [
    deleteRecord,
    {
      isSuccess: deleteSuccess,
      isLoading: deleteInProgress,
      isError: deleteError,
      error: deleteErrorDetails,
      reset: deleteReset,
    },
  ] = api.useDeleteGrowthRecordMutation();

  useEffect(() => {
    if(isLoading) {
      dispatch(fetchGrowthRecordsStart());
    }
    if(isError) {
      console.log(error);
      dispatch(fetchGrowthRecordsFailure(error as string));
    }
    if(growthRecords) {
      dispatch(fetchGrowthRecordsSuccess(growthRecords));
    }
  }, [growthRecords, dispatch, error, isError, isLoading]);

  useEffect(() => {
    if(addSuccess){
      toast.success("Growth record added successfully!");
      addReset();
    }
    if(addError){
      toast.error("Error adding growth record: " + addErrorDetails);
      addReset();
    }
  }, [addSuccess, addReset, addError, addErrorDetails]);

  useEffect(() => {
    if(updateSuccess){
      toast.success("Growth record updated successfully!");
      updateReset();
      setIsEditingRecordId(null);
      refetch();
    }
    if(updateError){
      toast.error("Error updating growth record: " + updateErrorDetails);
      updateReset();
    }
  }, [updateSuccess, updateReset, updateError, updateErrorDetails]);

  useEffect(() => {
    if(deleteSuccess){
      toast.success("Growth record deleted successfully!");
      deleteReset();
    }
    if(deleteError){
      toast.error("Error deleting growth record: " + deleteErrorDetails);
      deleteReset();
    }
  }, [deleteSuccess, deleteReset, deleteError, deleteErrorDetails]);

  const [isAddingGrowthRecord, setIsAddingGrowthRecord] = useState(false);
  const [newGrowthRecord, setNewGrowthRecord] = useState({
    id: 0,
    created_: "",
    height: "",
  });
  const [isEditingRecordId, setIsEditingRecordId] = useState<number | null>(null);
  const [editedRecord, setEditedRecord] = useState<GrowthRecord | null>(null);

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

  const handleSubmitNewGrowthRecord = async () => {
    setIsAddingGrowthRecord(false);
    const growthRecord: GrowthRecord = {
      id: 0,
      created_: new Date(newGrowthRecord.created_),
      height: Number(newGrowthRecord.height),
      plant: selectedPlant.id,
      uom: 3,
      date: new Date(newGrowthRecord.created_),
      updated_: new Date(),
    };

    try{
      await createRecord({plantId: selectedPlant.id, growthRecord});
      dispatch(addGrowthRecord(growthRecord));
      setNewGrowthRecord({
        id: 0,
        created_: "",
        height: "",
      });
      refetch(); // should be a better way to update table without refreshing than this
    } catch(error){
      console.error("Error creating growth record:", error);
    }
  }

  const handleEditClick = (record: GrowthRecord) => {
    setIsEditingRecordId(record.id);
    setEditedRecord({...record});
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if(editedRecord){
      setEditedRecord({
        ...editedRecord,
        [name]: name === "height" ? Number(value) : value,
      });
    }
  };

  const handleSubmitEditRecord = async () => {
    if(editedRecord){
      try {
        await updateRecord({plantId: selectedPlant.id, growthRecord: editedRecord});
        dispatch(updateGrowthRecord(editedRecord));
        setEditedRecord(null);
        setIsEditingRecordId(null);
        refetch(); // should be a better way to update table without refreshing than this
      } catch (error) {
        console.error("Error updating growth record:", error);
      }
    }
  };

  const onDelete = (id: number) => {
    deleteRecord({plantId: selectedPlant.id, growthRecordId: id});
    dispatch(removeGrowthRecord(id.toString()));
    refetch(); // should be a better way to update table without refreshing than this
  }

  return (
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
        {growthRecords?.map((record, index) => (
          <tr key={record.id}>
            {isEditingRecordId === record.id ? (
              <>
                <td>{index + 1}</td>
                <td>
                  <input
                    type="date"
                    name="created_"
                    value={new Date(editedRecord?.created_ ?? "").toISOString().split("T")[0]}
                    onChange={handleEditInputChange}
                    className="form-control"
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="height"
                    value={editedRecord?.height ?? ""}
                    onChange={handleEditInputChange}
                    className="form-control"
                    placeholder="Height in cm"
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
                  <td>{new Date(record.created_).toLocaleDateString()}</td>
                  <td>{record.height} cm</td>
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
        {isAddingGrowthRecord ? (
          <tr>
            <td>
              <input
                type="number"
                name="id"
                value={(growthRecords?.length ?? 0) + 1}
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
                onClick={handleNewGrowthRecord}>
                  Add Growth Record
              </button>
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

export default GrowthRecordTable;