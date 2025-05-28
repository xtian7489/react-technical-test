import { useState, useEffect } from "react";
import {
  FaGraduationCap,
  FaUniversity,
  FaTimes,
  FaSpinner,
  FaAlignLeft,
  FaSave,
} from "react-icons/fa";
import apiClient from "../../../utils/axios";

const StudyModal = ({ isOpen, onClose, onSave, initialStudy }) => {
  const [formData, setFormData] = useState({
    name: "",
    institution: "",
    description: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialStudy) {
      setFormData({
        name: initialStudy.name || "",
        institution: initialStudy.institution || "",
        description: initialStudy.description || "",
      });
    } else {
      setFormData({
        name: "",
        institution: "",
        description: "",
      });
    }
  }, [initialStudy]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Nombre del estudio requerido";
    if (!formData.institution.trim())
      newErrors.institution = "Institución requerida";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    const studyData = {
      ...formData,
    };

    try {
      let res;
      if (initialStudy) {
        res = await apiClient.put(`/api/studies/${initialStudy.id}`, studyData);
      } else {
        res = await apiClient.post("/api/studies", studyData);
      }

      if (res.status !== (initialStudy ? 200 : 201)) {
        const errorData = res.data;
        throw new Error(errorData.message || "Error al guardar");
      }

      onSave(res.data);
      setIsLoading(false);
      onClose();
    } catch (error) {
      console.error(error);
      setErrors({
        submit: error.message || "Error al guardar el estudio",
      });
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div
            className="absolute inset-0 bg-zinc-500 opacity-75 dark:bg-zinc-900 dark:opacity-80"
            onClick={onClose}
          ></div>
        </div>

        <div className="inline-block relative z-50 align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full dark:bg-zinc-800">
          <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-start">
              <h3 className="text-lg leading-6 font-medium text-zinc-900 dark:text-white">
                {initialStudy ? "Editar Estudio" : "Crear Nuevo Estudio"}
              </h3>
              <button
                onClick={onClose}
                className="text-zinc-400 hover:text-zinc-500 dark:hover:text-zinc-300"
              >
                <FaTimes className="h-5 w-5" />
              </button>
            </div>

            {errors.submit && (
              <div className="mt-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded">
                {errors.submit}
              </div>
            )}

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                >
                  Nombre del estudio
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaGraduationCap className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.name
                        ? "border-red-300"
                        : "border-zinc-300 dark:border-zinc-600"
                    } rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 dark:bg-zinc-700 dark:text-white`}
                    placeholder="Ej: Licenciatura en Administración de Empresas"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="institution"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                >
                  Institución Educativa
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaUniversity className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                  </div>
                  <input
                    type="text"
                    id="institution"
                    name="institution"
                    value={formData.institution}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-2 border ${
                      errors.institution
                        ? "border-red-300"
                        : "border-zinc-300 dark:border-zinc-600"
                    } rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 dark:bg-zinc-700 dark:text-white`}
                    placeholder="Nombre de la institución"
                  />
                </div>
                {errors.institution && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                    {errors.institution}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                >
                  Descripción (opcional)
                </label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute top-3 left-3">
                    <FaAlignLeft className="h-5 w-5 text-zinc-400 dark:text-zinc-500" />
                  </div>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="block w-full pl-10 pr-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 dark:bg-zinc-700 dark:text-white"
                    placeholder="Descripción del estudio"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  disabled={isLoading}
                  className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 ${
                    isLoading ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                >
                  {isLoading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2" />
                      {initialStudy ? "Guardando..." : "Creando..."}
                    </>
                  ) : (
                    <>
                      {initialStudy ? (
                        <>
                          <FaSave className="mr-2" />
                          Guardar Cambios
                        </>
                      ) : (
                        "Crear Estudio"
                      )}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyModal;
