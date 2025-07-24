import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import {
  actGetProductsByItems,
  cartItemChangeQuantity,
  cartItemRemove,
} from "@store/cart/cartSlice";
import { Heading } from "@components/common";
import { Loading, LottieHandler } from "@components/feedback";
import { CartItemList, CartSubtotalPrice } from "@components/ecommerce";

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

  // Solution: Filter products to show only items that exist in the cart
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
      <Heading title="Your Cart" />
      <Loading status={loading} error={error} type="cart">
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
            <LottieHandler message="Your cart is empty" type="empty" />
          </div>
        )}
      </Loading>
    </>
  );
};

export default Cart;
