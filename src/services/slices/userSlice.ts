import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserApi, loginUserApi, logoutApi, registerUserApi, type TLoginData, type TRegisterData } from '../../utils/burger-api';
import type { TUser } from '../../utils/types';
import type { RootState } from '../store';
import { deleteCookie, setCookie } from '@/utils/cookie';

/** Проверяет авторизацию пользователя */
export const checkUserAuthThunk = createAsyncThunk(
  'user/checkAuth',
  () => getUserApi().then((res) => res.user)
);

/** Авторизует пользователя и сохраняет токен */
export const loginUserThunk = createAsyncThunk(
  'user/login',
  (data: TLoginData) =>
    loginUserApi(data).then((res) => {
      localStorage.setItem('refreshToken', res.refreshToken);
      setCookie('accessToken', res.accessToken);

      return res.user;
    })
);

/** Регистрирует нового пользователя и сохраняет токен */
export const registerUserThunk = createAsyncThunk(
  'user/register',
  (data: TRegisterData) =>
    registerUserApi(data).then((res) => {
      localStorage.setItem('refreshToken', res.refreshToken);
      setCookie('accessToken', res.accessToken);

      return res.user;
    })
);

/** Разлогинивает пользователя и очищает токены */
export const logoutUserThunk = createAsyncThunk(
  'user/logout',
  () =>
    logoutApi().then((res) => {
      localStorage.removeItem('refreshToken');
      deleteCookie('accessToken');

      return res;
    })
);

/** Состояние авторизации и данных пользователя */
export interface UserState {
  /** Статус проверки токена */
  isAuthChecked: boolean;
  /** Данные пользователя */
  userData: TUser | null;
  /** Текст ошибки */
  errorText: string;
}

const initialState: UserState = {
  isAuthChecked: false,
  userData: null,
  errorText: '',
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    authChecked: (state) => {
      state.isAuthChecked = true;
    }
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
        state.errorText = action.error.message || 'Ошибка';
        state.isAuthChecked = true;
      })
    /** Регистрация пользователя */
      .addCase(registerUserThunk.fulfilled, (state, { payload }) => {
        state.userData = payload;
        state.isAuthChecked = true;
        state.errorText = '';
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.errorText = action.error.message || 'Ошибка';
        state.isAuthChecked = true;
      })
    /** Выход пользователя */
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.userData = null;
        state.errorText = '';
      });
  }
});

export const { authChecked } = userSlice.actions;

export const getUserData = (state: RootState) => state.user.userData;
export const getIsAuthCheckedState = (state: RootState) => state.user.isAuthChecked;
export const getUserErrorText = (state: RootState) => state. user.errorText;

export default userSlice.reducer;
