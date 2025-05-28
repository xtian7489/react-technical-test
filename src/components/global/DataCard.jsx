import { useState, useRef, useEffect } from "react";
import { FaEllipsisV, FaEdit, FaTrash } from "react-icons/fa";

const DataCard = ({
  data,
  titleKey,
  subtitleKeys,
  onEdit,
  onDelete,
  emptyMessage,
  icon: Icon,
  badgeKey,
  badgeColor = "green",
}) => {
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const dropdownRefs = useRef({});

  const toggleDropdown = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };

  const handleClickOutside = (event) => {
    if (
      Object.values(dropdownRefs.current).every(
        (ref) => ref && !ref.contains(event.target)
      )
    ) {
      setOpenDropdownId(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (data.length === 0) {
    return (
      <div className="p-6 text-center text-zinc-500 dark:text-zinc-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="divide-y divide-zinc-200 dark:divide-zinc-700">
      {data.map((item) => (
        <div
          key={item.id}
          className="p-4 hover:bg-zinc-50 dark:hover:bg-zinc-700 relative"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center mb-2">
                {Icon && <Icon className={`text-${badgeColor}-500 mr-2`} />}
                <h3 className="font-medium text-zinc-900 dark:text-white">
                  {item[titleKey]}
                </h3>
              </div>

              {subtitleKeys.map((key) => (
                <div
                  key={key}
                  className="text-sm text-zinc-500 dark:text-zinc-400 mb-1"
                >
                  {item[key]}
                </div>
              ))}

              {badgeKey && item[badgeKey] && (
                <span
                  className={`inline-block mt-2 px-2 py-1 text-xs leading-4 font-semibold rounded-full bg-${badgeColor}-100 text-${badgeColor}-800 dark:bg-${badgeColor}-900 dark:text-${badgeColor}-200`}
                >
                  {item[badgeKey]}
                </span>
              )}
            </div>

            {(onEdit || onDelete) && (
              <div
                className="relative"
                ref={(el) => (dropdownRefs.current[item.id] = el)}
              >
                <button
                  onClick={() => toggleDropdown(item.id)}
                  className="text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-300 p-1"
                  aria-label="Menú de acciones"
                >
                  <FaEllipsisV />
                </button>

                {openDropdownId === item.id && (
                  <div className="dropdown-menu absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg dark:bg-zinc-700 z-10">
                    {onEdit && (
                      <button
                        onClick={() => {
                          onEdit(item);
                          setOpenDropdownId(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-600"
                      >
                        <FaEdit className="inline mr-2" /> Editar
                      </button>
                    )}
                    {onDelete && (
                      <button
                        onClick={() => {
                          onDelete(item.id);
                          setOpenDropdownId(null);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-zinc-100 dark:text-red-400 dark:hover:bg-zinc-600"
                      >
                        <FaTrash className="inline mr-2" /> Eliminar
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataCard;
