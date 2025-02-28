import { useEffect, useState } from "react";
import PlantEditModal from "../components/plants/PlantEditModal";
import PlantsTable from "../components/plants/PlantsTable";
import { useDispatch, useSelector } from "react-redux";
import { Plant } from "../models/plant";
import { api } from "../redux/api";
import { Spinner } from "react-bootstrap";
import {
  fetchPlantsFailure,
  fetchPlantsStart,
  fetchPlantsSuccess,
  addPlant,
  updatePlant,
  removePlant,
  selectPlant,
} from "../redux/plant/slice";
import { toast } from "react-toastify";

const PlantPage = () => {
  const { data: plants, isLoading, isError, error } = api.useGetPlantsQuery();
  const [
    addPlantMutation,
    {
      isSuccess: addSuccess,
      isLoading: addInProgress,
      isError: addError,
      error: addErrorDetails,
      reset: addReset,
    },
  ] = api.useAddPlantMutation();
  const [
    updatePlantMutation,
    {
      isSuccess: updateSuccess,
      isLoading: updateInProgress,
      isError: updateError,
      error: updateErrorDetails,
      reset: updateReset,
    },
  ] = api.useUpdatePlantMutation();
  const [
    deletePlantMutation,
    {
      isSuccess: deleteSuccess,
      isLoading: deleteInProgress,
      isError: deleteError,
      error: deleteErrorDetails,
      reset: deleteReset,
    },
  ] = api.useDeletePlantMutation();

  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch();
  const selectedPlant = useSelector(
    (state: { plant: { selectedPlant: Plant } }) => state.plant.selectedPlant
  );

  useEffect(() => {
    if (isLoading) {
      dispatch(fetchPlantsStart());
    }
    if (isError) {
      console.log(error);
      dispatch(fetchPlantsFailure(error as string));
    }
    if (plants) {
      dispatch(fetchPlantsSuccess(plants));
    }
  }, [plants, dispatch, error, isError, isLoading]);

  useEffect(() => {
    if (addSuccess) {
      toast.success("Plant added successfully");
      addReset();
      setShowModal(false);
    }
    if (addError) {
      toast.error(`An error occurred: ${addErrorDetails}`);
      addReset();
    }
  }, [addSuccess, addReset, addError, addErrorDetails]);

  useEffect(() => {
    if (updateSuccess) {
      toast.success("Plant updated successfully");
      updateReset();
      setShowModal(false);
    }
    if (updateError) {
      toast.error(`An error occurred: ${updateErrorDetails}`);
      updateReset();
    }
  }, [updateSuccess, updateReset, updateError, updateErrorDetails]);

  useEffect(() => {
    if (deleteSuccess) {
      toast.success("Plant deleted successfully");
      deleteReset();
    }
    if (deleteError) {
      toast.error(`An error occurred: ${deleteErrorDetails}`);
      deleteReset();
    }
  }, [deleteSuccess, deleteReset, deleteError, deleteErrorDetails]);

  const isAnyLoading =
    isLoading || addInProgress || updateInProgress || deleteInProgress;

  const handleNewPlant = () => {
    dispatch(selectPlant(undefined));
    setShowModal(true);
  };

  const onEdit = (id: number) => {
    const plantWithId = plants?.find((plant) => plant.id === id);
    if (!plantWithId) {
      console.error(`Plant with id ${id} not found`);
      toast.error("An error occurred. Please try again.");
      return;
    }
    dispatch(selectPlant(plantWithId));
    setShowModal(true);
  };

  const onDelete = (id: number) => {
    deletePlantMutation(id);
    dispatch(removePlant(id.toString()));
  };

  const onHide = () => {
    setShowModal(false);
  };

  const onSave = (plant: Plant) => {
    if (plant.id === 0) {
      addPlantMutation(plant);
      dispatch(addPlant(plant));
    } else {
      updatePlantMutation(plant);
      dispatch(updatePlant(plant));
    }
  };

  return (
    <div className="foreground-container">
      <div className="d-flex w-100 mt-3">
        <h1 className="center-heading">Your Plants</h1>
        <button
          className="btn btn-primary m-3 auto-align-end"
          onClick={handleNewPlant}
        >
          Add New Plant
        </button>
      </div>
      <PlantEditModal
        plant={selectedPlant}
        show={showModal}
        onHide={onHide}
        onSave={onSave}
      />
      {isAnyLoading && (
        <div className="overlay">
          <Spinner animation="border" />
        </div>
      )}
      {isError && <p>{JSON.stringify(error)}</p>}
      {plants && (
        <PlantsTable plants={plants} onEdit={onEdit} onDelete={onDelete} />
      )}
    </div>
  );
};

export default PlantPage;
