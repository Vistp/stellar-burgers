import { Preloader, OrderInfoUI } from '@ui';
import { useMemo } from 'react';

import type { TIngredient } from '@utils-types';
import { useSelector } from '@/services/store';
import { getIngredientsState } from '@/services/slices/ingredientsSlice';
import { useParams } from 'react-router-dom';
import { getUserOrders } from '@/services/slices/userSlice';

export const OrderInfo = (): React.JSX.Element => {
  const { number } = useParams<{ number: string }>();

  const orders = useSelector(getUserOrders);
  const ingredients = useSelector(getIngredientsState);

  const orderData = useMemo(() =>
    orders.find((item) => item.number === Number(number)),
  [orders, number]);

  /**
   * использование useMemo не обязательно
   */
  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
