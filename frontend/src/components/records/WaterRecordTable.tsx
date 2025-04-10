import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table } from 'react-bootstrap';
import { Plant } from '../../models/plant';
import { WaterRecord } from '../../models/water';
import { api } from '../../redux/api';
import {
  fetchWaterRecordsStart,
  fetchWaterRecordsSuccess,
  fetchWaterRecordsFailure,
  addWaterRecord,
  removeWaterRecord,
  updateWaterRecord,
} from '../../redux/records/waterRecord';
import { toast } from 'react-toastify';

const WaterRecordTable = () => {
  const selectedPlant = useSelector(
    (state: { plant: { selectedPlant: Plant } }) => state.plant.selectedPlant
  );

  const {data: waterRecords, isLoading, isError, error, refetch} = api.useGetWaterRecordsQuery(selectedPlant?.id, { skip: !selectedPlant });
  const [
    createRecord,
    {
      isSuccess: addSuccess,
      isError: addError,
      error: addErrorDetails,
      reset: addReset,
    },
  ] = api.useAddWaterRecordMutation();
  const dispatch = useDispatch();

  const [
    updateRecord,
    {
      isSuccess: updateSuccess,
      isError: updateError,
      error: updateErrorDetails,
      reset: updateReset,
    },
  ] = api.useUpdateWaterRecordMutation();

  const [
    deleteRecord,
    {
      isSuccess: deleteSuccess,
      isError: deleteError,
      error: deleteErrorDetails,
      reset: deleteReset,
    },
  ] = api.useDeleteWaterRecordMutation();

  useEffect(() => {
    if(isLoading) {
      dispatch(fetchWaterRecordsStart());
    }
    if(isError) {
      console.log(error);
      dispatch(fetchWaterRecordsFailure(error as string));
    }
    if(waterRecords) {
      dispatch(fetchWaterRecordsSuccess(waterRecords));
    }
  }, [waterRecords, dispatch, error, isError, isLoading]);

  useEffect(() => {
    if(addSuccess){
      toast.success("Water record added successfully!");
      addReset();
    }
    if(addError){
      toast.error("Error adding water record: " + addErrorDetails);
      addReset();
    }
  }, [addSuccess, addReset, addError, addErrorDetails]);

  useEffect(() => {
    if(updateSuccess){
      toast.success("Water record updated successfully!");
      updateReset();
      setIsEditingRecordId(null);
      refetch();
    }
    if(updateError){
      toast.error("Error updating water record: " + updateErrorDetails);
      updateReset();
    }
  }, [updateSuccess, updateReset, updateError, updateErrorDetails]);

  useEffect(() => {
    if(deleteSuccess){
      toast.success("Water record deleted successfully!");
      deleteReset();
    }
    if(deleteError){
      toast.error("Error deleting water record: " + deleteErrorDetails);
      deleteReset();
    }
  }, [deleteSuccess, deleteReset, deleteError, deleteErrorDetails]);

  const [isAddingWaterRecord, setIsAddingWaterRecord] = useState(false);
  const [newWaterRecord, setNewWaterRecord] = useState({
    id: 0,
    created_: "",
    amount: "",
  });
  const [isEditingRecordId, setIsEditingRecordId] = useState<number | null>(null);
  const [editedRecord, setEditedRecord] = useState<WaterRecord | null>(null);

  const handleNewWaterRecord = () => {
    setIsAddingWaterRecord(true);
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewWaterRecord({
      ...newWaterRecord,
      [name]: value,
    });
  }

  const handleSubmitNewWaterRecord = async () => {
    setIsAddingWaterRecord(false);
    const waterRecord: WaterRecord = {
      id: 0,
      created_: new Date(newWaterRecord.created_),
      amount: Number(newWaterRecord.amount),
      plant: selectedPlant.id,
      uom: 6,
      date: new Date(newWaterRecord.created_),
      updated_: new Date(),
    };

    try{
      await createRecord({plantId: selectedPlant.id, waterRecord});
      dispatch(addWaterRecord(waterRecord));
      setNewWaterRecord({
        id: 0,
        created_: "",
        amount: "",
      });
      refetch(); // should be a better way to update table without refreshing than this
    } catch(error){
      console.error("Error creating water record:", error);
    }
  }

  const handleEditClick = (record: WaterRecord) => {
    setIsEditingRecordId(record.id);
    setEditedRecord({...record});
  }

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if(editedRecord){
      setEditedRecord({
        ...editedRecord,
        [name]: name === "amount" ? Number(value) : value,
      });
    }
  };

  const handleSubmitEditRecord = async () => {
    if(editedRecord){
      try {
        await updateRecord({plantId: selectedPlant.id, waterRecord: editedRecord});
        dispatch(updateWaterRecord(editedRecord));
        setEditedRecord(null);
        setIsEditingRecordId(null);
        refetch(); // should be a better way to update table without refreshing than this
      } catch (error) {
        console.error("Error updating water record:", error);
      }
    }
  };

  const onDelete = (id: number) => {
    deleteRecord({plantId: selectedPlant.id, waterRecordId: id});
    dispatch(removeWaterRecord(id.toString()));
    refetch(); // should be a better way to update table without refreshing than this
  }

  return (
    <Table striped bordered hover className="text-center">
      <thead>
        <tr>
          <th>#</th>
          <th>Created At</th>
          <th>Amount (ml)</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {waterRecords?.map((record, index) => (
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
                    name="amount"
                    value={editedRecord?.amount ?? ""}
                    onChange={handleEditInputChange}
                    className="form-control"
                    placeholder="Amount in ml"
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
                  <td>{record.amount} ml</td>
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
        {isAddingWaterRecord ? (
          <tr>
            <td>
              <input
                type="number"
                name="id"
                value={(waterRecords?.length ?? 0) + 1}
                readOnly
                className="form-control"
              />
            </td>
            <td>
              <input
                type="date"
                name="created_"
                value={newWaterRecord.created_}
                onChange={handleInputChange}
                className="form-control"
              />
            </td>
            <td>
              <input
                type="number"
                name="amount"
                value={newWaterRecord.amount}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Amount in ml"
              />
            </td>
            <td>
              <button
                className="btn btn-success m-1"
                onClick={handleSubmitNewWaterRecord}>
                  Submit
              </button>
              <button
                className="btn btn-secondary m-1"
                onClick={() => setIsAddingWaterRecord(false)}>
                  Cancel
              </button>
            </td>
          </tr>
        ) : (
          <tr>
            <td colSpan={4}>
              <button
                className="btn btn-primary m-3 auto-align-end"
                onClick={handleNewWaterRecord}>
                  Add Water Record
              </button>
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  );
}

export default WaterRecordTable;