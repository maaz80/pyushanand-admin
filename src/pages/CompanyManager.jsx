import { useState, useEffect } from "react";
import {
  HiOutlineSave as SaveIcon,
  HiOutlineCheckCircle as CheckIcon,
  HiOutlineBriefcase as OfficeIcon,
  HiOutlinePlus as PlusIcon,
  HiOutlinePencil as PencilIcon,
  HiOutlineTrash as TrashIcon,
  HiOutlineX as CloseIcon,
  HiOutlinePhotograph as PhotoIcon,
} from "react-icons/hi";
import ImageUploader from "../components/ImageUploader";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

const initialModalForm = {
  name: "",
  image: "/images/comp2.webp",
  alt: "Client Logo",
};

export default function CompanyManager() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [modalFormData, setModalFormData] = useState(initialModalForm);
  const [modalImageFile, setModalImageFile] = useState(null);
  const [savingItem, setSavingItem] = useState(false);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/companies`);
      const data = await res.json();
      if (res.ok && Array.isArray(data.data)) {
        setCompanies(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch company logos:", err);
      setStatusMessage({ type: "error", text: "Failed to load company logos." });
    } finally {
      setLoading(false);
    }
  };

  // Open Add Modal
  const handleOpenAddModal = () => {
    setEditingId(null);
    setModalFormData(initialModalForm);
    setModalImageFile(null);
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (comp) => {
    setEditingId(comp._id);
    setModalFormData({
      name: comp.name || "",
      image: comp.image || "",
      alt: comp.alt || "Client Logo",
    });
    setModalImageFile(null);
    setIsModalOpen(true);
  };

  // Save Company Logo (Create / Edit)
  const handleSaveCompany = async (e) => {
    e.preventDefault();
    setSavingItem(true);
    setStatusMessage({ type: "", text: "" });

    try {
      let finalImageUrl = modalFormData.image;

      // Handle image upload if a file is chosen
      if (modalImageFile instanceof File) {
        const uploadData = new FormData();
        uploadData.append("image", modalImageFile);

        const uploadRes = await fetch(`${API}/upload`, {
          method: "POST",
          body: uploadData,
        });

        const uploadJson = await uploadRes.json();
        if (uploadRes.ok && uploadJson.url) {
          finalImageUrl = uploadJson.url;
        } else {
          throw new Error(uploadJson.error || "Image upload failed");
        }
      }

      const payload = {
        ...modalFormData,
        image: finalImageUrl,
        name: modalFormData.name.trim() || "Client Logo",
        alt: modalFormData.alt.trim() || "Client Logo",
      };

      let res, data;
      if (editingId) {
        res = await fetch(`${API}/companies/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API}/companies`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save company logo.");

      setIsModalOpen(false);
      fetchCompanies();
      setStatusMessage({
        type: "success",
        text: editingId
          ? "Company logo updated successfully!"
          : "New company logo added successfully!",
      });
      setTimeout(() => setStatusMessage({ type: "", text: "" }), 4000);
    } catch (err) {
      console.error("Save Company Error:", err);
      alert(err.message || "Failed to save company logo.");
    } finally {
      setSavingItem(false);
    }
  };

  // Delete Company Logo
  const handleDeleteCompany = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name || "this logo"}"?`)) return;

    try {
      const res = await fetch(`${API}/companies/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete company logo.");

      setCompanies((prev) => prev.filter((c) => c._id !== id));
      setStatusMessage({ type: "success", text: "Company logo deleted successfully!" });
      setTimeout(() => setStatusMessage({ type: "", text: "" }), 4000);
    } catch (err) {
      console.error("Delete Company Error:", err);
      alert(err.message || "Failed to delete company logo.");
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-gray-500">Loading Company Logos...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 font-sans">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-primary/10 text-primary">
              <OfficeIcon className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Company & Client Logos Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Upload, edit, or remove client/company brand logos displayed in the marquee on the website.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold shadow-md shadow-primary/20 transition-all cursor-pointer"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Company Logo</span>
        </button>
      </div>

      {/* Status Alert */}
      {statusMessage.text && (
        <div
          className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 ${
            statusMessage.type === "success"
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckIcon className="w-5 h-5 shrink-0 text-emerald-600" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Logos Grid */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              Active Client Logos ({companies.length})
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Logos will automatically animate across the client section.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary/90 text-white text-xs font-semibold rounded-xl cursor-pointer shadow-sm"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Logo</span>
          </button>
        </div>

        {companies.length === 0 ? (
          <div className="p-8 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-sm font-semibold text-gray-600">No company logos found</p>
            <p className="text-xs text-gray-400 mt-1">Click "Add Company Logo" to upload your first brand logo.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
            {companies.map((comp, idx) => (
              <div
                key={comp._id || idx}
                className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 flex flex-col items-center justify-between space-y-3 relative group shadow-md"
              >
                {/* Dark Preview Tile so white/light SVG/PNG logos are visible */}
                <div className="w-full h-24 flex items-center justify-center p-2 rounded-xl bg-zinc-950/60">
                  {comp.image ? (
                    <img
                      src={comp.image}
                      alt={comp.alt || comp.name}
                      className="max-h-16 max-w-full object-contain brightness-0 invert opacity-90 group-hover:opacity-100 transition-opacity"
                    />
                  ) : (
                    <PhotoIcon className="w-8 h-8 text-zinc-600" />
                  )}
                </div>

                <div className="w-full pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs">
                  <span className="font-medium text-zinc-300 truncate max-w-[100px]" title={comp.name}>
                    {comp.name || "Client Logo"}
                  </span>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => handleOpenEditModal(comp)}
                      className="p-1 rounded bg-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-700 cursor-pointer"
                      title="Edit Logo"
                    >
                      <PencilIcon className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDeleteCompany(comp._id, comp.name)}
                      className="p-1 rounded bg-zinc-800 text-zinc-400 hover:text-red-400 hover:bg-zinc-700 cursor-pointer"
                      title="Delete Logo"
                    >
                      <TrashIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Company Logo Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-3xl border border-gray-200 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h2 className="text-lg font-bold text-gray-900">
                {editingId ? "Edit Company Logo" : "Add New Company Logo"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 cursor-pointer"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCompany} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Company / Client Name
                </label>
                <input
                  type="text"
                  required
                  value={modalFormData.name}
                  onChange={(e) => setModalFormData({ ...modalFormData, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none"
                  placeholder="e.g. YesBank, Etisalat, OLX"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Upload Logo Image
                </label>
                <ImageUploader setImage={setModalImageFile} initialImage={modalFormData.image} />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Direct Image URL / Path
                </label>
                <input
                  type="text"
                  value={modalFormData.image}
                  onChange={(e) => setModalFormData({ ...modalFormData, image: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none"
                  placeholder="/images/comp2.webp or https://..."
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">
                  Image Alt Text
                </label>
                <input
                  type="text"
                  value={modalFormData.alt}
                  onChange={(e) => setModalFormData({ ...modalFormData, alt: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none"
                  placeholder="Client Logo 2"
                />
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-semibold text-gray-600 hover:text-gray-900 border border-gray-200 rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingItem}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white text-xs font-semibold rounded-xl cursor-pointer disabled:opacity-50 shadow-md shadow-primary/20"
                >
                  {savingItem ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving Logo...</span>
                    </>
                  ) : (
                    <>
                      <SaveIcon className="w-4 h-4" />
                      <span>{editingId ? "Update Logo" : "Create Logo"}</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
