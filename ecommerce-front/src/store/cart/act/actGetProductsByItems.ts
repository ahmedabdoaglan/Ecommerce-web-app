import { createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "@store/index";
import axios from "axios";
import { axiosErrorHandler } from "@utils";
import type { TProduct } from "@types";

type TResponse = TProduct[];

const actGetProductsByItems = createAsyncThunk(
  "cart/actGetProductsByItems",
  async (_, thunkAPI) => {
    const { rejectWithValue, fulfillWithValue, getState, signal } = thunkAPI;
    const { cart } = getState() as RootState;
    const itemsId = Object.keys(cart.items);

    if (!itemsId.length) {
      return fulfillWithValue([]);
    }

    try {
      // Solution: Validate IDs and convert them to numbers if needed
      const validIds = itemsId
        .map((id) => parseInt(id, 10))
        .filter((id) => !isNaN(id));

      if (validIds.length === 0) {
        return fulfillWithValue([]);
      }

      const concatenatedItemsId = validIds.map((id) => `id=${id}`).join("&");

      const response = await axios.get<TResponse>(
        `/products?${concatenatedItemsId}`,
        { signal }
      );

      return response.data;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetProductsByItems;
