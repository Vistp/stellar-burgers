import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { orderBurgerApi } from '../../utils/burger-api';

import type { TConstructorIngredient, TOrder } from '../../utils/types';
import type { RootState } from '../store';
import type { PayloadAction } from '@reduxjs/toolkit';

/** Отправляет выбранные ингредиенты на сервер */
export const orderBurgerThunk = createAsyncThunk<TOrder, string[]>(
  'constructor/orderBurger',
  (ingredientIds: string[]) => orderBurgerApi(ingredientIds).then((res) => res.order)
);

/** Состояние конструктора бургера */
export type ConstructorState = {
  /** Выбранная булка */
  bun: TConstructorIngredient | null;
  /** Список выбранных начинок и соусов */
  ingredients: TConstructorIngredient[];
  /** Статус отправки заказа */
  orderRequest: boolean;
  /** Данные созданного заказа */
  orderModalData: TOrder | null;
};

const initialState: ConstructorState = {
  bun: null,
  ingredients: [],
  orderRequest: false,
  orderModalData: null,
};

export const constructorSlice = createSlice({
  name: 'constructor',
  initialState,
  reducers: {
    addIngredient: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
      if (payload.type === 'bun') {
        state.bun = payload;
      } else {
        state.ingredients.push(payload);
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter((item) => item.id !== action.payload);
    },
    moveIngredientUp: (state, { payload }: PayloadAction<number>) => {
      const currentIngredient = state.ingredients[payload];

      state.ingredients[payload] = state.ingredients[payload - 1];
      state.ingredients[payload - 1] = currentIngredient;
    },
    moveIngredientDown: (state, { payload }: PayloadAction<number>) => {
      const currentIngredient = state.ingredients[payload];

      state.ingredients[payload] = state.ingredients[payload + 1];
      state.ingredients[payload + 1] = currentIngredient;
    },
    resetConstructor: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    clearOrderModal: (state) => {
      state.orderModalData = null;
    },
  },

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
  },
});

export const {
  addIngredient,
  resetConstructor,
  clearOrderModal,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
} = constructorSlice.actions;

export const getConstructorState = (state: RootState): ConstructorState =>
  state.burgerConstructor;

export default constructorSlice.reducer;
