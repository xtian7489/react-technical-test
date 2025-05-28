import React from "react";
import {
  FaCalendarAlt,
  FaEnvelope,
  FaPhone,
  FaUserShield,
} from "react-icons/fa";

const Profile = ({ user }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-4">
          Datos personales
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Nombre completo
            </label>
            <p className="mt-1 text-sm text-zinc-900 dark:text-white break-words">
              {user.name}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Correo electrónico
            </label>
            <p className="mt-1 text-sm text-zinc-900 dark:text-white flex items-center break-all">
              <FaEnvelope className="flex-shrink-0 mr-2" />
              {user.email}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Teléfono
            </label>
            <p className="mt-1 text-sm text-zinc-900 dark:text-white flex items-center">
              <FaPhone className="flex-shrink-0 mr-2" />
              {user.phone || "No especificado"}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 md:mt-0">
        <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-4">
          Información adicional
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Rol
            </label>
            <p className="mt-1 text-sm text-zinc-900 dark:text-white flex items-center">
              <FaUserShield className="flex-shrink-0 mr-2" />
              {user.role === "admin" ? "Administrador" : "Usuario normal"}
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium text-zinc-500 dark:text-zinc-400">
              Fecha de registro
            </label>
            <p className="mt-1 text-sm text-zinc-900 dark:text-white flex items-center">
              <FaCalendarAlt className="flex-shrink-0 mr-2" />
              {new Date(user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
