import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import { getFeedsApi } from '../../utils/burger-api';

import type { TOrdersData } from '../../utils/types';
import type { RootState } from '../store';

/** Получает общую ленту заказов */
export const loadFeedThunk = createAsyncThunk<TOrdersData>('feed/loadFeed', () =>
  getFeedsApi().then((res) => res)
);

/** Состояние общей ленты заказов и количества заказов */
export type FeedState = {
  /** Данные заказов: список, общее количество выполненных за все время и за сегодня */
  ordersData: TOrdersData | null;
};

const initialState: FeedState = {
  ordersData: null,
};

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /** Получение общей ленты заказов */
    builder.addCase(loadFeedThunk.fulfilled, (state, { payload }) => {
      state.ordersData = payload;
    });
  },
});

export const getFeedOrdersData = (state: RootState): TOrdersData | null =>
  state.feed.ordersData;

export default feedSlice.reducer;