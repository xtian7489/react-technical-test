import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import Loading from "../components/global/Loading";
import UserModal from "../components/users/UserModal";
import Profile from "../components/userDetails/Profile";
import Education from "../components/userDetails/Education";
import Header from "../components/userDetails/Header";
import Tabs from "../components/userDetails/Tabs";
import UnAuthorized from "../components/global/UnAuthorized";
import apiClient from "../utils/axios";
import Address from "../components/userDetails/Address";
import { useAlert } from "../context/AlertContext";

const UserProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, isAdmin, token } = useAuth();
  const { showAlert } = useAlert();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const fetchUser = async () => {
    try {
      setLoading(true);

      const res = await apiClient.get(
        `/api/users/${id}?include=studies,address`
      );
      if (res.status !== 200) throw new Error("Usuario no encontrado");
      const { data } = res;

      setUser({
        ...data,
        studies: data.studies || [],
        address: data.address || {},
      });
    } catch (err) {
      showAlert(
        err.response.data.message || "Error al obtener el usuario",
        "error"
      );
      navigate("/users", { replace: true });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id, navigate]);

  const handleDeleteUser = async () => {
    if (!window.confirm(`¿Estás seguro de eliminar a ${user.name}?`)) return;

    try {
      const res = await apiClient.delete(`/api/users/${id}`);
      if (res.status !== 200) throw new Error("Error al eliminar el usuario");

      navigate("/users");
    } catch (err) {
      showAlert(
        err.response.data.message || "Error al eliminar el usuario",
        "error"
      );
    }
  };

  const handleUpdateUser = async (updatedData) => {
    try {
      const response = await fetch(`/api/users/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) throw new Error("Error al actualizar");

      const { user } = await response.json();

      setUser(user);
      setModalOpen(false);
    } catch (err) {
      showAlert(
        err.response.data.message || "Error al actualizar el usuario",
        "error"
      );
    }
  };

  if (loading) return <Loading type="user" message="Cargando usuario..." />;
  if (!user) return <div className="p-6">Usuario no encontrado</div>;
  const isCurrentUserProfile = currentUser?.id === user.id;
  if (!isAdmin && !isCurrentUserProfile) return <UnAuthorized />;

  return (
    <div className="p-6 dark:bg-gray-900 min-h-screen">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <FaArrowLeft className="mr-2" />
            Volver
          </button>

          {(isAdmin || isCurrentUserProfile) && (
            <div className="flex space-x-3">
              <button
                onClick={() => setModalOpen(true)}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                <FaEdit className="mr-2" />
                Editar
              </button>

              {isAdmin && !isCurrentUserProfile && (
                <button
                  onClick={handleDeleteUser}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  <FaTrash className="mr-2" />
                  Eliminar
                </button>
              )}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 border border-gray-200 overflow-hidden">
          <Header user={user} />

          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="p-6">
            {activeTab === "profile" && <Profile user={user} />}

            {activeTab === "education" && (
              <Education user={user} fetchUser={fetchUser} />
            )}

            {activeTab === "address" && (
              <Address user={user} fetchUser={fetchUser} />
            )}
          </div>
        </div>
      </div>

      {modalOpen && (
        <UserModal
          mode="edit"
          user={user}
          onClose={() => setModalOpen(false)}
          onSave={handleUpdateUser}
        />
      )}
    </div>
  );
};

export default UserProfilePage;
