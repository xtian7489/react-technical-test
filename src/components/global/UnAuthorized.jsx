import { FaLock, FaHome, FaEnvelope, FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";

const UnAuthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md bg-white dark:bg-zinc-800 rounded-lg shadow-lg overflow-hidden border border-zinc-200 dark:border-zinc-700">
        <div className="bg-red-600 dark:bg-red-700 p-4 text-center">
          <div className="flex justify-center mb-3">
            <div className="bg-white dark:bg-zinc-800 p-3 rounded-full">
              <FaLock className="text-red-600 dark:text-red-500 text-3xl" />
            </div>
          </div>
          <h1 className="text-xl font-bold text-white">Acceso Denegado</h1>
        </div>

        <div className="p-6 text-center">
          <p className="text-zinc-700 dark:text-zinc-300 mb-6">
            No tienes los permisos necesarios para acceder a esta página. Si
            crees que esto es un error, por favor contacta al administrador.
          </p>

          <div className="space-y-4">
            <button
              onClick={() => navigate(-1)}
              className="w-full flex items-center justify-center px-4 py-2 bg-zinc-200 dark:bg-zinc-700 text-zinc-800 dark:text-zinc-200 rounded-md hover:bg-zinc-300 dark:hover:bg-zinc-600 transition-colors"
            >
              <FaArrowLeft className="mr-2" />
              Volver atrás
            </button>

            <Link
              to="/"
              className="w-full flex items-center justify-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <FaHome className="mr-2" />
              Ir al inicio
            </Link>
          </div>
        </div>

        <div className="bg-zinc-100 dark:bg-zinc-700 px-4 py-3 text-center">
          <p className="text-xs text-zinc-600 dark:text-zinc-400">
            Código de error: 403 - Forbidden
          </p>
        </div>
      </div>
    </div>
  );
};

export default UnAuthorized;
