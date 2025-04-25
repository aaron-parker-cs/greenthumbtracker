import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { UnknownAction } from 'redux';
import { PayloadAction } from '@reduxjs/toolkit';

interface GenericRecordTableProps<T> {
  // redux state methods
  fetchRecordStart: Function;
  fetchRecordSuccess: Function;
  fetchRecordFailure: Function;
  // stateAddRecord: (action: PayloadAction<T>) => UnknownAction;
  stateAddRecord: (record: T) => UnknownAction;
  stateRemoveRecord: (id: string) => UnknownAction;
  stateUpdateRecord: (record: T) => UnknownAction;
  
  // API methods
  // ApiGetRecords: (plantId: number, options?: { skip: boolean }) => {
  //   data: T[] | undefined;
  //   isLoading: boolean;
  //   isError: boolean;
  //   error: string | null;
  //   refetch: () => void;
  // };
  ApiGetRecords: Function;
  ApiAddRecord: Function;
  ApiUpdateRecord: Function;
  ApiDeleteRecord: Function;

  // Variables
  recordedValueName: string; // height, amount, temperature, etc.
  recordType: string; // waterRecord, growthRecord, soil_moistureRecord, etc.
  defaultRecord: T; // Defailt structure for a new record
}

const GenericRecordTable = <T extends {id: number; created_: Date}>({
  fetchRecordStart,
  fetchRecordSuccess,
  fetchRecordFailure,
  stateAddRecord,
  stateRemoveRecord,
  stateUpdateRecord,
  ApiGetRecords,
  ApiAddRecord,
  ApiUpdateRecord,
  ApiDeleteRecord,
  recordedValueName, // height, amount, temperature, etc.
  recordType, // waterRecord, growthRecord, soil_moistureRecord, etc.
  defaultRecord, // Defailt structure for a new record
}: GenericRecordTableProps<T>) => {
  // variables
  const selectedPlant = useSelector(
    (state: { plant: { selectedPlant: any } }) => state.plant.selectedPlant
  );
  const {data: records, isLoading, isError, error, refetch} = ApiGetRecords(selectedPlant?.id, { skip: !selectedPlant });
  const dispatch = useDispatch();

  // state variables
  const [newRecord, setNewRecord] = useState({
    value: "",
    created_: "",
    uom: 1,
    // TODO allow user to change uom when creating/editing
  });
  const [isAddingRecord, setIsAddingRecord] = useState<boolean>(false);
  const [isEditingRecordId, setIsEditingRecordId] = useState<number | null>(null);
  const [editedRecord, setEditedRecord] = useState<T | null>(null);

  // API add/update/remove hook result objects
  const [
    createRecord,
    {
      isSuccess: addSuccess,
      isError: addError,
      error: addErrorDetails,
      reset: addReset,
    },
  ] = ApiAddRecord();

  const [
    updateRecord,
    {
      isSuccess: updateSuccess,
      isError: updateError,
      error: updateErrorDetails,
      reset: updateReset,
    },
  ] = ApiUpdateRecord();

  const [
    deleteRecord,
    {
      isSuccess: deleteSuccess,
      isError: deleteError,
      error: deleteErrorDetails,
      reset: deleteReset,
    },
  ] = ApiDeleteRecord();

  // useEffects
  useEffect(() => {
    if(isLoading){
      dispatch(fetchRecordStart());
    }
    if(isError){
      console.log(error);
      dispatch(fetchRecordFailure(error as string));
    }
    if(records){
      dispatch(fetchRecordSuccess(records));
    }
  }, [records, dispatch, error, isError, isLoading]);

  useEffect(() => {
    if(addSuccess){
      toast.success("Record added successfully!");
      addReset();
    }
    if(addError){
      toast.error("Error adding record: " + addErrorDetails);
      addReset();
    }
  }, [addSuccess, addReset, addError, addErrorDetails]);

  useEffect(() => {
    if(updateSuccess){
      toast.success("Record updated successfully!");
      updateReset();
      setIsEditingRecordId(null);
      refetch();
    }
    if(updateError){
      toast.error("Error updating record: " + updateErrorDetails);
      updateReset();
    }
  }, [updateSuccess, updateReset, updateError, updateErrorDetails]);

  useEffect(() => {
    if(deleteSuccess){
      toast.success("Record deleted successfully!");
      deleteReset();
    }
    if(deleteError){
      toast.error("Error deleting record: " + deleteErrorDetails);
      deleteReset();
    }
  }, [deleteSuccess, deleteReset, deleteError, deleteErrorDetails]);

  // functions
  const handleNewRecord = () => {
    setIsAddingRecord(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewRecord({
      ...newRecord,
      [name]: value,
    });
  };

  const handleSubmitNewRecord = async () => {
    /*
    if record is growth or water then
      add growth/water record (id, plant, value, uom, date, created, updated)
    else create secondary record
      (id, plant, user, value, date)

    other record types were implemented with the user variable and without
    the created/updated timestamps so this is the easiest current solution
    */
    
    setIsAddingRecord(false);
    const submitNewRecord: T = {
      ...defaultRecord,
      plant: selectedPlant.id,
      date: newRecord.created_,
      [recordedValueName]: newRecord.value,
    }
    if("uom" in submitNewRecord){
      submitNewRecord["uom"] = newRecord.uom;
    }

    try{
      await createRecord({plantId: selectedPlant.id, [recordType]: submitNewRecord});
      dispatch(stateAddRecord(submitNewRecord));
      setNewRecord({
        value: "",
        created_: "",
        uom: 1,
      });
      refetch();
    } catch(error){
      console.error("Error created new record: ", error);
    }
  };

  const handleEditClick = (record: any) => {
    setIsEditingRecordId(record.id);
    setEditedRecord({...record});
  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    // console.log(name);
    // console.log(value);
    // console.log(selectedPlant);
    if(editedRecord){
      setEditedRecord({
        ...editedRecord,
        [name]: name === recordedValueName ? Number(value) : value,
      });
    }
  };

  const handleSubmitEditRecord = async () => {
    if(editedRecord){
      // console.log(editedRecord);
      // console.log(editedRecord.id);
      try{
        await updateRecord({plantId: selectedPlant.id, [recordType]: editedRecord});
        dispatch(stateUpdateRecord(editedRecord));
        setEditedRecord(null);
        setIsEditingRecordId(null);
        refetch();
      } catch(error){
        console.error("Error updating record: ", error);
      }
    }
  };

  const onDelete = async (id: number) => {
    await deleteRecord({plantId: selectedPlant.id, [recordType + "Id"]: id});
    dispatch(stateRemoveRecord(id.toString()));
    refetch();
  };

  // JSX
  return (
    <Table striped bordered hover className="text-center">
      <thead>
        <tr>
          <th>#</th>
          <th>Created At</th>
          <th>{recordedValueName}</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {records?.map((record: T, index: number) => (
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
                  {/* TODO get record value here, not always height 
                      same with placeholder value*/} 
                  <input
                    type="number"
                    name={recordedValueName}
                    value={editedRecord ? (editedRecord[recordedValueName as keyof T] as string | number | undefined) : ""}
                    onChange={handleEditInputChange}
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
                {/* TODO get record value here, not always height 
                    same with placeholder value*/} 
                <td>{record[recordedValueName as keyof T] as string | number | undefined} cm</td>
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
            )}
          </tr>
        ))}
        {isAddingRecord ? (
          <tr>
            <td>
              <input
                type="number"
                name="id"
                value={(records?.length ?? 0) + 1}
                readOnly
                className="form-control"
              />
            </td>
            <td>
              <input
                type="date"
                name="created_"
                value={newRecord.created_}
                onChange={handleInputChange}
                className="form-control"
              />
            </td>
            <td>
              {/* TODO get record value here, not always height 
                  same with placeholder value*/} 
              <input
                type="number"
                name="value"
                value={newRecord.value}
                onChange={handleInputChange}
                className="form-control"
                placeholder="Height in cm"
              />
            </td>
            <td>
              <button
                className="btn btn-success m-1"
                onClick={handleSubmitNewRecord}>
                  Submit
              </button>
              <button
                className="btn btn-secondary m-1"
                onClick={() => setIsAddingRecord(false)}>
                Cancel
              </button>
            </td>
          </tr>
        ) : (
          <tr>
            <td colSpan={4}>
              <button
                className="btn btn-primary m-3 auto-align-end"
                onClick={handleNewRecord}>
                  Add Record
              </button>
            </td>
          </tr>
        )}
      </tbody>
    </Table>
  )


};

export default GenericRecordTable;