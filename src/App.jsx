import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AdminAuthProvider } from "./lib/context/AuthContext.jsx";
import ProtectedRoutes from "./component/ProtectedRoutes.jsx";
import Homepage from "./pages/Homepage.jsx";
import AdminDashboard from "./pages/Admin.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoutes>
                <AdminDashboard />
              </ProtectedRoutes>
            }
          />
          <Route path="*" element={<Homepage />} />
        </Routes>
      </AdminAuthProvider>
    </BrowserRouter>
  );
}