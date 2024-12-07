import { Route, BrowserRouter as Router, Routes } from "react-router-dom";

import Auth from "./pages/Auths/Auth";
import Cart from "./pages/Carts/Cart";
import { Elements } from "@stripe/react-stripe-js";
import Landing from "./pages/Land/Landing";
import Orders from "./pages/Order/Orders";
import Payment from "./pages/Payments/payment";
import ProductDetail from "./pages/ProductsDetail/ProductDetail";
import ProtectedRoute from "./Components/Protectedroutes/ProtectedRoute";
import Results from "./Components/Results/Result";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(
  "pk_test_51QMDNlBfoKQhjj2DbbDPmEYIUZrOfJLcmqLQgEj3T3pMKMDgfNw3KiKXR1ua6V2qxDUcrIVrhOzueQSsKl0RPaLI00j5OdmNi1"
);

const Routing = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/payments"
          element={
            <ProtectedRoute msg={"You must log in to pay"} redirect={"/auth"}>
              <Elements stripe={stripePromise}>
                <Payment />
              </Elements>
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute
              msg={"You must log in to access your orders"}
              redirect={"/auth"}
            >
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route path="/Category/:categoryName" element={<Results />} />
        <Route path="/products/:productId" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
      </Routes>
    </Router>
  );
};
export default Routing;
