import constructorReducer, {
  addIngredient,
  clearOrderModal,
  moveIngredientDown,
  moveIngredientUp,
  removeIngredient
} from './constructorSlice';

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

  test('проверяет пермещение ингредиента вверх при экшене moveIngredientUp', () => {
    const ingredient1 = { id: 'id-1', _id: 's1', name: 'Соус 1', type: 'sauce', price: 50, proteins: 5, fat: 5, carbohydrates: 5, calories: 50, image: 'https://yandex.net', image_mobile: 'https://yandex.net', image_large: 'https://yandex.net' };
    const ingredient2 = { id: 'id-2', _id: 's2', name: 'Соус 2', type: 'sauce', price: 50, proteins: 5, fat: 5, carbohydrates: 5, calories: 50, image: 'https://yandex.net', image_mobile: 'https://yandex.net', image_large: 'https://yandex.net' };

    const stateBeforeMove = {
      ...initialState,
      ingredients: [ingredient2, ingredient1],
    };
    const result = constructorReducer(stateBeforeMove, moveIngredientUp(1));

    expect(result.ingredients).toEqual([ingredient1, ingredient2]);
  });

  test('проверяет перемещение ингредиента вниз при экшене moveIngredientDown', () => {
    const ingredient1 = { id: 'id-1', _id: 's1', name: 'Соус 1', type: 'sauce', price: 50, proteins: 5, fat: 5, carbohydrates: 5, calories: 50, image: 'https://yandex.net', image_mobile: 'https://yandex.net', image_large: 'https://yandex.net' };
    const ingredient2 = { id: 'id-2', _id: 's2', name: 'Соус 2', type: 'sauce', price: 50, proteins: 5, fat: 5, carbohydrates: 5, calories: 50, image: 'https://yandex.net', image_mobile: 'https://yandex.net', image_large: 'https://yandex.net' };

    const stateBeforeMove = {
      ...initialState,
      ingredients: [ingredient1, ingredient2],
    };
    const result = constructorReducer(stateBeforeMove, moveIngredientDown(0));

    expect(result.ingredients).toEqual([ingredient2, ingredient1]);
  });

  test('проверяет очищение данных модалки заказа при экшене clearOrderModal', () => {
    const order = {
      _id: 'ord-123',
      status: 'done',
      name: 'Тестовый заказ',
      createdAt: '2026-10-13T00:00:00.000Z',
      updatedAt: '2026-10-13T00:00:00.000Z',
      number: 111,
      ingredients: ['bun-id-1', 'sauce-id-1']
    };

    const stateWithOrder = {
      ...initialState,
      orderModalData: order,
    };
    const result = constructorReducer(stateWithOrder, clearOrderModal());

    expect(result.orderModalData).toBeNull();
  });

  test('проверяет экшен pending', () => {
    const action = { type: 'constructor/orderBurger/pending' };
    const result = constructorReducer(initialState, action);

    expect(result.orderRequest).toBe(true);
  });

  test('проверяет экшен rejected', () => {
    const action = { type: 'constructor/orderBurger/rejected' };
    const result = constructorReducer({ ...initialState, orderRequest: true }, action);

    expect(result.orderRequest).toBe(false);
  });

  test('проверяет экшен fulfilled', () => {
    const order = {
      _id: 'ord-123',
      status: 'done',
      name: 'Тестовый заказ',
      createdAt: '2026-10-13T00:00:00.000Z',
      updatedAt: '2026-10-13T00:00:00.000Z',
      number: 111,
      ingredients: ['bun-id-1', 'sauce-id-1']
    };

    const stateWithData = {
      bun: { id: 'b1', _id: 'b1', name: 'Булка', type: 'bun', price: 10, proteins: 1, fat: 1, carbohydrates: 1, calories: 1, image: '', image_mobile: '', image_large: '' },
      ingredients: [{ id: 's1', _id: 's1', name: 'Соус', type: 'sauce', price: 5, proteins: 1, fat: 1, carbohydrates: 1, calories: 1, image: '', image_mobile: '', image_large: '' }],
      orderRequest: true,
      orderModalData: null,
    };

    const action = { type: 'constructor/orderBurger/fulfilled', payload: order };
    const result = constructorReducer(stateWithData, action);

    expect(result.orderRequest).toBe(false);
    expect(result.orderModalData).toEqual(order);
    expect(result.bun).toBeNull();
    expect(result.ingredients).toEqual([]);
  });
});
