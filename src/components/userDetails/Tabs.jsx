import React from "react";

const Tabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <nav className="flex -mb-px">
        <button
          onClick={() => setActiveTab("profile")}
          className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === "profile"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Información personal
        </button>
        <button
          onClick={() => setActiveTab("education")}
          className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === "education"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Formación académica
        </button>
        <button
          onClick={() => setActiveTab("address")}
          className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === "address"
              ? "border-blue-500 text-blue-600 dark:text-blue-400"
              : "border-transparent text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          }`}
        >
          Dirección
        </button>
      </nav>
    </div>
  );
};

export default Tabs;
