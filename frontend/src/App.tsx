import { Routes, Route } from 'react-router-dom'
import CataloguePage from './pages/CataloguePage'
import PetDetailPage from './pages/PetDetailPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import AdminPage from './pages/AdminPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<CataloguePage />} />
      <Route path="/pets/:id" element={<PetDetailPage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  )
}
