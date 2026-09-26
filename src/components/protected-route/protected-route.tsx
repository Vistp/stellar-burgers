import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { getIsAuthCheckedState, getUserState } from '../../services/slices/userSlice';
import { Preloader } from '@ui';

interface ProtectedRouteProps {
  /** Флаг доступа к маршруту:
      - true: маршрут для незалогиненных
      - false: маршрут для залогиненных */
  onlyGuests?: boolean;
  /** Защищаемый компонент страницы */
  children: React.ReactElement;
}

/**
 * Компоненнт защиты маршрутов:
 * - проверяет статус авторизации пользователя
 * - управляет автоматическими редиректами
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ onlyGuests = false, children }) => {
  const location = useLocation();

  const isAuthChecked = useSelector(getIsAuthCheckedState);
  const user = useSelector(getUserState);

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyGuests && user) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate to={from} />;
  }

  if (!onlyGuests && !user) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};