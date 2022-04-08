import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  value: [],
};


export const wrongQuestionsCounter = createSlice({
  name: 'wrongQuestions',
  initialState,
  reducers: {
  addWrongQuestions: (state, action) => {
      //  state.push(action.payload)
      //  state.value += action.payload
      state.value = [...state.value, action.payload];
    }}
})

export const { addWrongQuestions } = wrongQuestionsCounter.actions


export const selectWrongQuestions = (state) => state.wrongQuestions.value

export default wrongQuestionsCounter.reducer
