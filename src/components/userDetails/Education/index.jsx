import React, { useState } from "react";
import {
  FaEdit,
  FaGraduationCap,
  FaPlus,
  FaTrash,
  FaUniversity,
} from "react-icons/fa";
import SelectStudyModal from "./SelectStudyModal";

const Education = ({ user, fetchUser }) => {
  const [showStudyModal, setShowStudyModal] = useState(false);
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-zinc-900 dark:text-white">
          Formación académica
        </h3>
        <button
          onClick={() => setShowStudyModal(true)}
          className="flex items-center px-3 py-1 bg-gray-600 text-white rounded-md text-sm hover:bg-gray-700"
        >
          Editar
        </button>
      </div>

      {user.studies.length > 0 ? (
        <div className="space-y-4">
          {user.studies.map((study) => (
            <div
              key={study.id}
              className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg"
            >
              <div className="flex items-start">
                <div className="bg-gray-100 dark:bg-gray-900 p-2 rounded-full mr-3">
                  <FaGraduationCap className="text-gray-600 dark:text-gray-300" />
                </div>
                <div className="flex-1">
                  <h4 className="font-medium text-zinc-900 dark:text-white">
                    {study.degree} - {study.institution}
                  </h4>
                  <p className="text-sm text-zinc-600 dark:text-zinc-300">
                    {study.fieldOfStudy} ({study.startYear} -{" "}
                    {study.endYear || "Presente"})
                  </p>
                  {study.description && (
                    <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                      {study.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <FaUniversity className="mx-auto text-zinc-400 text-4xl mb-3" />
          <p className="text-zinc-500 dark:text-zinc-400">
            No se han registrado estudios académicos
          </p>
        </div>
      )}
      {showStudyModal && (
        <SelectStudyModal
          isOpen={showStudyModal}
          user={user}
          prevUserStudies={user.studies.map((study) => study.id)}
          onClose={() => setShowStudyModal(false)}
          fetchUser={fetchUser}
        />
      )}
    </div>
  );
};

export default Education;
