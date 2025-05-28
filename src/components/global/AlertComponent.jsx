import { useEffect } from "react";
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaExclamationTriangle,
  FaInfoCircle,
  FaTimes,
} from "react-icons/fa";

const AlertComponent = ({ message, type = "info", onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const alertConfig = {
    success: {
      icon: <FaCheckCircle className="h-5 w-5" />,
      bgColor: "bg-green-50",
      textColor: "text-green-800",
      borderColor: "border-green-200",
    },
    error: {
      icon: <FaExclamationCircle className="h-5 w-5" />,
      bgColor: "bg-red-50",
      textColor: "text-red-800",
      borderColor: "border-red-200",
    },
    warning: {
      icon: <FaExclamationTriangle className="h-5 w-5" />,
      bgColor: "bg-yellow-50",
      textColor: "text-yellow-800",
      borderColor: "border-yellow-200",
    },
    info: {
      icon: <FaInfoCircle className="h-5 w-5" />,
      bgColor: "bg-gray-50",
      textColor: "text-gray-800",
      borderColor: "border-gray-200",
    },
  };

  const { icon, bgColor, textColor, borderColor } =
    alertConfig[type] || alertConfig.info;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm">
      <div
        className={`p-4 rounded-md ${bgColor} border ${borderColor} shadow-lg`}
      >
        <div className="flex">
          <div className="flex-shrink-0">{icon}</div>
          <div className="ml-3">
            <p className={`text-sm font-medium ${textColor}`}>{message}</p>
          </div>
          <div className="ml-auto pl-3">
            <div className="-mx-1.5 -my-1.5">
              <button
                type="button"
                onClick={onClose}
                className={`inline-flex rounded-md ${bgColor} p-1.5 ${textColor} hover:bg-opacity-80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-${
                  bgColor.split("-")[1]
                }-50 focus:ring-${bgColor.split("-")[1]}-600`}
              >
                <span className="sr-only">Dismiss</span>
                <FaTimes className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertComponent;
