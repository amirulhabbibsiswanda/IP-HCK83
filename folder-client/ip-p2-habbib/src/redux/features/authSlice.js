import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/http';

// Async thunk untuk login
export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.post("/users/login", credentials);
      localStorage.setItem("access_token", data.access_token);
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Login gagal');
    }
  }
);

// Async thunk untuk upgrade status
export const upgradeStatus = createAsyncThunk(
  'auth/upgradeStatus',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('access_token');
      const { data } = await axiosInstance.get('/users/upgrade', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Gagal upgrade status');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    isAuthenticated: !!localStorage.getItem("access_token"),
    loading: false,
    error: null,
    upgradeUrl: null,
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem("access_token");
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle upgradeStatus
      .addCase(upgradeStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(upgradeStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.upgradeUrl = action.payload.url;
      })
      .addCase(upgradeStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;