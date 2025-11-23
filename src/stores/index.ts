import { configureStore } from '@reduxjs/toolkit';
import auth from './authSlice';

export type AppDispatch = typeof store.dispatch;

export const store = configureStore({
  reducer: {
    auth,
  },
});

export type RootState = ReturnType<typeof store.getState>;
