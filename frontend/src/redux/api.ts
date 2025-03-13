import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, UserState } from "./user/slice";
import { Plant } from "../models/plant";
import { Credential } from "../models/credential";
import { GrowthRecord } from "../models/growth";
import { WaterRecord } from "../models/water";

const baseUrl = import.meta.env.API_URL || `http://localhost:8800`;

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: baseUrl,
    credentials: "include",
  }),
  tagTypes: ["Plants"],
  endpoints: (builder) => ({
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
  }),
});
