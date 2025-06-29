import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@store/index";
import axios from "axios";
import type { TProduct } from "@customTypes/product";

type TResponse = TProduct[];

const actGetProductsByItems = createAsyncThunk(
  "cart/actGetProductsByItems",
  async (_, thunkAPI) => {
    const { rejectWithValue, fulfillWithValue, getState } = thunkAPI;
    const { cart } = getState() as RootState;
    const itemsId = Object.keys(cart.items);

    if (!itemsId.length) {
      return fulfillWithValue([]);
    }

    try {
      // Ensure that IDs are valid numbers
      const validIds = itemsId
        .map((id) => parseInt(id, 10))
        .filter((id) => !isNaN(id));

      if (validIds.length === 0) {
        return fulfillWithValue([]);
      }

      const concatenatedItemsId = validIds.map((id) => `id=${id}`).join("&");

      const response = await axios.get<TResponse>(
        `http://localhost:5005/products?${concatenatedItemsId}`
      );

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message || error.message);
      } else {
        return rejectWithValue("An unexpected error");
      }
    }
  }
);

export default actGetProductsByItems;
