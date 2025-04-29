import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LightRecord } from '../../models/light';

interface lightRecords {
  lightRecords: LightRecord[];
  loading: boolean;
  error: string | null;
  selectedRecord: LightRecord | undefined;
}

const initialState: lightRecords = {
  lightRecords: [],
  loading: false,
  error: null,
  selectedRecord: undefined,
};

const lightRecordSlice = createSlice({
  name: 'lightRecord',
  initialState,
  reducers: {
    fetchLightRecordsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchLightRecordsSuccess(state, action: PayloadAction<LightRecord[]>) {
      state.loading = false;
      state.lightRecords = action.payload;
    },
    fetchLightRecordsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    selectLightRecord(state, action: PayloadAction<LightRecord | undefined>) {
      state.selectedRecord = action.payload;
    },
    addLightRecord(state, action: PayloadAction<LightRecord>) {
      state.lightRecords.push(action.payload);
    },
    removeLightRecord(state, action: PayloadAction<string>) {
      state.lightRecords = state.lightRecords.filter(
        (record) => record.id !== Number(action.payload)
      );
    },
    updateLightRecord(state, action: PayloadAction<LightRecord>) {
      const index = state.lightRecords.findIndex(
        (record) => record.id === action.payload.id
      );
      if (index !== -1) {
        state.lightRecords[index] = action.payload;
      }
    },
  },
});

export const {
  fetchLightRecordsStart,
  fetchLightRecordsSuccess,
  fetchLightRecordsFailure,
  selectLightRecord,
  addLightRecord,
  removeLightRecord,
  updateLightRecord,
} = lightRecordSlice.actions;

export default lightRecordSlice.reducer;