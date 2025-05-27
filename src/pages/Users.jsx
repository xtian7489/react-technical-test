import React, { useContext, useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import UserEditModal from "../components/users/UserModal";
import { FaP, FaPen } from "react-icons/fa6";
import Loading from "../components/global/Loading";
import UserModal from "../components/users/UserModal";
import { Link } from "react-router-dom";
import apiClient from "../utils/axios";
import { FaTrash } from "react-icons/fa";
import DeleteUserModal from "../components/users/DeleteUserModal";
import { useAlert } from "../context/AlertContext";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState({
    open: false,
    mode: "add",
    user: null,
  });
  const [deleteModalState, setDeleteModalState] = useState({
    open: false,
    user: null,
  });
  const { user: currentUser } = useAuth();
  const { showAlert } = useAlert();
  const fetchUsers = async () => {
    setUsers([]);
    try {
      const res = await apiClient.get("/api/users");
      const { data } = res;
      setUsers(data);
      setIsLoading(false);
    } catch (error) {
      showAlert(`Error obteniendo usuario`, "error");
    }
  };

  const handleUpdateUser = async (userData) => {
    try {
      if (modalState.mode === "add") {
        const res = await apiClient.post("/api/users", userData);

        if (res.status !== 200) {
          const errorData = res.data;
          throw new Error(errorData.message || "Error en el registro");
        }
        fetchUsers();
      } else {
        const res = await apiClient.put(
          `/api/users/${modalState.user.id}`,
          userData
        );

        if (res.status !== 200) {
          const errorData = res.data;
          throw new Error(errorData.message || "Error en el registro");
        }

        const { user } = res.data;
        setUsers((prevUsers) =>
          prevUsers.map((u) => (u.id === user.id ? user : u))
        );
      }
    } catch (err) {
      showAlert(
        err.response.data.message ||
          `Error al  ${
            modalState.mode === "add" ? "crear" : "actualizar"
          } el usuario`,
        "error"
      );
    } finally {
      showAlert(
        `Usuario ${
          modalState.mode === "add" ? "creado" : "actualizado"
        } correctamente`,
        "success"
      );
    }
  };

  const handleDeleteUser = async () => {
    if (!deleteModalState.user) return;

    try {
      await apiClient.delete(`/api/users/${deleteModalState.user.id}`);
      fetchUsers();
    } catch (error) {
      showAlert(`Error eliminando usuario`, "error");
    }
  };

  const openDeleteModal = (user) => {
    setDeleteModalState({
      open: true,
      user,
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  if (isLoading) return <Loading type="list" />;

  return (
    <div className="p-6  dark:bg-gray-900 min-h-screen">
      <div className="bg-white rounded-lg shadow-md dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Lista de Usuarios
          </h3>
          <div className="text-right mb-4">
            <button
              onClick={() =>
                setModalState({ open: true, mode: "add", user: null })
              }
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Agregar Usuario
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Email
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Rol
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {users.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      <Link
                        to={`/users/${user.id}`}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                      >
                        {user.email}
                      </Link>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200"
                          : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                      }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() =>
                          setModalState({ open: true, mode: "edit", user })
                        }
                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 cursor-pointer"
                      >
                        <FaPen className="inline mr-1" /> Editar
                      </button>
                      <button
                        onClick={() => openDeleteModal(user)}
                        disabled={user.id === currentUser?.id}
                        className={`text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 cursor-pointer ${
                          user.id === currentUser?.id
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                        title={
                          user.id === currentUser?.id
                            ? "No puedes eliminarte a ti mismo"
                            : "Eliminar usuario"
                        }
                      >
                        <FaTrash className="inline mr-1" /> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-600"></div>
      </div>
      {modalState.open && (
        <UserModal
          mode={modalState.mode}
          user={modalState.user}
          onClose={() => setModalState({ ...modalState, open: false })}
          onSave={handleUpdateUser}
        />
      )}
      {deleteModalState.open && (
        <DeleteUserModal
          isOpen={deleteModalState.open}
          onClose={() =>
            setDeleteModalState({ ...deleteModalState, open: false })
          }
          onConfirm={handleDeleteUser}
          user={deleteModalState.user}
        />
      )}
    </div>
  );
};

export default Users;
