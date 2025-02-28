import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { logout, UserState } from "./user/slice";
import { Plant } from "../models/plant";
import { Credential } from "../models/credential";

const port = import.meta.env.API_PORT || 8800;
const baseUrl = `http://localhost:${port}/api`;

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
  }),
});
