import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
  actGetProductsByItems,
  cartItemChangeQuantity,
  cartItemRemove,
} from "@store/cart/cartSlice";
import { Loading } from "@components/feedback";
import { CartItemList, CartSubtotalPrice } from "@components/eCommerce";

const Cart = () => {
  const dispatch = useAppDispatch();
  const { items, productsFullInfo, loading, error } = useAppSelector(
    (state) => state.cart
  );

  useEffect(() => {
    // Fetch product details only if there are items in the cart
    const itemsIds = Object.keys(items);
    if (itemsIds.length > 0) {
      dispatch(actGetProductsByItems());
    }
  }, [dispatch, items]);

  // Properly connect products with quantities
  const products = productsFullInfo
    .filter((product) => items[product.id]) // Only products that exist in the cart
    .map((product) => ({
      ...product,
      quantity: items[product.id],
    }));

  const changeQuantityHandler = useCallback(
    (id: number, quantity: number) => {
      dispatch(cartItemChangeQuantity({ id, quantity }));
    },
    [dispatch]
  );

  const removeItemHandler = useCallback(
    (id: number) => {
      dispatch(cartItemRemove(id));
    },
    [dispatch]
  );

  return (
    <>
      <h1>Your Cart</h1>
      <Loading status={loading} error={error}>
        {products.length ? (
          <>
            <CartItemList
              products={products}
              changeQuantityHandler={changeQuantityHandler}
              removeItemHandler={removeItemHandler}
            />
            <CartSubtotalPrice products={products} />
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <h3>Your Cart is empty</h3>
            <p>Add some products to see them here!</p>
          </div>
        )}
      </Loading>
    </>
  );
};

export default Cart;
