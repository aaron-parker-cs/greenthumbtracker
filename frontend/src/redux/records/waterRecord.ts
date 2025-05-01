import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WaterRecord } from '../../models/water';

interface waterRecords {
  waterRecords: WaterRecord[];
  loading: boolean;
  error: string | null;
  selectedRecord: WaterRecord | undefined;
}

const initialState: waterRecords = {
  waterRecords: [],
  loading: false,
  error: null,
  selectedRecord: undefined,
};

const waterRecordSlice = createSlice({
  name: 'waterRecord',
  initialState,
  reducers: {
    fetchWaterRecordsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchWaterRecordsSuccess(state, action: PayloadAction<WaterRecord[]>) {
      state.loading = false;
      state.waterRecords = action.payload;
    },
    fetchWaterRecordsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    selectWaterRecord(state, action: PayloadAction<WaterRecord | undefined>) {
      state.selectedRecord = action.payload;
    },
    addWaterRecord(state, action: PayloadAction<WaterRecord>) {
      state.waterRecords.push(action.payload);
    },
    removeWaterRecord(state, action: PayloadAction<string>) {
      state.waterRecords = state.waterRecords.filter(
        (record) => record.id !== Number(action.payload)
      );
    },
    updateWaterRecord(state, action: PayloadAction<WaterRecord>) {
      const index = state.waterRecords.findIndex(
        (record) => record.id === action.payload.id
      );
      if (index !== -1) {
        state.waterRecords[index] = action.payload;
      }
    },
  },
});

export const {
  fetchWaterRecordsStart,
  fetchWaterRecordsSuccess,
  fetchWaterRecordsFailure,
  selectWaterRecord,
  addWaterRecord,
  removeWaterRecord,
  updateWaterRecord,
} = waterRecordSlice.actions;

export default waterRecordSlice.reducer;