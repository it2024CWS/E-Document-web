import { ProfileModel } from '@/models/authModel';
import { AUTH_DATA_STORAGE } from '@/utils/constants/localStorage';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ProfileInterface {
  data: ProfileModel | null;
  loggedIn: boolean;
}

const storedAuthData = localStorage.getItem(AUTH_DATA_STORAGE);
const initialState: ProfileInterface = storedAuthData ? JSON.parse(storedAuthData) : { data: null, loggedIn: false };

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginFailed: (state: ProfileInterface) => {
      state.data = null;
      state.loggedIn = false;
      localStorage.removeItem(AUTH_DATA_STORAGE);
    },
    loginSuccess: (state: ProfileInterface, action: PayloadAction<ProfileModel>) => {
      state.data = action.payload;
      state.loggedIn = true;
      localStorage.setItem(AUTH_DATA_STORAGE, JSON.stringify(state));
    },
    logout: (state: ProfileInterface) => {
      localStorage.removeItem(AUTH_DATA_STORAGE);
      localStorage.removeItem('auth');
      state.data = null;
      state.loggedIn = false;
    },
  },
});

export const { loginSuccess, logout, loginFailed } = authSlice.actions;
export default authSlice.reducer;
