import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { FaPen } from "react-icons/fa6";
import Loading from "../components/global/Loading";
import UserModal from "../components/users/UserModal";
import { Link } from "react-router-dom";
import apiClient from "../utils/axios";
import { FaTrash, FaUser } from "react-icons/fa";
import DeleteUserModal from "../components/users/DeleteUserModal";
import { useAlert } from "../context/AlertContext";
import DataCard from "../components/RelatedData/DataCard";
import DataTable from "../components/RelatedData/DataTable";
import Pagination from "../components/RelatedData/Pagination";
import SearchBox from "../components/RelatedData/SearchBox";
import ConfirmationModal from "../components/global/ConfirmationModal";

const Users = () => {
  const { user: currentUser } = useAuth();
  const { showAlert } = useAlert();
  const [userSearchTerm, setUserSearchTerm] = useState("");
  const [mobileView, setMobileView] = useState(false);

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalState, setModalState] = useState({
    open: false,
    mode: "add",
    user: null,
  });

  const [currentUserPage, setCurrentUserPage] = useState(1);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const itemsPerPage = 8;

  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchUsers = async () => {
    setUsers([]);
    try {
      const res = await apiClient.get("/api/users");
      const { data } = res;
      setUsers(data);
      setIsLoading(false);
    } catch (error) {
      showAlert(
        error.response?.data?.message || `Error obteniendo usuario`,
        "error"
      );
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

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteConfirmed = async () => {
    if (!itemToDelete) return;

    setLoadingDelete(true);
    try {
      let endpoint = `/api/users/${itemToDelete.id}`;

      await apiClient.delete(endpoint);
      fetchUsers();
      setConfirmModalOpen(false);
    } catch (error) {
      showAlert(
        `Error eliminando ${itemToDelete.type}: ${
          error.response?.data?.message || error.message
        }`,
        "error"
      );
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleEditUser = (user) => {
    setModalState({ open: true, mode: "edit", user });
  };

  const handleDeleteUser = (id) => {
    const user = users.find((a) => a.id === id);
    openDeleteModal(user, "user");
  };

  const openDeleteModal = (item, itemType) => {
    setItemToDelete({ ...item, type: itemType });
    setConfirmModalOpen(true);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name?.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase())
  );

  const userIndexOfLastItem = currentUserPage * itemsPerPage;
  const userIndexOfFirstItem = userIndexOfLastItem - itemsPerPage;

  const currentUsers = filteredUsers.slice(
    userIndexOfFirstItem,
    userIndexOfLastItem
  );
  const totalUserPages = Math.ceil(filteredUsers.length / itemsPerPage);

  if (isLoading) return <Loading type="list" />;

  return (
    <div className="p-4 md:p-6 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-md dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="bg-white rounded-lg shadow-md dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="p-4 md:px-6 md:py-4 border-b border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
              <h2 className="text-lg font-medium text-gray-900 dark:text-white">
                Lista de usuarios
              </h2>
              <SearchBox
                searchTerm={userSearchTerm}
                onSearchChange={(e) => setUserSearchTerm(e.target.value)}
                actionButtonText="Nueva Usuario"
                actionButton={() =>
                  setModalState({ open: true, mode: "add", user: null })
                }
                placeholder="Buscar usuarios..."
                focusRingColor="blue"
              />
            </div>

            {mobileView ? (
              <DataCard
                data={currentUsers}
                titleKey="name"
                subtitleKeys={["email"]}
                onEdit={handleEditUser}
                onDelete={(user) => {
                  if (user !== currentUser?.id) {
                    handleDeleteUser(user);
                  } else {
                    showAlert("No puedes eliminar tu propio usuario", "error");
                  }
                }}
                emptyMessage="No se encontraron usuarios"
                icon={FaUser}
                badgeColor="green"
              />
            ) : (
              <DataTable
                columns={[
                  {
                    key: "name",
                    title: "Nombre",
                    render: (item) => (
                      <>
                        <div className="">
                          <Link
                            to={`/users/${item.id}`}
                            className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 flex items-center"
                          >
                            <FaUser size={15} className="text-red-500 mr-2" />
                            <span className="flex-1">{item.name}</span>
                          </Link>
                        </div>
                      </>
                    ),
                  },
                  { key: "email", title: "Email" },
                ]}
                data={currentUsers}
                onEdit={handleEditUser}
                onDelete={(user) => {
                  if (user !== currentUser?.id) {
                    handleDeleteUser(user);
                  } else {
                    showAlert("No puedes eliminar tu propio usuario", "error");
                  }
                }}
                emptyMessage="No se encontraron usuarios"
              />
            )}

            <Pagination
              currentPage={currentUserPage}
              totalPages={totalUserPages}
              onPageChange={setCurrentUserPage}
              itemsPerPage={itemsPerPage}
              totalItems={filteredUsers.length}
              currentItemsCount={currentUsers.length}
            />
          </div>
        </div>
      </div>
      <ConfirmationModal
        isOpen={confirmModalOpen}
        onClose={() => !loadingDelete && setConfirmModalOpen(false)}
        onConfirm={handleDeleteConfirmed}
        loading={loadingDelete}
        itemName={
          itemToDelete?.name || itemToDelete?.street || itemToDelete?.email
        }
        itemType={
          itemToDelete?.type === "address"
            ? "Dirección"
            : itemToDelete?.type === "study"
            ? "Estudio"
            : itemToDelete?.type === "user"
            ? "Usuario"
            : "Elemento"
        }
      />
      {modalState.open && (
        <UserModal
          mode={modalState.mode}
          user={modalState.user}
          onClose={() => setModalState({ ...modalState, open: false })}
          onSave={handleUpdateUser}
        />
      )}
    </div>
  );
};

export default Users;
