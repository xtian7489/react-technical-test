import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  FaUser,
  FaLock,
  FaEnvelope,
  FaUserPlus,
  FaSpinner,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { FaEye } from "react-icons/fa6";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Error en el registro");
      }

      const data = await res.json();
      login(data.token, data.user);
      navigate("/");
    } catch (err) {
      setError(err.message || "Error al registrar el usuario");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-900 flex items-center px-4 py-8">
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-6">
          <img
            src="/zoco-logo.png"
            className="mx-auto h-12 w-auto dark:hidden"
            alt="Logo"
          />
          <img
            src="/zoco-logo-dark.png"
            className="mx-auto h-12 w-auto hidden dark:block"
            alt="Logo"
          />

          <h2 className="mt-3 text-xl font-bold text-zinc-900 dark:text-white">
            Crear nueva cuenta
          </h2>
          <p className="mt-1 text-xs text-zinc-600 dark:text-zinc-400">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/auth/login"
              className="font-medium text-gray-600 hover:text-gray-500 dark:text-gray-400 underline"
            >
              Inicia sesión
            </Link>
          </p>
        </div>

        <div className="bg-white dark:bg-zinc-800 rounded-lg shadow-sm p-5 border border-zinc-200 dark:border-zinc-700">
          {error && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 text-red-700 dark:text-red-300 px-3 py-2 rounded text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label htmlFor="email" className="sr-only">
                Correo electrónico
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-4 w-4 text-zinc-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 dark:bg-zinc-700 dark:text-white"
                  placeholder="usuario@ejemplo.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-4 w-4 text-zinc-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  minLength="6"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 dark:bg-zinc-700 dark:text-white"
                  placeholder="••••••••"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                  aria-label="Mostrar contraseña"
                  className="absolute inset-y-0 right-0 pr-3 z-20 flex items-center  cursor-pointer"
                >
                  <FaEye className="h-4 w-4 text-zinc-400" />
                </button>
              </div>
              <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                Mínimo 6 caracteres
              </p>
            </div>

            <div>
              <label htmlFor="confirm-password" className="sr-only">
                Confirmar contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-4 w-4 text-zinc-400" />
                </div>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-zinc-300 dark:border-zinc-600 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-500 focus:border-gray-500 dark:bg-zinc-700 dark:text-white"
                  placeholder="••••••••"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  type="button"
                  aria-label="Mostrar contraseña"
                  className="absolute inset-y-0 right-0 pr-3 z-20 flex items-center  cursor-pointer"
                >
                  <FaEye className="h-4 w-4 text-zinc-400" />
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full flex justify-center items-center py-2 px-4 rounded-md text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 ${
                isLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  Creando cuenta...
                </>
              ) : (
                <>
                  <FaUserPlus className="mr-2" />
                  Registrarse
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
