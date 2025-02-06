import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
  id: string;
  username: string;
  email: string;
  isAuthenticated: boolean;
}

export const initialState: UserState = {
    id: '',
    username: '',
    email: '',
    isAuthenticated: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        login: (state, action: PayloadAction<UserState>) =>{
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.email = action.payload.email;
            state.isAuthenticated = true;
        },
        logout: (state) => {
            state.id = '';
            state.username = '';
            state.email = '';
            state.isAuthenticated = false;
        },
    },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
