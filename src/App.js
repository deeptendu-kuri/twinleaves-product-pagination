import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import HomePage from './components/DataTable'; // The component using useLocation
import ProductDetailsPage from "./components/ProductDetailsPage"


function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/product-details/:id" element={<ProductDetailsPage />} />
        </Routes>
      </Router>
  );
}

export default App;

