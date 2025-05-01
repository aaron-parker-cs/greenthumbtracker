import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HumidityRecord } from '../../models/humidity';

interface humidityRecords {
  humidityRecords: HumidityRecord[];
  loading: boolean;
  error: string | null;
  selectedRecord: HumidityRecord | undefined;
}

const initialState: humidityRecords = {
  humidityRecords: [],
  loading: false,
  error: null,
  selectedRecord: undefined,
};

const humidityRecordSlice = createSlice({
  name: 'humidityRecord',
  initialState,
  reducers: {
    fetchHumidityRecordsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchHumidityRecordsSuccess(state, action: PayloadAction<HumidityRecord[]>) {
      state.loading = false;
      state.humidityRecords = action.payload;
    },
    fetchHumidityRecordsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    selectHumidityRecord(state, action: PayloadAction<HumidityRecord | undefined>) {
      state.selectedRecord = action.payload;
    },
    addHumidityRecord(state, action: PayloadAction<HumidityRecord>) {
      state.humidityRecords.push(action.payload);
    },
    removeHumidityRecord(state, action: PayloadAction<string>) {
      state.humidityRecords = state.humidityRecords.filter(
        (record) => record.id !== Number(action.payload)
      );
    },
    updateHumidityRecord(state, action: PayloadAction<HumidityRecord>) {
      const index = state.humidityRecords.findIndex(
        (record) => record.id === action.payload.id
      );
      if (index !== -1) {
        state.humidityRecords[index] = action.payload;
      }
    },
  },
});

export const {
  fetchHumidityRecordsStart,
  fetchHumidityRecordsSuccess,
  fetchHumidityRecordsFailure,
  selectHumidityRecord,
  addHumidityRecord,
  removeHumidityRecord,
  updateHumidityRecord,
} = humidityRecordSlice.actions;

export default humidityRecordSlice.reducer;