import { configureStore } from '@reduxjs/toolkit';
import counterSlice from './reducers/counterSlice';
import wrongQuestionsCounter from './reducers/wrongQuestionsCounter';

export default configureStore({
  reducer: {
    counter: counterSlice,
    wrongQuestions: wrongQuestionsCounter
  },
});
