import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaBook, FaUniversity } from "react-icons/fa";
import apiClient from "../utils/axios";
import DataCard from "../components/global/DataCard";
import DataTable from "../components/global/DataTable";
import Pagination from "../components/global/Pagination";
import SearchBox from "../components/global/SearchBox";
import Loading from "../components/global/Loading";
import UnAuthorized from "../components/global/UnAuthorized";
import ConfirmationModal from "../components/global/ConfirmationModal";
import AddressModal from "../components/userDetails/Address/AddressModal";
import StudyModal from "../components/userDetails/Education/StudyModal";
import { useAlert } from "../context/AlertContext";
import { useAuth } from "../context/AuthContext";

const RelatedData = () => {
  const { showAlert } = useAlert();
  const { isAdmin } = useAuth();
  const [addresses, setAddresses] = useState([]);
  const [studies, setStudies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addressSearchTerm, setAddressSearchTerm] = useState("");
  const [studySearchTerm, setStudySearchTerm] = useState("");
  const [currentAddressPage, setCurrentAddressPage] = useState(1);
  const [currentStudyPage, setCurrentStudyPage] = useState(1);
  const [mobileView, setMobileView] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [isStudyModalOpen, setIsStudyModalOpen] = useState(false);
  const [EditedItem, setEditedItem] = useState(null);

  const itemsPerPage = 8;

  useEffect(() => {
    const handleResize = () => {
      setMobileView(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const addressesRes = await apiClient.get("/api/address");
      const studiesRes = await apiClient.get("/api/studies");

      if (addressesRes.status !== 200)
        throw new Error("direcciones no encontradas");
      if (studiesRes.status !== 200)
        throw new Error("direcciones no encontradas");

      if (
        typeof addressesRes.data !== "object" ||
        typeof studiesRes.data !== "object"
      ) {
        fetchData();
        return;
      }

      setAddresses(addressesRes.data.addresses);
      setStudies(studiesRes.data);
      setLoading(false);
    } catch (err) {
      showAlert(
        `Error obteniendo datos: ${err.response?.data?.message || err.message}`,
        "error"
      );
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredAddresses = addresses.filter(
    (address) =>
      address.street.toLowerCase().includes(addressSearchTerm.toLowerCase()) ||
      address.city.toLowerCase().includes(addressSearchTerm.toLowerCase()) ||
      address.province.toLowerCase().includes(addressSearchTerm.toLowerCase())
  );

  const addressIndexOfLastItem = currentAddressPage * itemsPerPage;
  const addressIndexOfFirstItem = addressIndexOfLastItem - itemsPerPage;
  const currentAddresses = filteredAddresses.slice(
    addressIndexOfFirstItem,
    addressIndexOfLastItem
  );
  const totalAddressPages = Math.ceil(filteredAddresses.length / itemsPerPage);

  const filteredStudies = studies.filter(
    (study) =>
      study.name.toLowerCase().includes(studySearchTerm.toLowerCase()) ||
      study.institution.toLowerCase().includes(studySearchTerm.toLowerCase()) ||
      study.description?.toLowerCase().includes(studySearchTerm.toLowerCase())
  );

  const studyIndexOfLastItem = currentStudyPage * itemsPerPage;
  const studyIndexOfFirstItem = studyIndexOfLastItem - itemsPerPage;
  const currentStudies = filteredStudies.slice(
    studyIndexOfFirstItem,
    studyIndexOfLastItem
  );
  const totalStudyPages = Math.ceil(filteredStudies.length / itemsPerPage);

  const openDeleteModal = (item, itemType) => {
    setItemToDelete({ ...item, type: itemType });
    setConfirmModalOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!itemToDelete) return;

    setLoadingDelete(true);
    try {
      let endpoint;
      switch (itemToDelete.type) {
        case "address":
          endpoint = `/api/address/${itemToDelete.id}`;
          break;
        case "study":
          endpoint = `/api/studies/${itemToDelete.id}`;
          break;
        default:
          throw new Error("Tipo de elemento no soportado");
      }

      await apiClient.delete(endpoint);
      fetchData();
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

  const handleEditAddress = (address) => {
    setEditedItem(address);
    setIsAddressModalOpen(true);
  };

  const handleDeleteAddress = (id) => {
    const address = addresses.find((a) => a.id === id);
    openDeleteModal(address, "address");
  };

  const handleDeleteStudy = (id) => {
    const study = studies.find((s) => s.id === id);
    openDeleteModal(study, "study");
  };

  const handleEditStudy = (study) => {
    setEditedItem(study);
    setIsStudyModalOpen(true);
  };

  if (loading) return <Loading type="table" message="Cargando datos..." />;
  if (!isAdmin) return <UnAuthorized />;

  return (
    <>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-md dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          <div className="p-4 md:px-6 md:py-4 border-b border-zinc-200 dark:border-zinc-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-lg font-medium text-zinc-900 dark:text-white">
              Lista de Direcciones
            </h2>
            <SearchBox
              searchTerm={addressSearchTerm}
              onSearchChange={(e) => setAddressSearchTerm(e.target.value)}
              actionButtonText="Nueva Dirección"
              actionButton={() => setIsAddressModalOpen(true)}
              placeholder="Buscar direcciones..."
              focusRingColor="blue"
            />
          </div>

          {mobileView ? (
            <DataCard
              data={currentAddresses}
              titleKey="street"
              subtitleKeys={["city", "province", "postalCode"]}
              onEdit={handleEditAddress}
              onDelete={handleDeleteAddress}
              emptyMessage="No se encontraron direcciones"
              icon={FaMapMarkerAlt}
              badgeKey="country"
              badgeColor="green"
            />
          ) : (
            <DataTable
              columns={[
                {
                  key: "street",
                  title: "Calle",
                  render: (item) => (
                    <>
                      <div className="flex items-center">
                        <FaMapMarkerAlt
                          size={15}
                          className="text-red-500 mr-2"
                        />
                        <span className="flex-1">{item.street}</span>
                      </div>
                      <div className="text-xs md:text-sm text-zinc-500 dark:text-zinc-400 mt-1">
                        CP: {item.postalCode}
                      </div>
                    </>
                  ),
                },
                { key: "city", title: "Ciudad" },
                { key: "province", title: "Provincia" },
                {
                  key: "country",
                  title: "País",
                  render: (item) => (
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {item.country}
                    </span>
                  ),
                },
              ]}
              data={currentAddresses}
              onEdit={handleEditAddress}
              onDelete={handleDeleteAddress}
              emptyMessage="No se encontraron direcciones"
            />
          )}

          <Pagination
            currentPage={currentAddressPage}
            totalPages={totalAddressPages}
            onPageChange={setCurrentAddressPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredAddresses.length}
            currentItemsCount={currentAddresses.length}
          />
        </div>

        <div className="bg-white rounded-lg shadow-md dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 overflow-hidden">
          <div className="p-4 md:px-6 md:py-4 border-b border-zinc-200 dark:border-zinc-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-lg font-medium text-zinc-900 dark:text-white">
              Lista de Estudios
            </h2>
            <SearchBox
              searchTerm={studySearchTerm}
              onSearchChange={(e) => setStudySearchTerm(e.target.value)}
              actionButtonText="Nuevo Estudio"
              actionButton={() => setIsStudyModalOpen(true)}
              placeholder="Buscar estudios..."
              focusRingColor="green"
            />
          </div>

          {mobileView ? (
            <DataCard
              data={currentStudies}
              titleKey="name"
              subtitleKeys={["institution", "description"]}
              onEdit={handleEditStudy}
              onDelete={handleDeleteStudy}
              emptyMessage="No se encontraron estudios"
              icon={FaBook}
            />
          ) : (
            <DataTable
              columns={[
                {
                  key: "name",
                  title: "Nombre",
                  render: (item) => (
                    <div className="flex items-center">
                      <FaBook size={15} className="text-purple-500 mr-2" />
                      <span className="flex-1">{item.name}</span>
                    </div>
                  ),
                },
                {
                  key: "institution",
                  title: "Institución",
                  render: (item) => (
                    <div className="flex items-center ">
                      <FaUniversity size={15} className="text-gray-500 mr-2 " />
                      <span className="flex-1">{item.institution}</span>
                    </div>
                  ),
                },
                {
                  key: "description",
                  title: "Descripción",
                  render: (item) => item.description || "Sin descripción",
                },
              ]}
              data={currentStudies}
              onEdit={handleEditStudy}
              onDelete={handleDeleteStudy}
              emptyMessage="No se encontraron estudios"
            />
          )}

          <Pagination
            currentPage={currentStudyPage}
            totalPages={totalStudyPages}
            onPageChange={setCurrentStudyPage}
            itemsPerPage={itemsPerPage}
            totalItems={filteredStudies.length}
            currentItemsCount={currentStudies.length}
            className="bg-green-50 dark:bg-green-900"
          />
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

      <AddressModal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          setEditedItem(null);
        }}
        initialAddress={EditedItem}
        refreshData={fetchData}
      />
      <StudyModal
        isOpen={isStudyModalOpen}
        onClose={() => {
          setIsStudyModalOpen(false);
          setEditedItem(null);
        }}
        onSave={fetchData}
        initialStudy={EditedItem}
      />
    </>
  );
};

export default RelatedData;
