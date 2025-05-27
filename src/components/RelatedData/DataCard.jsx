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
  if (data.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 dark:text-gray-400">
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200 dark:divide-gray-700">
      {data.map((item) => (
        <div
          key={item.id}
          className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center mb-2">
                {Icon && <Icon className={`text-${badgeColor}-500 mr-2`} />}
                <h3 className="font-medium text-gray-900 dark:text-white">
                  {item[titleKey]}
                </h3>
              </div>

              {subtitleKeys.map((key) => (
                <div
                  key={key}
                  className="text-sm text-gray-500 dark:text-gray-400 mb-1"
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
              <div className="dropdown relative">
                <button className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                  <FaEllipsisV />
                </button>
                <div className="dropdown-menu absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg dark:bg-gray-700 z-10 hidden">
                  {onEdit && (
                    <button
                      onClick={() => onEdit(item)}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600"
                    >
                      <FaEdit className="inline mr-2" /> Editar
                    </button>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item.id)}
                      className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 dark:text-red-400 dark:hover:bg-gray-600"
                    >
                      <FaTrash className="inline mr-2" /> Eliminar
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default DataCard;
