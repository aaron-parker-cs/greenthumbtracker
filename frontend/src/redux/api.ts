import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, UserState } from "./user/slice";
import { Plant } from "../models/plant";
import { Credential } from "../models/credential";
import { GrowthRecord } from "../models/growth";
import { WaterRecord } from "../models/water";
import { TemperatureRecord } from "../models/temperature";
import { HumidityRecord } from "../models/humidity";
import { LightRecord } from "../models/light";
import { SoilMoistureRecord } from "../models/soilMoisture";
import { ApiStatus } from "../models/status";
import { LocationData, OpenWeatherApiResponse } from "../models/weather";

const baseUrl = `/api`;

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    credentials: "include",
  }),
  tagTypes: ["Plants", "Weather"],
  endpoints: (builder) => ({
    health: builder.query<ApiStatus, void>({
      query: () => "/health",
    }),
    login: builder.mutation<UserState, Credential>({
      query: (credentials: Credential) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<void, Credential>({
      query: (credentials: Credential) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/auth/logout",
        method: "POST",
      }),
      onQueryStarted: (_, { dispatch }) => {
        dispatch(logout());
      },
    }),
    verifyEmail: builder.mutation<void, string>({
      query: (token: string) => ({
        url: `/auth/verify-email?token=${token}`,
        method: "POST",
      }),
    }),
    forgotPassword: builder.mutation<void, string>({
      query: (email: string) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: { email },
      }),
    }),
    resetPassword: builder.mutation<void, { token: string; password: string }>({
      query: ({ token, password }) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: { token, password },
      }),
    }),
    getWeather: builder.query<OpenWeatherApiResponse, void>({
      query: () => "/weather",
      providesTags: ["Weather"],
    }),
    setWeatherLocation: builder.mutation<void, { city: string }>({
      query: ({ city }) => ({
        url: "/weather/location/city",
        method: "POST",
        body: { city },
      }),
      invalidatesTags: ["Weather"],
    }),
    getUserLocation: builder.query<LocationData, void>({
      query: () => "/weather/location/city",
      providesTags: ["Weather"],
    }),
    getPlants: builder.query<Plant[], void>({
      query: () => "/plants",
      providesTags: ["Plants"],
    }),
    getPlantById: builder.query<Plant, number>({
      query: (id) => `/plants/${id}`,
    }),
    addPlant: builder.mutation<void, Plant>({
      query: (newPlant: Plant) => ({
        url: "/plants",
        method: "POST",
        body: newPlant,
      }),
      invalidatesTags: ["Plants"],
    }),
    updatePlant: builder.mutation<void, Plant>({
      query: (updatedPlant: Plant) => ({
        url: `/plants/${updatedPlant.id}`,
        method: "PUT",
        body: updatedPlant,
      }),
      invalidatesTags: ["Plants"],
    }),
    deletePlant: builder.mutation<void, number>({
      query: (id) => ({
        url: `/plants/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Plants"],
    }),
    getGrowthRecords: builder.query<GrowthRecord[], number>({
      query: (plantId) => `/growth/${plantId}`,
    }),
    addGrowthRecord: builder.mutation<
      void,
      { plantId: number; growthRecord: GrowthRecord }
    >({
      query: ({ plantId, growthRecord }) => ({
        url: `/growth/${plantId}`,
        method: "POST",
        body: growthRecord,
      }),
    }),
    updateGrowthRecord: builder.mutation<
      void,
      { plantId: number; growthRecord: GrowthRecord }
    >({
      query: ({ plantId, growthRecord }) => ({
        url: `/growth/${plantId}/${growthRecord.id}`,
        method: "PUT",
        body: growthRecord,
      }),
    }),
    deleteGrowthRecord: builder.mutation<
      void,
      { plantId: number; growthRecordId: number }
    >({
      query: ({ plantId, growthRecordId }) => ({
        url: `/growth/${plantId}/${growthRecordId}`,
        method: "DELETE",
      }),
    }),
    getWaterRecords: builder.query<WaterRecord[], number>({
      query: (plantId) => `/water/${plantId}`,
    }),
    addWaterRecord: builder.mutation<
      void,
      { plantId: number; waterRecord: WaterRecord }
    >({
      query: ({ plantId, waterRecord }) => ({
        url: `/water/${plantId}`,
        method: "POST",
        body: waterRecord,
      }),
    }),
    updateWaterRecord: builder.mutation<
      void,
      { plantId: number; waterRecord: WaterRecord }
    >({
      query: ({ plantId, waterRecord }) => ({
        url: `/water/${plantId}/${waterRecord.id}`,
        method: "PUT",
        body: waterRecord,
      }),
    }),
    deleteWaterRecord: builder.mutation<
      void,
      { plantId: number; waterRecordId: number }
    >({
      query: ({ plantId, waterRecordId }) => ({
        url: `/water/${plantId}/${waterRecordId}`,
        method: "DELETE",
      }),
    }),
    getTemperatureRecords: builder.query<TemperatureRecord[], number>({
      query: (plantId) => `/temperature/${plantId}`,
    }),
    addTemperatureRecord: builder.mutation<
      void,
      { plantId: number; temperatureRecord: TemperatureRecord }
    >({
      query: ({ plantId, temperatureRecord }) => ({
        url: `/temperature/${plantId}`,
        method: "POST",
        body: temperatureRecord,
      }),
    }),
    updateTemperatureRecord: builder.mutation<
      void,
      { plantId: number; temperatureRecord: TemperatureRecord }
    >({
      query: ({ plantId, temperatureRecord }) => ({
        url: `/temperature/${plantId}/${temperatureRecord.id}`,
        method: "PUT",
        body: temperatureRecord,
      }),
    }),
    deleteTemperatureRecord: builder.mutation<
      void,
      { plantId: number; temperatureRecordId: number }
    >({
      query: ({ plantId, temperatureRecordId }) => ({
        url: `/temperature/${plantId}/${temperatureRecordId}`,
        method: "DELETE",
      }),
    }),
    getHumidityRecords: builder.query<HumidityRecord[], number>({
      query: (plantId) => `/humidity/${plantId}`,
    }),
    addHumidityRecord: builder.mutation<
      void,
      { plantId: number; humidityRecord: HumidityRecord }
    >({
      query: ({ plantId, humidityRecord }) => ({
        url: `/humidity/${plantId}`,
        method: "POST",
        body: humidityRecord,
      }),
    }),
    updateHumidityRecord: builder.mutation<
      void,
      { plantId: number; humidityRecord: HumidityRecord }
    >({
      query: ({ plantId, humidityRecord }) => ({
        url: `/humidity/${plantId}/${humidityRecord.id}`,
        method: "PUT",
        body: humidityRecord,
      }),
    }),
    deleteHumidityRecord: builder.mutation<
      void,
      { plantId: number; humidityRecordId: number }
    >({
      query: ({ plantId, humidityRecordId }) => ({
        url: `/humidity/${plantId}/${humidityRecordId}`,
        method: "DELETE",
      }),
    }),
    getLightRecords: builder.query<LightRecord[], number>({
      query: (plantId) => `/light/${plantId}`,
    }),
    addLightRecord: builder.mutation<
      void,
      { plantId: number; lightRecord: LightRecord }
    >({
      query: ({ plantId, lightRecord }) => ({
        url: `/light/${plantId}`,
        method: "POST",
        body: lightRecord,
      }),
    }),
    updateLightRecord: builder.mutation<
      void,
      { plantId: number; lightRecord: LightRecord }
    >({
      query: ({ plantId, lightRecord }) => ({
        url: `/light/${plantId}/${lightRecord.id}`,
        method: "PUT",
        body: lightRecord,
      }),
    }),
    deleteLightRecord: builder.mutation<
      void,
      { plantId: number; lightRecordId: number }
    >({
      query: ({ plantId, lightRecordId }) => ({
        url: `/light/${plantId}/${lightRecordId}`,
        method: "DELETE",
      }),
    }),
    getSoilMoistureRecords: builder.query<SoilMoistureRecord[], number>({
      query: (plantId) => `/soil-moisture/${plantId}`,
    }),
    addSoilMoistureRecord: builder.mutation<
      void,
      { plantId: number; soilMoistureRecord: SoilMoistureRecord }
    >({
      query: ({ plantId, soilMoistureRecord }) => ({
        url: `/soil-moisture/${plantId}`,
        method: "POST",
        body: soilMoistureRecord,
      }),
    }),
    updateSoilMoistureRecord: builder.mutation<
      void,
      { plantId: number; soilMoistureRecord: SoilMoistureRecord }
    >({
      query: ({ plantId, soilMoistureRecord }) => ({
        url: `/soil-moisture/${plantId}/${soilMoistureRecord.id}`,
        method: "PUT",
        body: soilMoistureRecord,
      }),
    }),
    deleteSoilMoistureRecord: builder.mutation<
      void,
      { plantId: number; soilMoistureRecordId: number }
    >({
      query: ({ plantId, soilMoistureRecordId }) => ({
        url: `/soil-moisture/${plantId}/${soilMoistureRecordId}`,
        method: "DELETE",
      }),
    }),
  }),
});
