import { FaEdit, FaTrash } from "react-icons/fa";

const DataTable = ({ columns, data, onEdit, onDelete, emptyMessage }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider ${
                  column.className || ""
                }`}
              >
                {column.title}
              </th>
            ))}
            <th
              className={`px-4 md:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider`}
            >
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700 dark:text-white">
          {data.length > 0 ? (
            data.map((item) => (
              <tr
                key={item.id}
                className="hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                {columns.map((column) => (
                  <td
                    key={`${item.id}-${column.key}`}
                    className={`px-4 md:px-6 py-4 ${
                      column.cellClassName || ""
                    }`}
                  >
                    {column.render ? column.render(item) : item[column.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="px-4 md:px-6 py-4 text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(item)}
                          className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                        >
                          <FaEdit className="inline mr-1" /> Editar
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(item.id)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                        >
                          <FaTrash className="inline mr-1" /> Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
