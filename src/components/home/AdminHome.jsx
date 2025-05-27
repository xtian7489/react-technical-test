import React from "react";

const AdminHome = ({ user }) => {
  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Bienvenido, <span className="text-blue-500">{user.email}</span> al
          Dashboard de Gestión de Usuarios!
        </h1>

        <p className="mb-4 text-gray-700 dark:text-gray-300">
          Aquí podrás administrar, editar y visualizar toda la información de
          los usuarios de manera rápida y eficiente.
        </p>

        <ul className="space-y-2 mb-6 text-gray-700 dark:text-gray-300">
          <li className="flex items-center">
            <span className="w-2 h-2 mr-2 bg-blue-500 rounded-full"></span>
            Gestiona perfiles
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 mr-2 bg-blue-500 rounded-full"></span>
            Asigna roles y permisos
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 mr-2 bg-blue-500 rounded-full"></span>
            Filtra y busca usuarios en tiempo real
          </li>
          <li className="flex items-center">
            <span className="w-2 h-2 mr-2 bg-blue-500 rounded-full"></span>
            Exporta datos con un solo clic
          </li>
        </ul>

        <p className="mb-4 text-gray-700 dark:text-gray-300">
          ¡Empieza a explorar y optimiza tu flujo de trabajo! Si necesitas
          ayuda, revisa nuestra
          <a href="#" className="text-blue-500 hover:underline ml-1">
            guía rápida
          </a>{" "}
          o contacta al equipo de soporte.
        </p>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg dark:bg-gray-700">
          <p className="text-gray-800 dark:text-gray-200 font-medium">
            ¡Vamos a simplificar la administración juntos!{" "}
            <span className="ml-2">🚀</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
