# React Technical Test

Este proyecto es una prueba técnica realizada con **React + Vite** que incluye funcionalidades como autenticación con roles, rutas protegidas, consumo de APIs simuladas y un diseño responsivo.

🌐 **Demo en vivo:** [https://test.cevadev.com](https://test.cevadev.com)

## Tecnologías utilizadas

- [React 19](https://react.dev/)
- [Vite](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Router DOM](https://reactrouter.com/)
- [Axios](https://axios-http.com/)
- [uuid](https://github.com/uuidjs/uuid)
- [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- [jose](https://github.com/panva/jose) (para manejo de JWT)
- [MSW](https://mswjs.io/) (Mock Service Worker)

## Instalación

```bash
# Clona el repositorio
git clone https://github.com/tu-usuario/react-technical-test.git
cd react-technical-test

# Instala las dependencias
npm install

```

## Scripts disponibles

# Iniciar el servidor de desarrollo

```bash
npm run dev
```

# Construir para producción

```bash
npm run build
```

# Servir la versión de producción

```bash
npm run preview
```

# Linting del proyecto

```bash
npm run lint
```

## Estructura del proyecto

```

├── public/               # Archivos públicos y MSW
├── src/                  # Código fuente del proyecto
│   ├── App.jsx
│   ├── main.jsx
│   ├── Layout.jsx
│   └── ...
├── dist/                 # Archivos generados en la compilación
├── package.json          # Dependencias y scripts
├── vite.config.js        # Configuración de Vite
└── eslint.config.js
```
