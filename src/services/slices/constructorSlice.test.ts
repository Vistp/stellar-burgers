import constructorReducer, { addIngredient, removeIngredient } from './constructorSlice';

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

   test('проверяет добавление булки в экшене addIngredient', () => {
   const bun = {
      id: 'bun-1',
      _id: 'b1',
      name: 'Тестовая булка',
      type: 'bun',
      price: 100,
      proteins: 10,
      fat: 10,
      carbohydrates: 10,
      calories: 100,
      image: 'https://yandex.net',
      image_mobile: 'https://yandex.net',
      image_large: 'https://yandex.net'
    };
    const result = constructorReducer(initialState, addIngredient(bun));

    expect(result.bun).toEqual(bun);
    expect(result.ingredients).toEqual([]);
  });

  test('проверяет добавление начинок в экшене addIngredient', () => {
    const ingredient = {
      id: 'sauce-1',
      _id: 's1',
      name: 'Тестовая начинка',
      type: 'sauce',
      price: 50,
      proteins: 5,
      fat: 5,
      carbohydrates: 5,
      calories: 50,
      image: 'https://yandex.net',
      image_mobile: 'https://yandex.net',
      image_large: 'https://yandex.net'
    };
    const result = constructorReducer(initialState, addIngredient(ingredient));

    expect(result.bun).toBeNull();
    expect(result.ingredients).toEqual([ingredient]);
  });

    test('проверяет удаление в экшене removeIngredient', () => {
    const ingredient1 = {
      id: 'id-to-remove',
      _id: 's1',
      name: 'Тестовая начинка 1',
      type: 'sauce',
      price: 50,
      proteins: 5,
      fat: 5,
      carbohydrates: 5,
      calories: 50,
      image: 'https://yandex.net',
      image_mobile: 'https://yandex.net',
      image_large: 'https://yandex.net'
    };

    const ingredient2 = {
      id: 'id-to-keep',
      _id: 's2',
      name: 'Тестовая начинка 2',
      type: 'sauce',
      price: 50,
      proteins: 5,
      fat: 5,
      carbohydrates: 5,
      calories: 50,
      image: 'https://yandex.net',
      image_mobile: 'https://yandex.net',
      image_large: 'https://yandex.net'
    };

    const stateWithIngredients = {
      ...initialState,
      ingredients: [ingredient1, ingredient2],
    };
    const result = constructorReducer(stateWithIngredients, removeIngredient('id-to-remove'));

    expect(result.ingredients).toEqual([ingredient2]);
  });

});
