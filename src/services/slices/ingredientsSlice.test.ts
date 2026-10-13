import ingredientsReducer from './ingredientsSlice';

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
    const action = { type: 'ingredients/getIngredients/pending' };
    const result = ingredientsReducer(initialState, action);

    expect(result).toEqual({
      ingredients: [],
      isLoading: true,
      error: null,
    });
  });

  test('проверяет экшен rejected', () => {
    const action = {
      type: 'ingredients/getIngredients/rejected',
      error: { message: 'Текст ошибки' }
    };

    const result = ingredientsReducer({ ...initialState, isLoading: true }, action);

    expect(result).toEqual({
      ingredients: [],
      isLoading: false,
      error: 'Текст ошибки',
    });
  });

  test('проверяет экшен fulfilled', () => {
    const ingredients = [
      { _id: '1', name: 'Тестовая Булка', type: 'bun', price: 100, calories: 10 },
      { _id: '2', name: 'Тестовый Соус', type: 'sauce', price: 50, calories: 5 }
    ];

    const action = {
      type: 'ingredients/getIngredients/fulfilled',
      payload: ingredients
    };

    const result = ingredientsReducer({ ...initialState, isLoading: true }, action);

    expect(result).toEqual({
      ingredients: ingredients,
      isLoading: false,
      error: null,
    });
  });
});
