import { createSlice } from "@reduxjs/toolkit";
import actGetProductsByItems from "./act/actGetProductsByItems";
import { getCartTotalQuantitySelector } from "./selectors";
import type { TProduct, TLoading } from "@types";
import { isString } from "@types";

interface ICartState {
  items: { [key: string]: number };
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
        // Solution: Remove item from both items and productsFullInfo when quantity is 0 or less
        delete state.items[id];
        state.productsFullInfo = state.productsFullInfo.filter(
          (el) => el.id !== id
        );
      } else {
        state.items[id] = quantity;
      }
    },
    cartItemRemove: (state, action) => {
      const id = action.payload;
      // Solution: Remove item from both items and productsFullInfo
      delete state.items[id];
      state.productsFullInfo = state.productsFullInfo.filter(
        (el) => el.id !== id
      );
    },
    cleanCartProductsFullInfo: (state) => {
      state.productsFullInfo = [];
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
      if (isString(action.payload)) {
        state.error = action.payload;
      }
    });
  },
});

export { getCartTotalQuantitySelector, actGetProductsByItems };
export const {
  addToCart,
  cartItemChangeQuantity,
  cartItemRemove,
  cleanCartProductsFullInfo,
} = cartSlice.actions;
export default cartSlice.reducer;
