import React from "react";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const { user, isAdmin } = useAuth();

  const adminContent = {
    title: `Bienvenido, ${user.email} al Dashboard de Gestión de Usuarios!`,
    description:
      "Aquí podrás administrar, editar y visualizar toda la información de los usuarios de manera rápida y eficiente.",
    features: [
      "Gestiona perfiles",
      "Asigna roles y permisos",
      "Filtra y busca usuarios en tiempo real",
      "Exporta datos con un solo clic",
    ],
    helpText:
      "¡Empieza a explorar y optimiza tu flujo de trabajo! Si necesitas ayuda, revisa nuestra",
    footerText: "¡Vamos a simplificar la administración juntos! 🚀",
  };

  const userContent = {
    title: `Hola, ${user.email} 👋`,
    description:
      "Este es tu panel personal donde puedes gestionar tu información y preferencias.",
    features: [
      "Edita tu perfil e información personal",
      "Actualiza tu contraseña",
      "Configura tus preferencias de notificaciones",
      "Visualiza tu historial de actividades",
    ],
    helpText: "¿Necesitas ayuda?",
    footerText: "Consulta nuestra guía de usuario",
  };

  const content = isAdmin ? adminContent : userContent;

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 border border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {content.title}
        </h1>

        <p className="mb-4 text-gray-700 dark:text-gray-300">
          {content.description}
        </p>

        <ul className="space-y-2 mb-6 text-gray-700 dark:text-gray-300">
          {content.features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <span className="w-2 h-2 mr-2 bg-blue-500 rounded-full"></span>
              {feature}
            </li>
          ))}
        </ul>

        {isAdmin ? (
          <p className="mb-4 text-gray-700 dark:text-gray-300">
            {content.helpText}{" "}
            <a href="#" className="text-blue-500 hover:underline">
              guía rápida
            </a>{" "}
            o contacta al equipo de soporte.
          </p>
        ) : (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg dark:bg-gray-700">
            <p className="text-gray-800 dark:text-gray-200 font-medium">
              {content.helpText}{" "}
              <a href="#" className="text-blue-500 hover:underline ml-1">
                {content.footerText}
              </a>
            </p>
          </div>
        )}

        {isAdmin && (
          <div className="mt-6 p-4 bg-blue-50 rounded-lg dark:bg-gray-700">
            <p className="text-gray-800 dark:text-gray-200 font-medium">
              {content.footerText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
