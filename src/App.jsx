import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
  Outlet,
  useMatch,
} from "react-router-dom";

// Componentes de páginas y utilidades
import Login from "./pages/auth/Login";
import Dashboard from "./pages/Dashboard";
import Layout from "./Layout";
import { AuthProvider, useAuth } from "./context/AuthContext";
import SignUp from "./pages/auth/Signup";
import Users from "./pages/Users";
import Loading from "./components/global/Loading";
import UserDetail from "./pages/UserDetail";
import RelatedData from "./pages/RelatedData";
import AlertProvider from "./context/AlertContext";
import UnAuthorized from "./components/global/UnAuthorized";

// Protege rutas que requieren autenticación
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <Loading type="user" message="Verificando sesión..." />;

  return isAuthenticated ? <Outlet /> : <Navigate to="/auth/login" />;
};

// Protege rutas que requieren ser admin o dueño del recurso
const AdminRoute = () => {
  const { isAdmin, loading, user } = useAuth();
  const match = useMatch("/users/:id");
  const id = match?.params.id;

  if (loading) return <Loading type="user" message="Verificando permisos..." />;

  return isAdmin || user.id === id ? <Outlet /> : <UnAuthorized />;
};

// Configuración principal de rutas
const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Rutas públicas */}
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<SignUp />} />

      {/* Rutas protegidas */}
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />

          {/* Rutas administrativas */}
          <Route element={<AdminRoute />}>
            <Route path="users/:id" element={<UserDetail />} />
            <Route path="users" element={<Users />} />
            <Route path="related-data" element={<RelatedData />} />
          </Route>
        </Route>
      </Route>
    </>
  )
);

// Componente principal que provee los contextos
const App = () => {
  return (
    <AlertProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </AlertProvider>
  );
};

export default App;
