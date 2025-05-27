export const setItem = (db_name, key, value) => {
  try {
    const db = JSON.parse(localStorage.getItem(db_name));
    db[key] = value;

    window.localStorage.setItem(db_name, JSON.stringify(db));
  } catch (error) {
    console.error(error);
  }
};

export const getItem = (key) => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : undefined;
  } catch (error) {
    console.error(error);
  }
};

export const removeItem = (key) => {
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(error);
  }
};
