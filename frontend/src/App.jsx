import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Inventories from './Pages/Inventories';
import Orders from './pages/Orders';

function App() {
  return (
    <Router>
      <div>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/inventories" element={<Inventories />} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>
      <footer>
      </footer>
    </Router>
  );
}

export default App;