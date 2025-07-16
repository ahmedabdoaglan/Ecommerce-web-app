import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { TProduct } from "@customTypes/product";

type TResponse = TProduct[];

const actGetWishlist = createAsyncThunk(
  "wishlist/actGetWishlist",
  async (_, thunkAPI) => {
    const { rejectWithValue, fulfillWithValue } = thunkAPI;

    try {
      // Get user wishlist
      const userWishlist = await axios.get<
        { id: number; productId: number; userId: number }[]
      >("/wishlist?userId=1");

      if (!userWishlist.data.length) {
        return fulfillWithValue([]);
      }

      // Get each product individually to avoid query string issues
      const productPromises = userWishlist.data.map((item) =>
        axios.get<TProduct>(`/products/${item.productId}`)
      );

      const responses = await Promise.all(productPromises);
      const products = responses.map((response) => response.data);

      return products;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(error.response?.data.message || error.message);
      } else {
        return rejectWithValue("An unexpected error");
      }
    }
  }
);

export default actGetWishlist;
