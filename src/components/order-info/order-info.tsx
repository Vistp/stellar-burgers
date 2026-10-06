import { Preloader, OrderInfoUI } from '@ui';
import { useEffect, useMemo } from 'react';

import type { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '@/services/store';
import { getIngredientsState } from '@/services/slices/ingredientsSlice';
import { useParams } from 'react-router-dom';
import { getUserOrders, loadUserOrdersThunk } from '@/services/slices/userSlice';
import { getFeedOrdersData, loadFeedThunk } from '@/services/slices/feedSlice';

export const OrderInfo = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();

  const userOrders = useSelector(getUserOrders);
  const ingredients = useSelector(getIngredientsState);
  const feedData = useSelector(getFeedOrdersData);

  const feedOrders = feedData?.orders ?? [];

  const orderData = useMemo(() => {
    const orders = [...feedOrders, ...userOrders];

    return orders.find((item) => item.number === Number(number));
  }, [feedOrders, userOrders, number]);


  useEffect(() => {
    if (!feedOrders.length) {
      void dispatch(loadFeedThunk());
    }
    if (!userOrders.length && localStorage.getItem('refreshToken')) {
      void dispatch(loadUserOrdersThunk());
    }
  }, [dispatch, feedOrders.length, userOrders.length]);
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
