import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { logout } from './user/slice';

const baseUrl = 'http://localhost:8800/api';

export const api = createApi({
    reducerPath: 'api',
    baseQuery: fetchBaseQuery({
        baseUrl: baseUrl,
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: (credentials) => ({
                url: '/auth/login',
                method: 'POST',
                body: credentials,
            }),
        }),
        register: builder.mutation({
            query: (credentials) => ({
                url: '/auth/register',
                method: 'POST',
                body: credentials,
            }),
        }),
        logout: builder.mutation({
            query: () => ({
                url: '/auth/logout',
                method: 'POST',
            }),
            onQueryStarted: (_, { dispatch }) => {
                dispatch(logout());
            },
        }),
        getPlants: builder.query({
            query: () => '/plants',
        }),
        getPlantById: builder.query({
            query: (id) => `/plants/${id}`,
        }),
        addPlant: builder.mutation({
            query: (newPlant) => ({
                url: '/plants',
                method: 'POST',
                body: newPlant,
            }),
        }),
        updatePlant: builder.mutation({
            query: ({ id, ...updatedPlant }) => ({
                url: `/plants/${id}`,
                method: 'PUT',
                body: updatedPlant,
            }),
        }),
        deletePlant: builder.mutation({
            query: (id) => ({
                url: `/plants/${id}`,
                method: 'DELETE',
            }),
        }),
    }),
});