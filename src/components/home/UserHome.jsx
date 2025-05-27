import React from 'react'

const UserHome = ({user}) => {
  return (
    <div className="p-6  dark:bg-gray-900 min-h-screen">
  <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 border border-gray-200">
    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
      Hola, <span className="text-blue-500">{user.email}</span> 👋
    </h1>
    
    <p className="mb-4 text-gray-700 dark:text-gray-300">
      Este es tu panel personal donde puedes gestionar tu información y preferencias.
    </p>

    <ul className="space-y-2 mb-6 text-gray-700 dark:text-gray-300">
      <li className="flex items-center">
        <span className="w-2 h-2 mr-2 bg-blue-500 rounded-full"></span>
        Edita tu perfil e información personal
      </li>
      <li className="flex items-center">
        <span className="w-2 h-2 mr-2 bg-blue-500 rounded-full"></span>
        Actualiza tu contraseña
      </li>
      <li className="flex items-center">
        <span className="w-2 h-2 mr-2 bg-blue-500 rounded-full"></span>
        Configura tus preferencias de notificaciones
      </li>
      <li className="flex items-center">
        <span className="w-2 h-2 mr-2 bg-blue-500 rounded-full"></span>
        Visualiza tu historial de actividades
      </li>
    </ul>

    <div className="mt-6 p-4 bg-blue-50 rounded-lg dark:bg-gray-700">
      <p className="text-gray-800 dark:text-gray-200 font-medium">
        ¿Necesitas ayuda? <a href="#" className="text-blue-500 hover:underline ml-1">Consulta nuestra guía de usuario</a>
      </p>
    </div>
  </div>
</div>
  )
}

export default UserHome