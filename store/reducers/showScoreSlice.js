import { createSlice } from '@reduxjs/toolkit'

export const scoreStateSlice = createSlice({
  name: 'showScoreState',
  initialState: {
    value: false
  },
  reducers: {
    showScore: state => {
      state.value  = !state.value
    } 
  }
})

export const { showScore } = scoreStateSlice.actions

export const selectCount = state => state.showScoreState.value

export default scoreStateSlice.reducer
