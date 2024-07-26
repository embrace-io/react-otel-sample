import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import SpansProvider from "./components/SpansProvider/SpansProvider";

const App = () => {
  return (
    <SpansProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products/:productId" element={<ProductDetails />} />
        </Routes>
      </BrowserRouter>
    </SpansProvider>
  );
};

export default App;
