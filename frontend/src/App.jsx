import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import AppShell from './components/AppShell';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import SupplyChainMap from './pages/SupplyChainMap';
import Suppliers from './pages/Suppliers';
import Corridors from './pages/Corridors';
import Events from './pages/Events';
import Reserves from './pages/Reserves';
import Scenarios from './pages/Scenarios';
import Recommendations from './pages/Recommendations';
import Alerts from './pages/Alerts';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route element={<ProtectedRoute />}>
            <Route element={<AppShell />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/map" element={<SupplyChainMap />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/corridors" element={<Corridors />} />
              <Route path="/events" element={<Events />} />
              <Route path="/reserves" element={<Reserves />} />
              <Route path="/scenarios" element={<Scenarios />} />
              <Route path="/recommendations" element={<Recommendations />} />
              <Route path="/alerts" element={<Alerts />} />
            </Route>
          </Route>

          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
