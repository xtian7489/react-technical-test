import React from "react";
import {
  FaUser,
  FaCog,
  FaSpinner,
  FaCloud,
  FaDatabase,
  FaList,
} from "react-icons/fa";

const Loading = ({
  type = "default",
  message = "Cargando contenido",
  subMessage = "Por favor espera un momento",
  fullScreen = false,
}) => {
  const loadingTypes = {
    default: {
      icon: <FaCog className="animate-spin text-blue-500 text-2xl" />,
    },
    user: {
      icon: <FaUser className="text-blue-500 text-xl" />,
    },
    data: {
      icon: <FaDatabase className="text-blue-500 text-xl" />,
    },
    list: {
      icon: <FaList className="text-blue-500 text-xl" />,
    },
    cloud: {
      icon: <FaCloud className="text-blue-500 text-xl" />,
    },
  };

  const currentType = loadingTypes[type] || loadingTypes.default;

  return (
    <div
      className={`${
        fullScreen ? "fixed inset-0 min-h-screen" : "w-full min-h-screen"
      } bg-gray-50/80 dark:bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50`}
    >
      <div className="text-center p-6 bg-blue-100 dark:bg-blue-900/20 rounded-xl shadow-lg border border-blue-200 dark:border-blue-700 max-w-md w-full mx-4">
        <div className="flex justify-center mb-4">
          <div className="relative">
            <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              {currentType.icon}
            </div>
          </div>
        </div>

        <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">
          {message}
        </h3>
        {subMessage && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
            {subMessage}
          </p>
        )}
      </div>
    </div>
  );
};

export default Loading;
