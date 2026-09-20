import { combineReducers } from '@reduxjs/toolkit';
import ingredientsReducer from './slices/ingredientsSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
});