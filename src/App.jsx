import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
  Outlet,
  useParams,
  useMatch,
} from "react-router-dom";
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
const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading)
    return (
      <Loading
        type="user"
        message=" Verificando sesión..."
        subMessage="Por favor espera un momento"
      />
    );

  return isAuthenticated && !loading ? (
    <Outlet />
  ) : (
    <Navigate to="/auth/login" />
  );
};

const AdminRoute = () => {
  const { isAdmin, loading, user } = useAuth();
  const match = useMatch("/users/:id");
  const id = match?.params.id;

  if (loading)
    return (
      <Loading
        type="user"
        message="Verificando sesión..."
        subMessage="Por favor espera un momento"
      />
    );

  return isAdmin || user.id === id ? <Outlet /> : <UnAuthorized />;
};

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<SignUp />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
        </Route>
      </Route>
      <Route element={<AdminRoute />}>
        <Route path="/" element={<Layout />}>
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="users" element={<Users />} />
          <Route path="related-data" element={<RelatedData />} />
        </Route>
      </Route>
    </>
  )
);

const App = () => {
  return (
    <>
      <AlertProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </AlertProvider>
    </>
  );
};

export default App;
