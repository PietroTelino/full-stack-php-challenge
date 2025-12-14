import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import "./index.css";

function Protected({ children }: { children: React.ReactNode }) {
  const [ok, setOk] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/me`, { credentials: "include" })
      .then((r) => setOk(r.ok))
      .catch(() => setOk(false));
  }, []);

  if (ok === null) return <div style={{ padding: 24 }}>Carregando...</div>;
  if (!ok) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/"
          element={
            <Protected>
              <DashboardPage />
            </Protected>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
