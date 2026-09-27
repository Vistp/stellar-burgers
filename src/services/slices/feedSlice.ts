import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi } from '../../utils/burger-api';
import type { TOrder } from '../../utils/types';
import type { RootState } from '../store';

/** Получает общую ленту заказов */
export const loadFeedThunk = createAsyncThunk(
  'feed/loadFeed',
  () => getFeedsApi().then((res) => res.orders)
);

/** Состояние общей ленты заказов */
export interface FeedState {
  /** Список всех заказов */
  orders: TOrder[];
}

const initialState: FeedState = {
  orders: [],
};
const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    /** Получение общей ленты заказов */
    builder.addCase(loadFeedThunk.fulfilled, (state, { payload }) => {
      state.orders = payload;
    });
  }
});

export const getFeedOrders = (state: RootState) => state.feed.orders;

export default feedSlice.reducer;