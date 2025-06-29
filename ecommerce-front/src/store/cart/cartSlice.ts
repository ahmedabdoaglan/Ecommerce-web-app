import { createSlice } from "@reduxjs/toolkit";
import actGetProductsByItems from "./act/actGetProductsByItems";
import {
  getCartTotalQuantitySelector,
  itemQuantityAvailabilityCheckingSelector,
} from "./selectors";
import type { TProduct } from "@customTypes/product";
import type { TLoading } from "@customTypes/shared";

interface ICartState {
  items: { [key: number]: number }; // Changed from string to number
  productsFullInfo: TProduct[];
  loading: TLoading;
  error: null | string;
}

const initialState: ICartState = {
  items: {},
  productsFullInfo: [],
  loading: "idle",
  error: null,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const id = action.payload;
      if (state.items[id]) {
        state.items[id]++;
      } else {
        state.items[id] = 1;
      }
    },
    cartItemChangeQuantity: (state, action) => {
      const { id, quantity } = action.payload;
      if (quantity <= 0) {
        delete state.items[id];
        // Also remove the product from productsFullInfo
        state.productsFullInfo = state.productsFullInfo.filter(
          (el) => el.id !== id
        );
      } else {
        state.items[id] = quantity;
      }
    },
    cartItemRemove: (state, action) => {
      const id = action.payload;
      delete state.items[id];
      // Remove the product from productsFullInfo
      state.productsFullInfo = state.productsFullInfo.filter(
        (el) => el.id !== id
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(actGetProductsByItems.pending, (state) => {
      state.loading = "pending";
      state.error = null;
    });
    builder.addCase(actGetProductsByItems.fulfilled, (state, action) => {
      state.loading = "succeeded";
      state.productsFullInfo = action.payload;
    });
    builder.addCase(actGetProductsByItems.rejected, (state, action) => {
      state.loading = "failed";
      if (action.payload && typeof action.payload === "string") {
        state.error = action.payload;
      }
    });
  },
});

export {
  getCartTotalQuantitySelector,
  itemQuantityAvailabilityCheckingSelector,
  actGetProductsByItems,
};
export const { addToCart, cartItemChangeQuantity, cartItemRemove } =
  cartSlice.actions;
export default cartSlice.reducer;
