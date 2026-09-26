import { logoutUserThunk } from '@/services/slices/userSlice';
import { useDispatch } from '@/services/store';
import { ProfileMenuUI } from '@ui';
import { useLocation } from 'react-router-dom';

export const ProfileMenu = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const { pathname } = useLocation();

  const handleLogout = (): void => {
    dispatch(logoutUserThunk());
  };

  return <ProfileMenuUI handleLogout={handleLogout} pathname={pathname} />;
};
