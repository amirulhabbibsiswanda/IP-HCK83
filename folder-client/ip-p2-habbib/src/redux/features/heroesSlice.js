import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../lib/http';

// Async thunk untuk mengambil semua heroes
export const fetchHeroes = createAsyncThunk(
  'heroes/fetchHeroes',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axiosInstance.get("/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Terjadi kesalahan saat mengambil data heroes');
    }
  }
);

// Async thunk untuk menambahkan hero ke favorit
export const addToFavourite = createAsyncThunk(
  'heroes/addToFavourite',
  async (heroId, { rejectWithValue, dispatch }) => {
    try {
      await axiosInstance.post(`/heroes/${heroId}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`
        }
      });
      // Setelah berhasil menambahkan ke favorit, ambil kembali daftar heroes
      dispatch(fetchHeroes());
      return heroId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Terjadi kesalahan saat menambahkan hero ke favorit');
    }
  }
);

const heroesSlice = createSlice({
  name: 'heroes',
  initialState: {
    heroes: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handle fetchHeroes
      .addCase(fetchHeroes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHeroes.fulfilled, (state, action) => {
        state.loading = false;
        state.heroes = action.payload;
      })
      .addCase(fetchHeroes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle addToFavourite
      .addCase(addToFavourite.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToFavourite.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(addToFavourite.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default heroesSlice.reducer;