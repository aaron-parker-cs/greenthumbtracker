import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GrowthRecord } from '../../models/growth';

interface growthRecords {
  growthRecords: GrowthRecord[];
  loading: boolean;
  error: string | null;
  selectedRecord: GrowthRecord | undefined;
}

const initialState: growthRecords = {
  growthRecords: [],
  loading: false,
  error: null,
  selectedRecord: undefined,
};

const growthRecordSlice = createSlice({
  name: 'growthRecord',
  initialState,
  reducers: {
    fetchGrowthRecordsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchGrowthRecordsSuccess(state, action: PayloadAction<GrowthRecord[]>) {
      state.loading = false;
      state.growthRecords = action.payload;
    },
    fetchGrowthRecordsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    selectGrowthRecord(state, action: PayloadAction<GrowthRecord | undefined>) {
      state.selectedRecord = action.payload;
    },
    addGrowthRecord(state, action: PayloadAction<GrowthRecord>) {
      state.growthRecords.push(action.payload);
    },
    removeGrowthRecord(state, action: PayloadAction<string>) {
      state.growthRecords = state.growthRecords.filter(
        (record) => record.id !== Number(action.payload)
      );
    },
    updateGrowthRecord(state, action: PayloadAction<GrowthRecord>) {
      const index = state.growthRecords.findIndex(
        (record) => record.id === action.payload.id
      );
      if (index !== -1) {
        state.growthRecords[index] = action.payload;
      }
    },
  },
});

export const {
  fetchGrowthRecordsStart,
  fetchGrowthRecordsSuccess,
  fetchGrowthRecordsFailure,
  selectGrowthRecord,
  addGrowthRecord,
  removeGrowthRecord,
  updateGrowthRecord,
} = growthRecordSlice.actions;

export default growthRecordSlice.reducer;