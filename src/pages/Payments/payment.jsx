import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useContext, useState } from "react";

import { ClipLoader } from "react-spinners";
import CurrencyFormat from "../../Components/Currancyformaters/CurrancyFormater.jsx";
import { DataContext } from "../../Components/DataProviders/DataProvider";
import LayOut from "../../Layouts/Layout.jsx";
import ProductCard from "../../Components/Products/ProductCard.jsx";
import { Type } from "../../Utility/action.types.js";
import { axiosInstance } from "../../Api/axios";
import classes from "./payment.module.css";
import { db } from "../../Utility/firebase.js";
import { useNavigate } from "react-router-dom";

// import axios from "axios";

const Payment = () => {
  const [{ user, basket }, dispatch] = useContext(DataContext);
  // console.log(user);

  const totalItem = basket?.reduce((amount, item) => {
    return item.amount + amount;
  }, 0);

  const total = basket.reduce((amount, item) => {
    return item.price * item.amount + amount;
  }, 0);

  const [cardError, setCardError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();

  const handleChange = (e) => {
    //  console.log(e);
    e.error?.message ? setCardError(e?.error?.message) : setCardError("");
  };
  const handlePayment = async (e) => {
    e.preventDefault();

    try {
      setProcessing(true);
      const response = await axiosInstance({
        method: "POST",
        url: `/payment/create?total=${total * 100}`,
      });

      const clientSecret = response.data?.clientSecret;

      const paymentIntentResponse = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
          },
        }
      );

      // Log the paymentIntentResponse to check its structure
      console.log(paymentIntentResponse);

      // Check if paymentIntentResponse has the expected structure
      const paymentIntent = paymentIntentResponse.paymentIntent;

      if (
        paymentIntent &&
        paymentIntent.id &&
        paymentIntent.amount !== undefined
      ) {
        await db
          .collection("users")
          .doc(user.uid)
          .collection("orders")
          .doc(paymentIntent.id)
          .set({
            basket: basket,
            amount: paymentIntent.amount,
            created: paymentIntent.created,
          });

        dispatch({ type: Type.EMPTY_BASKET });
        navigate("/orders", { state: { msg: "You have placed a new Order" } });
      } else {
        console.error("Payment Intent is not valid:", paymentIntentResponse);
      }

      setProcessing(false);
    } catch (error) {
      console.log(error);
      setProcessing(false);
    }
  };
  return (
    <LayOut>
      {/* header */}
      <div className={classes.payment__header}>
        Checkout ({totalItem})items
        {/* <hr /> */}
      </div>

      {/* Payment method */}

      <section className={classes.payment}>
        {/* address */}
        <div className={classes.flex}>
          <h3>Delivery Address</h3>

          <div>
            <div>{user?.email}</div>
            <div>123 React Lane</div>
            <div>Addis Ababa, Kera</div>
          </div>
        </div>

        <hr />
        {/* product */}
        <div className={classes.flex}>
          <h3>Review items and delivery</h3>

          <div>
            {basket?.map((item) => (
              <ProductCard key={item.id} product={item} flex={true} />
            ))}
          </div>
        </div>
        <hr />

        {/* card form */}
        <div className={classes.flex}>
          <h3>Payment methods</h3>
          <div className={classes.payment__card__container}>
            <div className={classes.payment__details}>
              <form onSubmit={handlePayment}>
                {/* error */}
                {cardError && (
                  <small style={{ color: "red" }}>{cardError}</small>
                )}
                <CardElement onChange={handleChange} />

                {/* price */}
                <div className={classes.payment__price}>
                  <div>
                    <span style={{ display: "flex", gap: "10px" }}>
                      <p>Total Order |</p> <CurrencyFormat amount={total} />
                    </span>
                  </div>
                  <button type="submit">
                    {processing ? (
                      <div className={classes.loading}>
                        <ClipLoader color="gray" size={12} />
                        <p>Please Wait ...</p>
                      </div>
                    ) : (
                      "Pay Now"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </LayOut>
  );
};
export default Payment;
