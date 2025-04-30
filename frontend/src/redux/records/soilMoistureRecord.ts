import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SoilMoistureRecord } from '../../models/soilMoisture';

interface soilMoistureRecords {
  soilMoistureRecords: SoilMoistureRecord[];
  loading: boolean;
  error: string | null;
  selectedRecord: SoilMoistureRecord | undefined;
}

const initialState: soilMoistureRecords = {
  soilMoistureRecords: [],
  loading: false,
  error: null,
  selectedRecord: undefined,
};

const soilMoistureRecordSlice = createSlice({
  name: 'soilMoistureRecord',
  initialState,
  reducers: {
    fetchSoilMoistureRecordsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchSoilMoistureRecordsSuccess(state, action: PayloadAction<SoilMoistureRecord[]>) {
      state.loading = false;
      state.soilMoistureRecords = action.payload;
    },
    fetchSoilMoistureRecordsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    selectSoilMoistureRecord(state, action: PayloadAction<SoilMoistureRecord | undefined>) {
      state.selectedRecord = action.payload;
    },
    addSoilMoistureRecord(state, action: PayloadAction<SoilMoistureRecord>) {
      state.soilMoistureRecords.push(action.payload);
    },
    removeSoilMoistureRecord(state, action: PayloadAction<string>) {
      state.soilMoistureRecords = state.soilMoistureRecords.filter(
        (record) => record.id !== Number(action.payload)
      );
    },
    updateSoilMoistureRecord(state, action: PayloadAction<SoilMoistureRecord>) {
      const index = state.soilMoistureRecords.findIndex(
        (record) => record.id === action.payload.id
      );
      if (index !== -1) {
        state.soilMoistureRecords[index] = action.payload;
      }
    },
  },
});

export const {
  fetchSoilMoistureRecordsStart,
  fetchSoilMoistureRecordsSuccess,
  fetchSoilMoistureRecordsFailure,
  selectSoilMoistureRecord,
  addSoilMoistureRecord,
  removeSoilMoistureRecord,
  updateSoilMoistureRecord,
} = soilMoistureRecordSlice.actions;

export default soilMoistureRecordSlice.reducer;