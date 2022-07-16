/* eslint-disable import/no-named-as-default */
import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import thunk from "redux-thunk";

import counterSlice from "./reducers/counterSlice";
import wrongQueCounterSlice from "./reducers/wrongQueCounterSlice";
import scoreStateSlice from "./reducers/scoreStateSlice";

const reducers = combineReducers({
  counter: counterSlice,
  wrongQuestions: wrongQueCounterSlice,
  showScoreState: scoreStateSlice,
});

const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== "production",
  middleware: [thunk],
});

export default store;
