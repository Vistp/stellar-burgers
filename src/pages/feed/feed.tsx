import { loadFeedThunk, getFeedOrders } from '@/services/slices/feedSlice';
import { useDispatch, useSelector } from '@/services/store';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const orders = useSelector(getFeedOrders);

  const handleGetFeeds = (): void => {
    dispatch(loadFeedThunk());
  };

  useEffect(() => {
    dispatch(loadFeedThunk());
  }, [dispatch]);

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
