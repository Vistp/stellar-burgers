import { deleteCookie, setCookie } from '@/utils/cookie';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import {
  getOrdersApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  updateUserApi,
  type TLoginData,
  type TRegisterData,
} from '../../utils/burger-api';

import type { TOrder, TUser } from '../../utils/types';
import type { RootState } from '../store';

/** Проверяет авторизацию пользователя */
export const checkUserAuthThunk = createAsyncThunk<TUser>('user/checkUserAuth', () =>
  getUserApi().then((res) => res.user)
);

/** Авторизует пользователя и сохраняет токен */
export const loginUserThunk = createAsyncThunk<TUser, TLoginData>(
  'user/loginUser',
  (data: TLoginData) =>
    loginUserApi(data).then((res) => {
      localStorage.setItem('refreshToken', res.refreshToken);
      setCookie('accessToken', res.accessToken);

      return res.user;
    })
);

/** Регистрирует нового пользователя и сохраняет токен */
export const registerUserThunk = createAsyncThunk<TUser, TRegisterData>(
  'user/registerUser',
  (data: TRegisterData) =>
    registerUserApi(data).then((res) => {
      localStorage.setItem('refreshToken', res.refreshToken);
      setCookie('accessToken', res.accessToken);

      return res.user;
    })
);

/** Обновляет данные пользователя на сервере */
export const updateUserThunk = createAsyncThunk<TUser, Partial<TRegisterData>>(
  'user/updateUser',
  (data: Partial<TRegisterData>) => updateUserApi(data).then((res) => res.user)
);

/** Разлогинивает пользователя и очищает токены */
export const logoutUserThunk = createAsyncThunk<{ success: boolean }>(
  'user/logoutUser',
  () =>
    logoutApi().then((res) => {
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');

      return res;
    })
);

/** Получает историю заказов пользователя */
export const loadUserOrdersThunk = createAsyncThunk<TOrder[]>('user/loadOrders', () =>
  getOrdersApi().then((res) => res)
);

/** Состояние авторизации и данных пользователя */
export type UserState = {
  /** Статус проверки токена */
  isAuthChecked: boolean;
  /** Данные пользователя */
  userData: TUser | null;
  /** Текст ошибки */
  errorText: string;
  /** История заказов пользователя */
  orders: TOrder[];
};

const initialState: UserState = {
  isAuthChecked: false,
  userData: null,
  errorText: '',
  orders: [],
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    },
  },
  extraReducers: (builder) => {
    builder
      /** Проверка авторизации пользователя */
      .addCase(checkUserAuthThunk.fulfilled, (state, { payload }) => {
        state.userData = payload;
        state.isAuthChecked = true;
        state.errorText = '';
      })
      .addCase(checkUserAuthThunk.rejected, (state) => {
        state.userData = null;
        state.isAuthChecked = true;
      })
      /** Авторизация пользователя */
      .addCase(loginUserThunk.fulfilled, (state, { payload }) => {
        state.userData = payload;
        state.isAuthChecked = true;
        state.errorText = '';
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.errorText = action.error.message ?? 'Ошибка';
        state.isAuthChecked = true;
      })
      /** Регистрация пользователя */
      .addCase(registerUserThunk.fulfilled, (state, { payload }) => {
        state.userData = payload;
        state.isAuthChecked = true;
        state.errorText = '';
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.errorText = action.error.message ?? 'Ошибка';
        state.isAuthChecked = true;
      })
      /** Обновление данных пользователя */
      .addCase(updateUserThunk.fulfilled, (state, { payload }) => {
        state.userData = payload;
        state.errorText = '';
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.errorText = action.error.message ?? 'Ошибка';
      })
      /** Выход пользователя */
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.userData = null;
        state.errorText = '';
      })
      /** Получение истории заказов */
      .addCase(loadUserOrdersThunk.fulfilled, (state, { payload }) => {
        state.orders = payload;
      });
  },
});

export const { authChecked } = userSlice.actions;

export const getUserData = (state: RootState): TUser | null => state.user.userData;
export const getIsAuthCheckedState = (state: RootState): boolean =>
  state.user.isAuthChecked;
export const getUserErrorText = (state: RootState): string => state.user.errorText;
export const getUserOrders = (state: RootState): TOrder[] => state.user.orders;

export default userSlice.reducer;
