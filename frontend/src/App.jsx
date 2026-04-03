import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import TopPage from './pages/TopPage';
import RoomsPage from './pages/RoomsPage';
import RoomDetailPage from './pages/RoomDetailPage';
import PlansPage from './pages/PlansPage';
import ReservePage from './pages/ReservePage';
import ReserveCompletePage from './pages/ReserveCompletePage';
import FacilitiesPage from './pages/FacilitiesPage';
import AccessPage from './pages/AccessPage';
import NewsPage from './pages/NewsPage';
import ContactPage from './pages/ContactPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<TopPage />} />
          <Route path="/rooms" element={<RoomsPage />} />
          <Route path="/rooms/:id" element={<RoomDetailPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/reserve" element={<ReservePage />} />
          <Route path="/reserve/complete" element={<ReserveCompletePage />} />
          <Route path="/facilities" element={<FacilitiesPage />} />
          <Route path="/access" element={<AccessPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
