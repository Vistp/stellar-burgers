import { getFeedOrdersData } from '@/services/slices/feedSlice';
import { useSelector } from '@/services/store';
import { FeedInfoUI } from '@ui';

import type { TFeedState, TOrder } from '@utils-types';

const getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo = (): React.JSX.Element => {
  const feedData = useSelector(getFeedOrdersData);

  const orders = feedData?.orders ?? [];
  const total = feedData?.total ?? 0;
  const totalToday = feedData?.totalToday ?? 0;

  const feed: TFeedState = {
    orders,
    total,
    totalToday,
    isLoading: false,
    error: null,
  };

  const readyOrders = getOrders(orders, 'done');

  const pendingOrders = getOrders(orders, 'pending');

  return (
    <FeedInfoUI readyOrders={readyOrders} pendingOrders={pendingOrders} feed={feed} />
  );
};
