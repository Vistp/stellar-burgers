
import { getUserErrorText, loginUserThunk } from '@/services/slices/userSlice';
import { useDispatch } from '@/services/store';
import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useState } from 'react';
import { useSelector } from 'react-redux';

export const Login = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const errorText = useSelector(getUserErrorText);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    if (!email || !password) return;

    dispatch(loginUserThunk({ email, password }));
  };

  return (
    <LoginUI
      errorText={errorText}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
