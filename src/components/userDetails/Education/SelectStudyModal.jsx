import { useState, useEffect } from "react";
import {
  FaGraduationCap,
  FaUniversity,
  FaCheck,
  FaTimes,
  FaSpinner,
  FaPlus,
} from "react-icons/fa";
import { useAuth } from "../../../context/AuthContext";
import StudyModal from "./StudyModal";
import apiClient from "../../../utils/axios";

const SelectStudyModal = ({
  isOpen,
  onClose,
  prevUserStudies,
  user,
  fetchUser,
}) => {
  const [institutions, setInstitutions] = useState({});
  const [isFetching, setIsFetching] = useState(false);
  const [selectedStudies, setSelectedStudies] = useState(prevUserStudies);
  const [showCreatorModal, setShowCreatorModal] = useState(false);
  const { isAdmin } = useAuth();

  const fetchStudies = async () => {
    setIsFetching(true);
    try {
      const res = await apiClient.get("/api/studies");

      const { data } = res;

      const institutionsMap = data.reduce((acc, study) => {
        if (!acc[study.institution]) {
          acc[study.institution] = [];
        }
        acc[study.institution].push(study);
        return acc;
      }, {});

      setInstitutions(institutionsMap);
    } catch (error) {
      console.error("Error fetching studies:", error);
    } finally {
      setIsFetching(false);
    }
  };

  const toggleStudySelection = (study) => {
    setSelectedStudies((prev) =>
      prev.some((s) => s === study)
        ? prev.filter((s) => s !== study)
        : [...prev, study]
    );
  };

  const handleSave = async () => {
    const res = await apiClient.put(`/api/users/${user.id}/studies`, {
      studies: selectedStudies,
    });
    if (res.status !== 200) {
      console.error("Error saving studies:", res.data);
      return;
    }
    fetchUser();
  };

  useEffect(() => {
    if (isOpen) {
      fetchStudies();
      if (prevUserStudies.length === 0) setSelectedStudies([]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40 overflow-y-auto">
        <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div
              className="absolute inset-0 bg-gray-500 opacity-75 dark:bg-gray-900 dark:opacity-80"
              onClick={onClose}
            ></div>
          </div>

          <div className="relative z-50 inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full dark:bg-gray-800">
            <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Seleccionar Estudios
                </h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-6">
                {isFetching ? (
                  <div className="text-center py-8">
                    <FaSpinner className="animate-spin mx-auto text-gray-400 text-2xl mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Cargando estudios...
                    </p>
                  </div>
                ) : Object.keys(institutions).length > 0 ? (
                  <div className="max-h-96 overflow-y-auto">
                    {Object.entries(institutions).map(
                      ([institution, studies]) => (
                        <div key={institution} className="mb-4">
                          <div className="flex items-center p-2 bg-gray-100 dark:bg-gray-700 rounded-t-lg">
                            <FaUniversity className="text-blue-500 mr-2" />
                            <span className="font-medium text-gray-900 dark:text-white">
                              {institution}
                            </span>
                          </div>
                          <div className="border border-t-0 border-gray-200 dark:border-gray-600 rounded-b-lg divide-y divide-gray-200 dark:divide-gray-600">
                            {studies.map((study) => (
                              <div
                                key={study.id}
                                className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center justify-between cursor-pointer"
                                onClick={() => toggleStudySelection(study.id)}
                              >
                                <div className="flex items-center">
                                  <FaGraduationCap className="text-blue-400 mr-3" />
                                  <div>
                                    <p className="font-medium text-gray-900 dark:text-white">
                                      {study.name}
                                    </p>
                                    {study.description && (
                                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                        {study.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                {selectedStudies.some((s) => s === study.id) ? (
                                  <div className="w-5 h-5 flex items-center justify-center bg-blue-500 text-white rounded">
                                    <FaCheck className="text-xs" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 border border-gray-300 dark:border-gray-500 rounded" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FaUniversity className="mx-auto text-gray-400 text-4xl mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No hay estudios disponibles
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 dark:bg-gray-700 flex justify-between">
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => setShowCreatorModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  <FaPlus className="mr-2" />
                  Crear Nuevo Estudio
                </button>
              )}

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-600 hover:bg-gray-50 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={selectedStudies.length === 0}
                  className={`inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                    selectedStudies.length === 0
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  Seleccionar ({selectedStudies.length})
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showCreatorModal && (
        <StudyModal
          isOpen={showCreatorModal}
          onClose={() => setShowCreatorModal(false)}
          onSave={(newStudy) => {
            setInstitutions((prev) => {
              const updated = { ...prev };
              if (!updated[newStudy.institution]) {
                updated[newStudy.institution] = [];
              }
              updated[newStudy.institution].push(newStudy);

              return updated;
            });

            setSelectedStudies((prev) => [...prev, newStudy]);
          }}
        />
      )}
    </>
  );
};

export default SelectStudyModal;
