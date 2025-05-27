import React from "react";
import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Navigate,
  Outlet,
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

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/auth/login" element={<Login />} />
      <Route path="/auth/signup" element={<SignUp />} />

      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="users/:id" element={<UserDetail />} />
          <Route path="related-data" element={<RelatedData />} />
        </Route>
      </Route>
    </>
  )
);

const App = () => {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  );
};

export default App;
