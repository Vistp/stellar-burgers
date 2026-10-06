import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getIngredientsApi } from '../../utils/burger-api';

import type { RootState } from '../store';
import type { TIngredient } from '@/utils/types';

/** Получает список ингредиентов */
export const getIngredientsThunk = createAsyncThunk<TIngredient[]>(
  'ingredients/getIngredients',
  () => getIngredientsApi().then((data) => data)
);

/** Состояние списка ингредиентов */
export type IngredientsState = {
  /** Массив ингредиентов */
  ingredients: TIngredient[];
  /** Состояние загрузки */
  isLoading: boolean;
  /** Текст ошибки */
  error: string | null;
};

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
      state.error = action.error.message ?? 'Ошибка';
    });
    builder.addCase(getIngredientsThunk.fulfilled, (state, { payload }) => {
      state.isLoading = false;
      state.ingredients = payload;
    });
  },
});

export const getIngredientsState = (state: RootState): TIngredient[] =>
  state.ingredients.ingredients;
export const getIngredientsLoading = (state: RootState): boolean =>
  state.ingredients.isLoading;
export const getIngredientsError = (state: RootState): string | null =>
  state.ingredients.error;

export default ingredientsSlice.reducer;