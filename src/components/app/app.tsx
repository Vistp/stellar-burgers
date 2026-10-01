import { AppHeader, IngredientDetails, Modal, OrderInfo } from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  Profile,
  ProfileOrders,
  NotFound404
} from '@pages';
import { Preloader } from '@ui';
import { Routes, Route, useLocation, useParams } from 'react-router-dom';
import type { AppContentProps } from './type';
import '../../index.css';
import styles from './app.module.css';
import { useDispatch, useSelector } from '@/services/store';
import { useEffect } from 'react';
import { getIngredientsError, getIngredientsLoading, getIngredientsState, getIngredientsThunk } from '@/services/slices/ingredientsSlice';
import { authChecked, checkUserAuthThunk } from '@/services/slices/userSlice';
import { ProtectedRoute } from '../protected-route/protected-route';

const App = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const ingredients = useSelector(getIngredientsState);
  const isIngredientsLoading = useSelector(getIngredientsLoading);
  const ingredientsError = useSelector(getIngredientsError);

  useEffect(() => {
    dispatch(getIngredientsThunk());

    if (localStorage.getItem('refreshToken')) {
      dispatch(checkUserAuthThunk());
    } else {
      dispatch(authChecked());
    }
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppContent
        ingredients={ingredients}
        isLoading={isIngredientsLoading}
        error={ingredientsError ? new Error(ingredientsError) : null}
      />
    </div>
  );
};

export default App;

/* Маршруты показываются только когда ингредиенты загружены: без них не
   отрисовать ни конструктор, ни состав заказа. */
const AppContent = ({
  ingredients,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты
        {error.message ? `: ${error.message}` : '.'}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>
    );
  }

  return <RouteComponent />;
};

const RouteComponent = (): React.JSX.Element => {
  const location = useLocation();

  const background = location.state && location.state.background;

   return (
    <>
      {/* Страницы */}
      <Routes location={background || location}>
        <Route path="/" element={<ConstructorPage />} />
        <Route path="/feed" element={<Feed />} />
        <Route path="/feed/:number" element={<FeedOrderPage />} />
        <Route path="/ingredients/:id" element={<IngredientDetails />} />

        <Route path="/ingredients/:id" element={<IngredientDetails />} />

        <Route path="/login" element={
          <ProtectedRoute onlyGuests>
            <Login />
          </ProtectedRoute>
        } />
        <Route path="/register" element={
          <ProtectedRoute onlyGuests>
            <Register />
          </ProtectedRoute>
        } />
        <Route path="/forgot-password" element={
          <ProtectedRoute onlyGuests>
            <ForgotPassword />
          </ProtectedRoute>
        } />
        <Route path="/reset-password" element={
          <ProtectedRoute onlyGuests>
            <ResetPassword />
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        <Route path="/profile/orders" element={
          <ProtectedRoute>
            <ProfileOrders />
          </ProtectedRoute>
        } />
        <Route path="/profile/orders/:number" element={<ProfileOrderPage />} />
        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {/* Модальные окна */}
      {background && (
        <Routes>
          <Route path="/feed/:number" element={<FeedOrderModal />} />
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={() => window.history.back()}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route path="/profile/orders/:number" element={<ProfileOrderModal />} />
        </Routes>
      )}
    </>
  );
};

const FeedOrderPage = () => {
  const { number } = useParams<{ number: string }>();
  return (
    <div className={styles.detailPageWrap}>
        {`#${number ?? ''}`}
      <OrderInfo />
    </div>
  );
};

const ProfileOrderPage = () => {
  const { number } = useParams<{ number: string }>();
  return (
    <ProtectedRoute>
      <div className={styles.detailPageWrap}>
          {`#${number ?? ''}`}
        <OrderInfo />
      </div>
    </ProtectedRoute>
  );
};

const FeedOrderModal = () => {
  const { number } = useParams<{ number: string }>();
  return (
    <Modal title={`#${number ?? ''}`} onClose={() => window.history.back()}>
      <OrderInfo />
    </Modal>
  );
};

const ProfileOrderModal = () => {
  const { number } = useParams<{ number: string }>();
  return (
    <ProtectedRoute>
      <Modal title={`#${number ?? ''}`} onClose={() => window.history.back()}>
        <OrderInfo />
      </Modal>
    </ProtectedRoute>
  );
};
