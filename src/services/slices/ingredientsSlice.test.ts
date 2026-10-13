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
});
