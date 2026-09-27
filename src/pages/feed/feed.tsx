import { loadFeedThunk, getFeedOrdersData } from '../../services/slices/feedSlice';
import { useDispatch, useSelector } from '../../services/store';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

export const Feed = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const ordersData = useSelector(getFeedOrdersData);

  const handleGetFeeds = (): void => {
    dispatch(loadFeedThunk());
  };

  useEffect(() => {
    dispatch(loadFeedThunk());
  }, [dispatch]);

  if (!ordersData || !ordersData.orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={ordersData.orders} handleGetFeeds={handleGetFeeds} />;
};
