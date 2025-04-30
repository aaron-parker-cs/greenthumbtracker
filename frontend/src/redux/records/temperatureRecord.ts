import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TemperatureRecord } from '../../models/temperature';

interface temperatureRecords {
  temperatureRecords: TemperatureRecord[];
  loading: boolean;
  error: string | null;
  selectedRecord: TemperatureRecord | undefined;
}

const initialState: temperatureRecords = {
  temperatureRecords: [],
  loading: false,
  error: null,
  selectedRecord: undefined,
};

const temperatureRecordSlice = createSlice({
  name: 'temperatureRecord',
  initialState,
  reducers: {
    fetchTemperatureRecordsStart(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTemperatureRecordsSuccess(state, action: PayloadAction<TemperatureRecord[]>) {
      state.loading = false;
      state.temperatureRecords = action.payload;
    },
    fetchTemperatureRecordsFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    selectTemperatureRecord(state, action: PayloadAction<TemperatureRecord | undefined>) {
      state.selectedRecord = action.payload;
    },
    addTemperatureRecord(state, action: PayloadAction<TemperatureRecord>) {
      state.temperatureRecords.push(action.payload);
    },
    removeTemperatureRecord(state, action: PayloadAction<string>) {
      state.temperatureRecords = state.temperatureRecords.filter(
        (record) => record.id !== Number(action.payload)
      );
    },
    updateTemperatureRecord(state, action: PayloadAction<TemperatureRecord>) {
      const index = state.temperatureRecords.findIndex(
        (record) => record.id === action.payload.id
      );
      if (index !== -1) {
        state.temperatureRecords[index] = action.payload;
      }
    },
  },
});

export const {
  fetchTemperatureRecordsStart,
  fetchTemperatureRecordsSuccess,
  fetchTemperatureRecordsFailure,
  selectTemperatureRecord,
  addTemperatureRecord,
  removeTemperatureRecord,
  updateTemperatureRecord,
} = temperatureRecordSlice.actions;

export default temperatureRecordSlice.reducer;