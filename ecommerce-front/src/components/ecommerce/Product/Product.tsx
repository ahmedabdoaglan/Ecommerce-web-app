// import { useEffect, useState, memo } from "react";
// import { useAppDispatch, useAppSelector } from "@store/hooks";
// import { addToCart, fixCartData } from "@store/cart/cartSlice";
// import { Button, Spinner } from "react-bootstrap";
// import type { TProduct } from "@customTypes/product";

// import styles from "./styles.module.css";
// const { product, productImg, maximumNotice } = styles;

// const Product = memo(({ id, title, price, img, max }: TProduct) => {
//   const dispatch = useAppDispatch();
//   const [isBtnDisabled, setIsBtnDisabled] = useState(false);
//   const [isFixed, setIsFixed] = useState(false);

//   // جلب الكمية الحالية للمنتج من Redux state
//   const currentQuantityInCart = useAppSelector(
//     (state) => state.cart.items[id] || 0
//   );

//   // إصلاح تلقائي للبيانات الخاطئة (مرة واحدة بس)
//   useEffect(() => {
//     if (!isFixed && currentQuantityInCart > max) {
//       console.log(
//         `Fixing invalid data for product ${id}: ${currentQuantityInCart} > ${max}`
//       );
//       dispatch(fixCartData());
//       setIsFixed(true);
//     }
//   }, [currentQuantityInCart, max, id, dispatch, isFixed]);

//   const currentRemainingQuantity = Math.max(0, max - currentQuantityInCart);
//   const quantityReachedToMax = currentRemainingQuantity <= 0;

//   useEffect(() => {
//     if (!isBtnDisabled) {
//       return;
//     }

//     const debounce = setTimeout(() => {
//       setIsBtnDisabled(false);
//     }, 300);

//     return () => clearTimeout(debounce);
//   }, [isBtnDisabled]);

//   const addToCartHandler = () => {
//     // تأكد إن الكمية ما وصلتش للحد الأقصى قبل الإضافة
//     if (currentQuantityInCart < max) {
//       dispatch(addToCart(id));
//       setIsBtnDisabled(true);
//     }
//   };

//   return (
//     <div className={product}>
//       <div className={productImg}>
//         <img src={img} alt={title} />
//       </div>
//       <h2>{title}</h2>
//       <h3>{price.toFixed(2)} EGP</h3>

//       {/* إظهار رسالة إذا تم الإصلاح */}
//       {currentQuantityInCart > max && (
//         <div
//           style={{
//             fontSize: "10px",
//             color: "red",
//             background: "yellow",
//             padding: "2px",
//           }}
//         >
//           ⚠️ Invalid data detected - auto-fixing...
//         </div>
//       )}

//       <p className={maximumNotice}>
//         {quantityReachedToMax
//           ? "You reach to the limit"
//           : `You can add ${currentRemainingQuantity} item(s)`}
//       </p>
//       <Button
//         variant="info"
//         style={{ color: "white" }}
//         onClick={addToCartHandler}
//         disabled={isBtnDisabled || quantityReachedToMax}
//       >
//         {isBtnDisabled ? (
//           <>
//             <Spinner animation="border" size="sm" /> Loading...
//           </>
//         ) : (
//           "Add to cart"
//         )}
//       </Button>
//     </div>
//   );
// });

// export default Product;

import { useEffect, useState, memo } from "react";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { addToCart } from "@store/cart/cartSlice";
import { Button, Spinner } from "react-bootstrap";
import type { TProduct } from "@customTypes/product";

import styles from "./styles.module.css";
const { product, productImg, maximumNotice } = styles;

const Product = memo(({ id, title, price, img, max }: TProduct) => {
  const dispatch = useAppDispatch();
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);

  // جلب الكمية الحالية للمنتج من Redux state
  const currentQuantityInCart = useAppSelector(
    (state) => state.cart.items[id] || 0
  );

  const currentRemainingQuantity = max - currentQuantityInCart;
  const quantityReachedToMax = currentRemainingQuantity <= 0;

  useEffect(() => {
    if (!isBtnDisabled) {
      return;
    }

    const debounce = setTimeout(() => {
      setIsBtnDisabled(false);
    }, 300);

    return () => clearTimeout(debounce);
  }, [isBtnDisabled]);

  const addToCartHandler = () => {
    // تأكد إن الكمية ما وصلتش للحد الأقصى قبل الإضافة
    if (currentQuantityInCart < max) {
      dispatch(addToCart(id));
      setIsBtnDisabled(true);
    }
  };

  return (
    <div className={product}>
      <div className={productImg}>
        <img src={img} alt={title} />
      </div>
      <h2>{title}</h2>
      <h3>{price.toFixed(2)} EGP</h3>
      <p className={maximumNotice}>
        {quantityReachedToMax
          ? "You reach to the limit"
          : `You can add ${currentRemainingQuantity} item(s)`}
      </p>
      <Button
        variant="info"
        style={{ color: "white" }}
        onClick={addToCartHandler}
        disabled={isBtnDisabled || quantityReachedToMax}
      >
        {isBtnDisabled ? (
          <>
            <Spinner animation="border" size="sm" /> Loading...
          </>
        ) : (
          "Add to cart"
        )}
      </Button>
    </div>
  );
});

export default Product;
