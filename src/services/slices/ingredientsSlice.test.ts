import { TIngredient } from '@/utils/types';
import ingredientsReducer, { getIngredientsThunk } from './ingredientsSlice';

describe('Тестирование редьюсера слайса ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null,
  };

  test('проверяет экшен, несуществующий в приложении', () => {
    const result = ingredientsReducer(undefined, { type: 'UNKNOWN' });

    expect(result).toEqual(initialState);
  });

  test('проверяет экшен pending', () => {
    const action = getIngredientsThunk.pending('requestId');
    const result = ingredientsReducer(initialState, action);

    expect(result).toEqual({
      ingredients: [],
      isLoading: true,
      error: null,
    });
  });

  test('проверяет экшен rejected', () => {
    const action = getIngredientsThunk.rejected(new Error('Текст ошибки'), 'requestId');
    const result = ingredientsReducer({ ...initialState, isLoading: true }, action);

    expect(result).toEqual({
      ingredients: [],
      isLoading: false,
      error: 'Текст ошибки',
    });
  });

  test('проверяет экшен fulfilled', () => {
    const ingredients: TIngredient[] = [
      {
        _id: '1',
        name: 'Тестовая Булка',
        type: 'bun',
        price: 100,
        calories: 10,
        proteins: 10,
        fat: 10,
        carbohydrates: 10,
        image: 'https://yandex.net',
        image_mobile: 'https://yandex.net',
        image_large: 'https://yandex.net',
      },
      {
        _id: '2',
        name: 'Тестовый Соус',
        type: 'sauce',
        price: 50,
        calories: 5,
        proteins: 5,
        fat: 5,
        carbohydrates: 5,
        image: 'https://yandex.net',
        image_mobile: 'https://yandex.net',
        image_large: 'https://yandex.net',
      },
    ];

    const action = getIngredientsThunk.fulfilled(ingredients, 'requestId');
    const result = ingredientsReducer({ ...initialState, isLoading: true }, action);

    expect(result).toEqual({
      ingredients: ingredients,
      isLoading: false,
      error: null,
    });
  });
});
