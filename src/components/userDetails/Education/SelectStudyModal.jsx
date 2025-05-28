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
    onClose();
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
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 transition-opacity" aria-hidden="true">
            <div
              className="absolute inset-0 bg-zinc-500 opacity-75 dark:bg-zinc-900 dark:opacity-80"
              onClick={onClose}
            ></div>
          </div>

          <div className="inline-block relative z-50 align-bottom rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl w-full">
            <div className="bg-white dark:bg-zinc-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4 max-h-[80vh] overflow-y-auto">
              <div className="flex justify-between items-start sticky top-0 bg-white dark:bg-zinc-800 pb-4 z-10">
                <h3 className="text-lg leading-6 font-medium text-zinc-900 dark:text-white">
                  Seleccionar Estudios
                </h3>
                <button
                  onClick={onClose}
                  className="text-zinc-400 hover:text-zinc-500 dark:hover:text-zinc-300"
                  aria-label="Cerrar modal"
                >
                  <FaTimes className="h-5 w-5" />
                </button>
              </div>

              <div className="mt-4">
                {isFetching ? (
                  <div className="text-center py-8">
                    <FaSpinner className="animate-spin mx-auto text-zinc-400 text-2xl mb-3" />
                    <p className="text-zinc-500 dark:text-zinc-400">
                      Cargando estudios...
                    </p>
                  </div>
                ) : Object.keys(institutions).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(institutions).map(
                      ([institution, studies]) => (
                        <div key={institution} className="mb-4">
                          <div className="flex items-center p-2 bg-zinc-100 dark:bg-zinc-700 rounded-t-lg">
                            <FaUniversity className="text-gray-500 mr-2 min-w-[16px]" />
                            <span className="font-medium text-zinc-900 dark:text-white truncate">
                              {institution}
                            </span>
                          </div>
                          <div className="border border-t-0 border-zinc-200 dark:border-zinc-600 rounded-b-lg divide-y divide-zinc-200 dark:divide-zinc-600">
                            {studies.map((study) => (
                              <div
                                key={study.id}
                                className="p-3 hover:bg-zinc-50 dark:hover:bg-zinc-700 flex items-center justify-between cursor-pointer"
                                onClick={() => toggleStudySelection(study.id)}
                              >
                                <div className="flex items-center min-w-0">
                                  <FaGraduationCap className="text-gray-400 mr-3 min-w-[16px]" />
                                  <div className="min-w-0">
                                    <p className="font-medium text-zinc-900 dark:text-white truncate">
                                      {study.name}
                                    </p>
                                    {study.description && (
                                      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                                        {study.description}
                                      </p>
                                    )}
                                  </div>
                                </div>
                                {selectedStudies.some((s) => s === study.id) ? (
                                  <div className="w-5 h-5 flex items-center justify-center bg-gray-500 text-white rounded ml-2 flex-shrink-0">
                                    <FaCheck className="text-xs" />
                                  </div>
                                ) : (
                                  <div className="w-5 h-5 border border-zinc-300 dark:border-zinc-500 rounded ml-2 flex-shrink-0" />
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
                    <FaUniversity className="mx-auto text-zinc-400 text-4xl mb-3" />
                    <p className="text-zinc-500 dark:text-zinc-400">
                      No hay estudios disponibles
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-700 px-4 py-3 flex flex-col-reverse sm:flex-row sm:justify-between gap-3 sticky bottom-0">
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                {isAdmin && (
                  <button
                    type="button"
                    onClick={() => setShowCreatorModal(true)}
                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 w-full sm:w-auto"
                  >
                    <FaPlus className="mr-2" />
                    Crear Nuevo Estudio
                  </button>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md shadow-sm text-sm font-medium text-zinc-700 dark:text-zinc-300 bg-white dark:bg-zinc-600 hover:bg-zinc-50 dark:hover:bg-zinc-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 w-full sm:w-auto"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={selectedStudies.length === 0}
                  className={`inline-flex justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 w-full sm:w-auto ${
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
            setSelectedStudies((prev) => [...prev, newStudy.id]);
          }}
        />
      )}
    </>
  );
};

export default SelectStudyModal;
