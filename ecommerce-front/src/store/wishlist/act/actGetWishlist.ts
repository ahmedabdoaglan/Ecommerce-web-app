import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { axiosErrorHandler } from "@utils";
import type { TProduct } from "@types";

const actGetWishlist = createAsyncThunk(
  "wishlist/actGetWishlist",
  async (_, thunkAPI) => {
    const { rejectWithValue, fulfillWithValue, signal } = thunkAPI;

    try {
      // Get user wishlist
      const userWishlist = await axios.get<
        { id: number; productId: number; userId: number }[]
      >("/wishlist?userId=1", { signal });

      if (!userWishlist.data.length) {
        return fulfillWithValue([]);
      }

      // Get each product individually to avoid query string issues
      const productPromises = userWishlist.data.map((item) =>
        axios.get<TProduct>(`/products/${item.productId}`, { signal })
      );

      const responses = await Promise.all(productPromises);
      const products = responses.map((response) => response.data);

      return products;
    } catch (error) {
      return rejectWithValue(axiosErrorHandler(error));
    }
  }
);

export default actGetWishlist;
