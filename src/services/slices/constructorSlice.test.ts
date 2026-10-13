import constructorReducer from './constructorSlice';

describe('Тестирование редьюсера слайса constructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: [],
    orderRequest: false,
    orderModalData: null,
  };

  test('проверяет экшен, несуществующий в приложении', () => {
    const result = constructorReducer(undefined, { type: 'UNKNOWN' });

    expect(result).toEqual(initialState);
  });
});
