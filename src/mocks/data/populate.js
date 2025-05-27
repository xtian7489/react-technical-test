import address from "./address";
import studies from "./studies";
import users from "./users";

const { VITE_DB_KEY } = import.meta.env;

export const populatedb = () => {
  const db = localStorage.getItem(VITE_DB_KEY);

  if (!db) {
    const initialData = {
      users,
      studies,
      address,
    };

    localStorage.setItem(VITE_DB_KEY, JSON.stringify(initialData));
    console.log(`Base de datos inicializada en localStorage ${VITE_DB_KEY}`);
  }
};
