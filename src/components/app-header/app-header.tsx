import { getUserData } from '@/services/slices/userSlice';
import { AppHeaderUI } from '@ui';
import { useSelector } from 'react-redux';

export const AppHeader = (): React.JSX.Element => {
  const userData = useSelector(getUserData);

  const userName = userData?.name || '';

  return <AppHeaderUI userName={userName} />;
};
