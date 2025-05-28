import React from "react";

const Tabs = ({ activeTab, setActiveTab }) => {
  return (
    <div className="border-b border-zinc-200 dark:border-zinc-700 ">
      <nav className="flex -mb-px">
        <button
          onClick={() => setActiveTab("profile")}
          className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === "profile"
              ? "border-gray-500 text-gray-600 dark:text-gray-400"
              : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          Información personal
        </button>
        <button
          onClick={() => setActiveTab("education")}
          className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === "education"
              ? "border-gray-500 text-gray-600 dark:text-gray-400"
              : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          Formación académica
        </button>
        <button
          onClick={() => setActiveTab("address")}
          className={`mr-8 py-4 px-1 border-b-2 font-medium text-sm ${
            activeTab === "address"
              ? "border-gray-500 text-gray-600 dark:text-gray-400"
              : "border-transparent text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
          }`}
        >
          Dirección
        </button>
      </nav>
    </div>
  );
};

export default Tabs;
