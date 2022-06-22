/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  value: [],
};

export const wrongQueCounterSlice = createSlice({
  name: 'wrongQuestions',
  initialState,
  reducers: {
    addWrongQuestions: (state, action) => {
      //  state.push(action.payload)
      //  state.value += action.payload
      state.value = [...state.value, action.payload];
    },
    resetWrongQuestions: (state) => {
      state.value = [];
    },
  },
});

export const {
  addWrongQuestions,
  resetWrongQuestions,
} = wrongQueCounterSlice.actions;

export const selectWrongQuestions = (state) => state.wrongQuestions.value;

export default wrongQueCounterSlice.reducer;
