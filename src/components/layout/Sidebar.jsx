import React, { useState, useEffect } from "react";
import { FaBars, FaChartPie, FaTable, FaUser, FaUsers } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { Link, useLocation } from "react-router-dom";
import {
  FaBagShopping,
  FaRightFromBracket,
  FaRightToBracket,
} from "react-icons/fa6";

const Sidebar = () => {
  const { logout, isAuthenticated, user, isAdmin } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Cerrar sidebar al cambiar de ruta (en mobile)
  useEffect(() => {
    setIsMobileSidebarOpen(false);
  }, [location]);

  // Cerrar sidebar al hacer clic fuera (en mobile)
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById("logo-sidebar");
      const toggleButton = document.querySelector("[data-drawer-toggle]");

      if (
        isMobileSidebarOpen &&
        sidebar &&
        toggleButton &&
        !sidebar.contains(event.target) &&
        !toggleButton.contains(event.target)
      ) {
        setIsMobileSidebarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileSidebarOpen]);

  const toggleSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  return (
    <>
      {/* Botón para toggle en mobile */}
      <button
        data-drawer-target="logo-sidebar"
        data-drawer-toggle="logo-sidebar"
        aria-controls="logo-sidebar"
        type="button"
        onClick={toggleSidebar}
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-zinc-500 rounded-lg sm:hidden hover:bg-zinc-100 focus:outline-none focus:ring-2 focus:ring-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-700 dark:focus:ring-zinc-600"
      >
        <span className="sr-only">Abrir menú</span>
        <FaBars className="w-5 h-5" />
      </button>

      {/* Overlay para mobile */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-30 bg-black bg-opacity-50 sm:hidden" />
      )}

      {/* Sidebar */}
      <aside
        id="logo-sidebar"
        className={`fixed top-0 left-0 z-40 w-64 h-screen transition-transform ${
          isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0`}
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-zinc-50 dark:bg-zinc-800 border-r border-zinc-200 dark:border-zinc-700">
          <div className="flex items-center ps-2.5 mb-5">
            <img
              src="/zoco-logo.png"
              className="h-6 me-3 sm:h-7 dark:hidden"
              alt="Logo"
            />
            <img
              src="/zoco-logo-dark.png"
              className="h-6 me-3 sm:h-7 hidden dark:block"
              alt="Logo"
            />
          </div>
          <ul className="space-y-2 font-medium">
            <li>
              <Link
                to="/"
                className="flex items-center p-2 text-zinc-900 rounded-lg dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 group"
              >
                <FaChartPie className="w-5 h-5 text-zinc-500 transition duration-75 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white" />
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>

            <li>
              <Link
                to={`/users/${user?.id}`}
                className="flex items-center p-2 text-zinc-900 rounded-lg dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 group"
              >
                <FaBagShopping className="w-5 h-5 text-zinc-500 transition duration-75 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white" />
                <span className="flex-1 ms-3 whitespace-nowrap">Perfil</span>
              </Link>
            </li>

            {isAdmin && (
              <>
                <li>
                  <Link
                    to="/users"
                    className="flex items-center p-2 text-zinc-900 rounded-lg dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 group"
                  >
                    <FaUsers className="w-5 h-5 text-zinc-500 transition duration-75 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white" />
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Usuarios
                    </span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/related-data"
                    className="flex items-center p-2 text-zinc-900 rounded-lg dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 group"
                  >
                    <FaTable className="w-5 h-5 text-zinc-500 transition duration-75 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white" />
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      Datos relacionados
                    </span>
                  </Link>
                </li>
              </>
            )}

            {isAuthenticated ? (
              <>
                <li>
                  <Link
                    to={`/users/${user.id}`}
                    className="flex items-center p-2 text-zinc-900 rounded-lg dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 group"
                  >
                    <FaUser className="w-5 h-5 text-zinc-500 transition duration-75 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white" />
                    <span className="flex-1 ms-3 whitespace-nowrap truncate">
                      {user.email}
                    </span>
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="flex items-center w-full p-2 text-zinc-900 rounded-lg dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 group"
                  >
                    <FaRightFromBracket className="w-5 h-5 text-zinc-500 transition duration-75 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white" />
                    <span className="flex-1 ms-3 whitespace-nowrap text-left">
                      Logout
                    </span>
                  </button>
                </li>
              </>
            ) : (
              <li>
                <Link
                  to="/auth/login"
                  className="flex items-center p-2 text-zinc-900 rounded-lg dark:text-white hover:bg-zinc-100 dark:hover:bg-zinc-700 group"
                >
                  <FaRightToBracket className="w-5 h-5 text-zinc-500 transition duration-75 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-white" />
                  <span className="flex-1 ms-3 whitespace-nowrap">Sign In</span>
                </Link>
              </li>
            )}
          </ul>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
