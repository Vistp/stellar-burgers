import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getUserApi } from '../../utils/burger-api';
import type { TUser } from '../../utils/types';
import type { RootState } from '../store';

/** Проверяет авторизацию пользователя */
export const checkUserAuthThunk = createAsyncThunk(
  'user/checkAuth',
  () => getUserApi().then((res) => res.user)
);

/** Состояние авторизации и данных пользователя */
export interface UserState {
  /** Статус проверки токена */
  isAuthChecked: boolean;
  /** Данные пользователя */
  userData: TUser | null;
  /** Текст ошибки */
  errorText: string | null;
}

const initialState: UserState = {
  isAuthChecked: false,
  userData: null,
  errorText: null,
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
        state.errorText = null;
      })
      .addCase(checkUserAuthThunk.rejected, (state) => {
        state.userData = null;
        state.isAuthChecked = true;
      });
  }
});

export const { authChecked } = userSlice.actions;

export const getUserState = (state: RootState) => state.user.userData;
export const getIsAuthCheckedState = (state: RootState) => state.user.isAuthChecked;

export default userSlice.reducer;
