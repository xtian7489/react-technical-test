import React from "react";
import { FaEnvelope, FaUser, FaUserShield } from "react-icons/fa";

const Header = ({ user }) => {
  return (
    <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-700">
      <div className="flex items-center">
        <div className="rounded-full bg-gray-100 dark:bg-gray-900 p-4 mr-4">
          <FaUser className="text-gray-600 dark:text-gray-300 text-2xl" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-zinc-800 dark:text-white">
            {user.name}
          </h1>
          <p className="text-zinc-600 dark:text-zinc-300 flex items-center">
            <FaEnvelope className="mr-2" />
            {user.email}
          </p>
          <p className="text-zinc-600 dark:text-zinc-300 flex items-center mt-1">
            <FaUserShield className="mr-2" />
            {user.role === "admin" ? "Administrador" : "Usuario normal"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
