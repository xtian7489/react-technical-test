import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaCheck, FaTimes, FaSpinner } from "react-icons/fa";
import apiClient from "../../../utils/axios";
import { useAlert } from "../../../context/AlertContext";

const AddressModal = ({
  isOpen,
  onClose,
  user = null,
  refreshData,
  initialAddress = null,
  onSuccess = () => {},
}) => {
  const { showAlert } = useAlert();

  const [address, setAddress] = useState({
    street: "",
    postalCode: "",
    city: "",
    province: "",
    country: "Argentina",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      const initialData = initialAddress ||
        user?.address || {
          street: "",
          postalCode: "",
          city: "",
          province: "",
          country: "Argentina",
        };
      setAddress(initialData);
    }
  }, [isOpen, user, initialAddress]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      let endpoint, method;

      if (user && !address.id) {
        endpoint = `/api/users/${user.id}/address`;
        method = "POST";
      } else if (address.id) {
        endpoint = `/api/address/${address.id}`;
        method = "PUT";
      } else {
        endpoint = "/api/address";
        method = "POST";
      }

      const res = await apiClient({
        method,
        url: endpoint,
        data: address,
      });

      if (res.status === 200 || res.status === 201) {
        refreshData?.();
        onSuccess(res.data);
        onClose();
      }
    } catch (error) {
      showAlert(
        error.response?.data?.message || "Error al guardar la dirección",
        "error"
      );
    } finally {
      setIsSaving(false);
    }
  };

  if (!isOpen) return null;

  const isEditing = !!address.id;

  return (
    <div className="fixed inset-0 z-40 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div
            className="absolute inset-0 bg-zinc-500 opacity-75 dark:bg-zinc-900 dark:opacity-80"
            onClick={!isSaving ? onClose : undefined}
          ></div>
        </div>

        <div className="inline-block relative z-50 align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full dark:bg-zinc-800">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg leading-6 font-medium text-zinc-900 dark:text-white">
                {isEditing ? "Editar Dirección" : "Agregar Dirección"}
              </h3>
              <button
                onClick={onClose}
                className="text-zinc-400 hover:text-zinc-500 dark:hover:text-zinc-300"
                disabled={isSaving}
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            {error && (
              <div className="mt-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
                {error}
              </div>
            )}

            <div className="mt-6">
              <form onSubmit={handleSubmit}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                      Calle
                    </label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaMapMarkerAlt className="h-4 w-4 text-zinc-400" />
                      </div>
                      <input
                        type="text"
                        name="street"
                        value={address.street}
                        onChange={handleChange}
                        className="block w-full pl-10 pr-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                        required
                        disabled={isSaving}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Código Postal
                      </label>
                      <input
                        type="text"
                        name="postalCode"
                        value={address.postalCode}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                        required
                        disabled={isSaving}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Ciudad
                      </label>
                      <input
                        type="text"
                        name="city"
                        value={address.city}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                        required
                        disabled={isSaving}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        Provincia
                      </label>
                      <input
                        type="text"
                        name="province"
                        value={address.province}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                        required
                        disabled={isSaving}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                        País
                      </label>
                      <select
                        name="country"
                        value={address.country}
                        onChange={handleChange}
                        className="block w-full px-3 py-2 border border-zinc-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 dark:bg-zinc-700 dark:border-zinc-600 dark:text-white"
                        required
                        disabled={isSaving}
                      >
                        <option value="Argentina">Argentina</option>
                        <option value="Chile">Chile</option>
                        <option value="Uruguay">Uruguay</option>
                        <option value="Paraguay">Paraguay</option>
                        <option value="Brasil">Brasil</option>
                        <option value="Otro">Otro</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="mt-6 bg-zinc-50 dark:bg-zinc-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse rounded-b-lg">
                  <button
                    type="submit"
                    disabled={isSaving}
                    className={`w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-gray-600 text-base font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:ml-3 sm:w-auto sm:text-sm ${
                      isSaving ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSaving ? (
                      <>
                        <FaSpinner className="animate-spin mr-2 h-4 w-4" />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <FaCheck className="mr-2 h-4 w-4" />
                        {isEditing ? "Actualizar" : "Guardar"} Dirección
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={isSaving}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-zinc-300 dark:border-zinc-600 shadow-sm px-4 py-2 bg-white dark:bg-zinc-600 text-base font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;
