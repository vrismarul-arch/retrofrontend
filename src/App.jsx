import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./routes/routes";
import { CartProvider, useCart } from "./context/CartContext";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { PartnerAuthProvider, usePartnerAuth } from "./hooks/usePartnerAuth";
import LoadingScreen from "./components/loading/LoadingScreen";

function AppWithLoading() {
  const { loading: authLoading } = useAuth();
  const { loading: cartLoading } = useCart();
  const { loading: partnerLoading } = usePartnerAuth();

  const isLoading = authLoading || cartLoading || partnerLoading;

  return (
    <>
      <LoadingScreen loading={isLoading} />
      {!isLoading && <AppRoutes />}
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <PartnerAuthProvider>
          <BrowserRouter>
            <AppWithLoading />
          </BrowserRouter>
        </PartnerAuthProvider>
      </CartProvider>
    </AuthProvider>
  );
}
