import { configureStore } from '@reduxjs/toolkit';
import heroesReducer from './features/heroesSlice';
import authReducer from './features/authSlice';

export const store = configureStore({
  reducer: {
    heroes: heroesReducer,
    auth: authReducer
  },
});