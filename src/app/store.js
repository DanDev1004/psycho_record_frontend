import { configureStore } from '@reduxjs/toolkit';
import authReducer from "../features/authSlice";
import titleSlice from '../features/titleSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    title: titleSlice
  },
});