import { FaSearch, FaPlus } from "react-icons/fa";

const SearchBox = ({
  searchTerm,
  onSearchChange,
  actionButtonText,
  actionButton,
  placeholder,
}) => {
  return (
    <div className="flex flex-col md:flex-row w-full md:w-auto gap-3">
      <div className="relative w-full">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="text-zinc-400" />
        </div>
        <input
          type="text"
          placeholder={placeholder}
          className="pl-10 pr-4 py-2 border border-zinc-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-${focusRingColor}-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
          value={searchTerm}
          onChange={onSearchChange}
        />
      </div>
      {actionButton && (
        <button
          onClick={actionButton}
          className="flex items-center justify-center px-4 py-2 bg-${focusRingColor}-600 text-white rounded-md hover:bg-${focusRingColor}-700 whitespace-nowrap"
        >
          <FaPlus className="mr-2" />
          <span className="hidden sm:inline">{actionButtonText}</span>
          <span className="sm:hidden">Nuevo</span>
        </button>
      )}
    </div>
  );
};

export default SearchBox;
