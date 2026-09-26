import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import type{ TConstructorIngredient, TOrder } from '../../utils/types';
import type { RootState } from '../store';

/** Отправляет выбранные ингредиенты на сервер */
export const orderBurgerThunk = createAsyncThunk(
  'constructor/orderBurger',
  (ingredientIds: string[]) => orderBurgerApi(ingredientIds).then((res) => res.order)
);

/** Состояние конструктора бургера */
export interface ConstructorState {
  /** Выбранная булка */
  bun: TConstructorIngredient | null;
  /** Список выбранных начинок и соусов */
  ingredients: TConstructorIngredient[];
  /** Статус отправки заказа */
  orderRequest: boolean;
  /** Данные созданного заказа */
  orderModalData: TOrder | null;
}

const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
};

export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder
    /** Отправка ингредиентов на сервер */
      .addCase(orderBurgerThunk.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(orderBurgerThunk.fulfilled, (state, { payload }) => {
        state.orderRequest = false;
        state.orderModalData = payload;
      })
      .addCase(orderBurgerThunk.rejected, (state) => {
        state.orderRequest = false;
      });
  }
});

export const getConstructorState = (state: RootState) => state.constructor;

export default constructorSlice.reducer;
