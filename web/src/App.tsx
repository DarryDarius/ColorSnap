import { HashRouter, Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { ScrollToTop } from "./components/ScrollToTop";
import { ToastProvider } from "./components/ToastProvider";
import { HomePage } from "./pages/HomePage";
import { AnalysisPage } from "./pages/AnalysisPage";
import { ResultPage } from "./pages/ResultPage";
import { ConsultationPage } from "./pages/ConsultationPage";
import { BookingPage } from "./pages/BookingPage";
import { ShoppingCartPage } from "./pages/ShoppingCartPage";
import { PaymentPage } from "./pages/PaymentPage";
import { AboutPage } from "./pages/AboutPage";
import { FaqPage } from "./pages/FaqPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export function App() {
  return (
    <ToastProvider>
      <HashRouter>
        <ScrollToTop />
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/analysis" element={<AnalysisPage />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/consultation" element={<ConsultationPage />} />
            <Route path="/booking" element={<BookingPage />} />
            <Route path="/shoppingcart" element={<ShoppingCartPage />} />
            <Route path="/payment" element={<PaymentPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </HashRouter>
    </ToastProvider>
  );
}


