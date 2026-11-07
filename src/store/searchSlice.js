import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { searchBrands, searchOffers } from '../api/favorit';

export const fetchBrands = createAsyncThunk('search/fetchBrands', (number) => searchBrands(number));

export const fetchOffers = createAsyncThunk('search/fetchOffers', ({ number, brand }) =>
  searchOffers(number, brand),
);

const initialState = {
  number: '',
  brands: { status: 'idle', items: [], error: null, requestId: null },
  selectedBrand: null,
  offers: { status: 'idle', items: [], error: null, requestId: null },
};

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    reset: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBrands.pending, (state, action) => {
        state.number = action.meta.arg;
        state.brands = { status: 'loading', items: [], error: null, requestId: action.meta.requestId };
        state.selectedBrand = null;
        state.offers = initialState.offers;
      })
      .addCase(fetchBrands.fulfilled, (state, action) => {
        if (state.brands.requestId !== action.meta.requestId) return;
        state.brands.status = 'succeeded';
        state.brands.items = action.payload;
      })
      .addCase(fetchBrands.rejected, (state, action) => {
        if (state.brands.requestId !== action.meta.requestId) return;
        state.brands.status = 'failed';
        state.brands.error = action.error.message;
      })
      .addCase(fetchOffers.pending, (state, action) => {
        state.selectedBrand = action.meta.arg.brand;
        state.offers = { status: 'loading', items: [], error: null, requestId: action.meta.requestId };
      })
      .addCase(fetchOffers.fulfilled, (state, action) => {
        if (state.offers.requestId !== action.meta.requestId) return;
        state.offers.status = 'succeeded';
        state.offers.items = action.payload;
      })
      .addCase(fetchOffers.rejected, (state, action) => {
        if (state.offers.requestId !== action.meta.requestId) return;
        state.offers.status = 'failed';
        state.offers.error = action.error.message;
      });
  },
});

export const { reset } = searchSlice.actions;
export default searchSlice.reducer;
