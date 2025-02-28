import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Plant } from "../../models/plant";

interface PlantState {
  plants: Plant[];
  selectedPlant: Plant | undefined;
  loading: boolean;
  error: string | null;
}

const initialState: PlantState = {
  plants: [],
  selectedPlant: undefined,
  loading: false,
  error: null,
};

const plantSlice = createSlice({
  name: "plant",
  initialState,
  reducers: {
    fetchPlantsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchPlantsSuccess(state, action: PayloadAction<Plant[]>) {
      state.loading = false;
      state.plants = action.payload;
    },
    fetchPlantsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    selectPlant(state, action: PayloadAction<Plant | undefined>) {
      state.selectedPlant = action.payload;
    },
    addPlant(state, action: PayloadAction<Plant>) {
      state.plants.push(action.payload);
    },
    removePlant(state, action: PayloadAction<string>) {
      state.plants = state.plants.filter(
        (plant) => plant.id !== Number(action.payload)
      );
    },
    updatePlant(state, action: PayloadAction<Plant>) {
      const index = state.plants.findIndex(
        (plant) => plant.id === action.payload.id
      );
      if (index !== -1) {
        state.plants[index] = action.payload;
      }
    },
  },
});

export const {
  fetchPlantsStart,
  fetchPlantsSuccess,
  fetchPlantsFailure,
  selectPlant,
  addPlant,
  removePlant,
  updatePlant,
} = plantSlice.actions;

export default plantSlice.reducer;
