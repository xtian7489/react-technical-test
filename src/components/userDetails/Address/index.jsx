import { FaMapMarkerAlt, FaPlus, FaEdit } from "react-icons/fa";
import AddressModal from "./AddressModal";
import { useState } from "react";

const Address = ({ user, fetchUser }) => {
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);

  return (
    <div className="grid md:grid-cols-2 gap-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Dirección principal
          </h3>
          {user.address?.street && (
            <button
              onClick={() => setIsAddressModalOpen(true)}
              className="text-sm flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              <FaEdit className="mr-1" /> Editar
            </button>
          )}
        </div>

        {user.address?.street ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Dirección
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white flex items-center">
                <FaMapMarkerAlt className="mr-2" />
                {user.address.street}, {user.address.city},{" "}
                {user.address.country}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Código postal
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {user.address.postalCode || "No especificado"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">
                Localidad
              </label>
              <p className="mt-1 text-sm text-gray-900 dark:text-white">
                {user.address.city} - {user.address.province}
              </p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <FaMapMarkerAlt className="mx-auto text-gray-400 text-4xl mb-3" />
            <p className="text-gray-500 dark:text-gray-400 mb-4">
              No se ha registrado dirección
            </p>
            <button
              onClick={() => setIsAddressModalOpen(true)}
              className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md text-sm hover:bg-blue-700 mx-auto"
            >
              <FaPlus className="mr-1" /> Agregar dirección
            </button>
          </div>
        )}
      </div>

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => setIsAddressModalOpen(false)}
        user={user}
        initialAddress={user.address}
        refreshData={fetchUser}
      />
    </div>
  );
};

export default Address;
