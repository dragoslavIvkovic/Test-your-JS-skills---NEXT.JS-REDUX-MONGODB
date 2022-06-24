/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

export const collectionSlice = createSlice({
  name: 'levels',
  initialState: {
    value: '',
  },
  reducers: {
    setLevel: (state,action) => {
      state.value = action.payload;
    },
  },
});

export const { setLevel } = collectionSlice.actions;

export const selectCount = (state) => state.levels.value;

export default collectionSlice.reducer;
