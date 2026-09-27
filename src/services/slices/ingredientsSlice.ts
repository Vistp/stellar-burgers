import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getIngredientsApi } from '../../utils/burger-api';
import type { TIngredient } from '@/utils/types';
import type { RootState } from '../store';

/** Получает список ингредиентов */
export const getIngredientsThunk = createAsyncThunk(
  'ingredients/getIngredients',
  () => getIngredientsApi().then((data) => data)
);

/** Состояние списка ингредиентов */
export interface IngredientsState {
  /** Массив ингредиентов */
  ingredients: TIngredient[];
  /** Состояние загрузки */
  isLoading: boolean;
  /** Текст ошибки */
  error: string | null;
}

const initialState: IngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null,
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    /** Получение списка ингредиентов */
    builder.addCase(getIngredientsThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(getIngredientsThunk.rejected, (state, action) => {
      state.isLoading = false;
      state.error = action.error.message || 'Ошибка';
    });
    builder.addCase(getIngredientsThunk.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.ingredients = payload;
    });
  }
});

export const getIngredientsState = (state: RootState) => state.ingredients.ingredients;
export const getIngredientsLoading = (state: RootState) => state.ingredients.isLoading;
export const getIngredientsError = (state: RootState) => state.ingredients.error;

export default ingredientsSlice.reducer;