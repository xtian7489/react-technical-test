# 🛡️ React Technical Test

Este proyecto es una prueba técnica construida con **React**, que incluye autenticación, control de roles (admin/usuario), rutas protegidas, contexto global, mocks con `msw` y diseño responsivo.

## 🚀 Demo en producción

👉 [https://test.cevadev.com](https://test.cevadev.com)

---

## 🧹 Funcionalidades

- Login / Registro con control de sesión
- Acceso protegido a rutas por rol (`admin` o `usuario`)
- Vistas condicionales para usuarios y administradores
- Simulación de API con **MSW (Mock Service Worker)**
- Diseño adaptable a dispositivos móviles
- Composición con Context API para autenticación y alertas

---

## 📦 Tecnologías

- [React](https://reactjs.org/)
- [React Router DOM](https://reactrouter.com/)
- [MSW (Mock Service Worker)](https://mswjs.io/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Vite](https://vitejs.dev/)
- [Context API](https://reactjs.org/docs/context.html)

---

## 🛠️ Instalación

```bash
# Clona el repositorio
git clone https://github.com/xtian7489/react-technical-test
cd react-technical-test

# Instala las dependencias
npm install

# Inicia el proyecto en modo desarrollo
npm run dev
```

---

## ⚙️ Variables de entorno

Crea un archivo `.env` en la raíz del proyecto y copia las siguientes variables:

```env
VITE_JWT_SECRET=my_secret_key
VITE_USE_AUTH=true
VITE_DB_KEY=test_api
VITE_USE_MOCKS=true
```

> Puedes definirlas también en `.env.production` para el entorno de producción.

**Nota:** Los datos de la aplicación se almacenan en el navegador utilizando `localStorage` bajo el nombre especificado en la variable `VITE_DB_KEY`.

---

## 🥪 Modo producción (mock incluido)

```bash
npm run build
npm run preview
```

Esto compila el proyecto y lo sirve en modo producción. Si `VITE_USE_MOCKS=true`, entonces **MSW interceptará las peticiones** y usará los handlers definidos en `src/mocks`.

---

## 🔐 Roles disponibles

Los roles están simulados en el backend falso. Puedes ingresar con estos datos para probar la app:

### Usuario administrador

```bash
Email: admin@test.com
Contraseña: 123456
```

### Usuario regular

```bash
Email: user@test.com
Contraseña: 123456
```

---

## 📂 Estructura relevante

```bash
src/
├— context/         # Contextos de autenticación y alertas
├— mocks/           # MSW handlers para mocking de APIs
├— pages/
├— components/      # Componentes reutilizables
└— App.jsx          # Definición de rutas
```

---

## 🧑‍💻 Autor

**Cristian Valdez**
Desarrollador Full Stack & Dramaturgo

---

## 🪄 Licencia

Este proyecto está disponible bajo la licencia MIT.
