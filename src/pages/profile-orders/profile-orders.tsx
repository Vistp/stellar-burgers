import { getUserOrders, loadUserOrdersThunk } from '@/services/slices/userSlice';
import { useDispatch, useSelector } from '@/services/store';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

export const ProfileOrders = (): React.JSX.Element => {
 const dispatch = useDispatch();

  const orders = useSelector(getUserOrders);

  useEffect(() => {
    void dispatch(loadUserOrdersThunk());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
