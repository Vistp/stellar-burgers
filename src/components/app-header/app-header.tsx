import { getUserData } from '@/services/slices/userSlice';
import { useSelector } from '@/services/store';
import { AppHeaderUI } from '@ui';

export const AppHeader = (): React.JSX.Element => {
  const userData = useSelector(getUserData);

  const userName = userData?.name || '';

  return <AppHeaderUI userName={userName} />;
};
