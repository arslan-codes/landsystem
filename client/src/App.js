import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import LandInspector from "./pages/LandInspector";
import Property from "./pages/Property";
import MarketPlace from "./pages/Marketplace";
import SellerPage from "./pages/sellerpage";
import BuyProperty from "./pages/BuyProperty";
function App() {
  return (
    <>
      <Routes>
        <Route path="/BuyProperty" element={<BuyProperty />}></Route>
        <Route path="/sellerpage" element={<SellerPage />}></Route>
        <Route path="/MarketPlace" element={<MarketPlace />}></Route>
        <Route path="/Property" element={<Property />}></Route>
        <Route path="/LandInspector" element={<LandInspector />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/" element={<HomePage />}></Route>
        <Route path="/about" element={<About />}></Route>
        <Route path="/contact" element={<Contact />}></Route>
      </Routes>
    </>
  );
}

export default App;
