import { useAppDispatch } from "@store/hooks";
import { actPlaceOrder } from "@store/orders/ordersSlice";
import { clearCartAfterPlaceOrder } from "@store/cart/cartSlice";
import { useState } from "react";
import type { TProduct } from "@types";
import { Button, Modal, Spinner } from "react-bootstrap";
import styles from "./styles.module.css";

type CartSubtotalPriceProps = {
  products: TProduct[];
  userAccessToken: string | null;
};

const CartSubtotalPrice = ({
  products,
  userAccessToken,
}: CartSubtotalPriceProps) => {
  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const subtotal = products.reduce((accumulator, el) => {
    const price = el.price;
    const quantity = el.quantity;
    if (quantity && typeof quantity === "number") {
      return accumulator + price * quantity;
    } else {
      return accumulator;
    }
  }, 0);

  const modalHandler = () => {
    setShowModal(!showModal);
    setError(null);
  };

  const placeOrderHandler = () => {
    setLoading(true);
    dispatch(actPlaceOrder(subtotal))
      .unwrap()
      .then(() => {
        dispatch(clearCartAfterPlaceOrder());
        setShowModal(false);
      })
      .catch((error) => {
        setError(error);
      })
      .finally(() => setLoading(false));
  };

  return (
    <>
      <Modal show={showModal} onHide={modalHandler} backdrop="static">
        <Modal.Header closeButton>
          <Modal.Title>Placing Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to place order with Subtotal:{" "}
          {subtotal.toFixed(2)} EGP
          {!loading && error && (
            <p style={{ color: "#DC3545", marginTop: "10px" }}>{error}</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={modalHandler}>
            Close
          </Button>
          <Button
            variant="info"
            style={{ color: "white" }}
            onClick={placeOrderHandler}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm"></Spinner> Loading...
              </>
            ) : (
              "Confirm"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      <div className={styles.container}>
        <span>Subtotal:</span>
        <span>{subtotal.toFixed(2)} EGP</span>
      </div>
      {userAccessToken && (
        <div className={styles.container}>
          <span> </span>
          <span>
            <Button
              variant="info"
              style={{ color: "white" }}
              onClick={modalHandler}
            >
              Place Order
            </Button>
          </span>
        </div>
      )}
    </>
  );
};

export default CartSubtotalPrice;
