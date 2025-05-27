import { createContext, useContext, useState } from "react";
import AlertComponent from "../components/global/AlertComponent";

const AlertContext = createContext();

const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);

  const showAlert = (message, type = "info", duration = 5000) => {
    setAlert({ message, type });

    if (duration) {
      setTimeout(() => {
        setAlert(null);
      }, duration);
    }
  };

  const hideAlert = () => {
    setAlert(null);
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {alert && (
        <AlertComponent
          message={alert.message}
          type={alert.type}
          onClose={hideAlert}
        />
      )}
    </AlertContext.Provider>
  );
};

export default AlertProvider;
export const useAlert = () => useContext(AlertContext);
