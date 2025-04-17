import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Table } from 'react-bootstrap';
import { api } from '../../redux/api';
import { toast } from 'react-toastify';

interface GenericRecordTableProps {
  // redux state methods
  fetchRecordStart: Function;
  fetchRecordSuccess: Function;
  fetchRecordFailure: Function;
  stateAddRecord: (record: any) => void;
  stateRemoveRecord: (id: number) => void;
  stateUpdateRecord: (record: any) => void;
  
  // API methods
  ApiGetRecords: (plantId: number, options?: { skip: boolean }) => {
    data: any[] | undefined;
    isLoading: boolean;
    isError: boolean;
    error: string | null;
    refetch: () => void;
  };
  ApiAddRecord: () => [
    createRecord: (plantId: number, record: any) => Promise<any>,
    {
      isSuccess: boolean;
      isError: boolean;
      error: string | null;
      reset: () => void;
    }
  ];
  ApiUpdateRecord: () => [
    updateRecord: (plantId: number, record: any) => Promise<any>,
    {
      isSucess: boolean;
      isError: boolean;
      error: string | null;
      reset: () => void;
    }
  ];
  ApiDeleteRecord: () => [
    deleteRecord: (plantId: number, recordId: number) => Promise<any>,
    {
      isSuccess: boolean;
      isError: boolean;
      error: string | null;
      reset: () => void;
    }
  ];

  // Table columns
  recordedValueName: string; // height, amount, temperature, etc.
}

const GenericRecordTable: React.FC<GenericRecordTableProps> = ({
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
  recordedValueName,
}) => {
  // variables
  const selectedPlant = useSelector(
    (state: { plant: { selectedPlant: any } }) => state.plant.selectedPlant
  );
  const {data: records, isLoading, isError, error, refetch} = ApiGetRecords(selectedPlant?.id, { skip: !selectedPlant });
  const dispatch = useDispatch();

  // state variables
  const [newRecord, setNewRecord] = useState({
    // TODO figure out values to put here for multiple record types
  });
  const [isAddingRecord, setIsAddingRecord] = useState<boolean>(false);
  const [isEditingRecordId, setIsEditingRecordId] = useState<number | null>(null);
  const [editedRecord, setEditedRecord] = useState<any | null>(null);

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

  };

  const handleSubmitNewRecord = async () => {

  };

  const handleEditClick = (record: any) => {

  };

  const handleEditInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

  };

  const handleSubmitEditRecord = async () => {

  };

  const onDelete = async (id: number) => {

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
    </Table>
  )


};

export default GenericRecordTable;