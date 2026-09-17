import { useState, useEffect } from "react";
import {
  HiOutlineSave as SaveIcon,
  HiOutlineCheckCircle as CheckIcon,
  HiOutlineBriefcase as BriefcaseIcon,
  HiOutlinePlus as PlusIcon,
  HiOutlinePencil as PencilIcon,
  HiOutlineTrash as TrashIcon,
  HiOutlineDownload as DownloadIcon,
  HiOutlineX as CloseIcon,
} from "react-icons/hi";

const rawApi = (import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api").trim();
const cleanApi = rawApi.replace(/\/+$/, "");
const API = cleanApi.endsWith("/api") ? cleanApi : `${cleanApi}/api`;

const initialHeaderState = {
  sectionTitle: "Resume",
  description:
    "My extensive background includes successful collaborations across various industries, addressing unique challenges and delivering designs aligned with customer needs and business goals.",
  experienceLabel: "Professional Experiences",
  downloadText: "download resume",
  downloadLink: "#download-resume",
};

const initialModalForm = {
  company: "",
  role: "",
  location: "",
  period: "",
};

export default function ResumeManager() {
  const [headerData, setHeaderData] = useState(initialHeaderState);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingHeader, setSavingHeader] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [modalFormData, setModalFormData] = useState(initialModalForm);
  const [savingItem, setSavingItem] = useState(false);

  useEffect(() => {
    fetchResumeData();
  }, []);

  const fetchResumeData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/resume`);
      const data = await res.json();
      if (res.ok && data.data) {
        if (data.data.header) setHeaderData((prev) => ({ ...prev, ...data.data.header }));
        if (data.data.experiences) setExperiences(data.data.experiences);
      }
    } catch (err) {
      console.error("Failed to fetch resume data:", err);
      setStatusMessage({ type: "error", text: "Failed to load Resume data." });
    } finally {
      setLoading(false);
    }
  };

  // Save Header Settings
  const handleSaveHeader = async (e) => {
    e.preventDefault();
    setSavingHeader(true);
    setStatusMessage({ type: "", text: "" });

    try {
      const res = await fetch(`${API}/resume/header`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(headerData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save header settings.");

      setHeaderData((prev) => ({ ...prev, ...data.data }));
      setStatusMessage({ type: "success", text: "Resume header settings saved successfully!" });
      setTimeout(() => setStatusMessage({ type: "", text: "" }), 4000);
    } catch (err) {
      console.error("Save Header Error:", err);
      setStatusMessage({ type: "error", text: err.message || "Failed to save header." });
    } finally {
      setSavingHeader(false);
    }
  };

  // Open Modal Handlers
  const handleOpenAddModal = () => {
    setEditingId(null);
    setModalFormData(initialModalForm);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (exp) => {
    setEditingId(exp._id);
    setModalFormData({
      company: exp.company || "",
      role: exp.role || "",
      location: exp.location || "",
      period: exp.period || "",
    });
    setIsModalOpen(true);
  };

  // Save Experience (Create / Edit)
  const handleSaveExperience = async (e) => {
    e.preventDefault();
    if (!modalFormData.company.trim() || !modalFormData.role.trim()) {
      alert("Company Name and Role are required.");
      return;
    }

    setSavingItem(true);
    try {
      let res, data;
      if (editingId) {
        res = await fetch(`${API}/resume/experiences/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(modalFormData),
        });
      } else {
        res = await fetch(`${API}/resume/experiences`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(modalFormData),
        });
      }

      data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save experience.");

      setIsModalOpen(false);
      fetchResumeData();
      setStatusMessage({
        type: "success",
        text: editingId
          ? "Experience updated successfully!"
          : "New experience added successfully!",
      });
      setTimeout(() => setStatusMessage({ type: "", text: "" }), 4000);
    } catch (err) {
      console.error("Save Experience Error:", err);
      alert(err.message || "Failed to save experience.");
    } finally {
      setSavingItem(false);
    }
  };

  // Delete Experience
  const handleDeleteExperience = async (id, company) => {
    if (!window.confirm(`Are you sure you want to delete experience at "${company}"?`)) return;

    try {
      const res = await fetch(`${API}/resume/experiences/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete experience.");

      setExperiences((prev) => prev.filter((exp) => exp._id !== id));
      setStatusMessage({ type: "success", text: "Experience deleted successfully!" });
      setTimeout(() => setStatusMessage({ type: "", text: "" }), 4000);
    } catch (err) {
      console.error("Delete Experience Error:", err);
      alert(err.message || "Failed to delete experience.");
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-gray-500">Loading Resume Section details...</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 font-sans text-slate-100">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#0b1326] p-6 rounded-2xl border border-slate-800 shadow-md">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-primary/20 text-primary border border-primary/30">
              <BriefcaseIcon className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Resume Section Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage section titles, background intro, and add/edit/delete work experiences dynamically.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold shadow-md shadow-primary/20 transition-all cursor-pointer"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add Experience</span>
        </button>
      </div>

      {/* Status Alert */}
      {statusMessage.text && (
        <div
          className={`p-4 rounded-xl text-sm font-medium flex items-center gap-3 ${
            statusMessage.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
              : "bg-red-500/10 text-red-400 border border-red-500/30"
          }`}
        >
          {statusMessage.type === "success" ? (
            <CheckIcon className="w-5 h-5 shrink-0 text-emerald-400" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Header Settings Form */}
      <form onSubmit={handleSaveHeader} className="bg-[#0b1326] p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white">
            Resume Section Settings
          </h2>
          <button
            type="submit"
            disabled={savingHeader}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer disabled:opacity-50 border border-slate-700"
          >
            {savingHeader ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <SaveIcon className="w-4 h-4" />
                <span>Save Header</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Section Title</label>
            <input
              type="text"
              value={headerData.sectionTitle}
              onChange={(e) => setHeaderData({ ...headerData, sectionTitle: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700/70 bg-[#121c33] text-white focus:bg-[#16233f] focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Timeline Column Label</label>
            <input
              type="text"
              value={headerData.experienceLabel}
              onChange={(e) => setHeaderData({ ...headerData, experienceLabel: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700/70 bg-[#121c33] text-white focus:bg-[#16233f] focus:border-primary focus:outline-none"
              placeholder="Professional Experiences"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1">Section Description Paragraph</label>
          <textarea
            rows={3}
            value={headerData.description}
            onChange={(e) => setHeaderData({ ...headerData, description: e.target.value })}
            className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700/70 bg-[#121c33] text-white focus:bg-[#16233f] focus:border-primary focus:outline-none leading-relaxed"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Download Resume Button Text</label>
            <input
              type="text"
              value={headerData.downloadText}
              onChange={(e) => setHeaderData({ ...headerData, downloadText: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700/70 bg-[#121c33] text-white focus:bg-[#16233f] focus:border-primary focus:outline-none"
              placeholder="download resume"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Download Resume Link / PDF URL</label>
            <div className="relative">
              <input
                type="text"
                value={headerData.downloadLink}
                onChange={(e) => setHeaderData({ ...headerData, downloadLink: e.target.value })}
                className="w-full pl-3 pr-8 py-2 text-xs rounded-xl border border-slate-700/70 bg-[#121c33] text-white focus:bg-[#16233f] focus:border-primary focus:outline-none"
                placeholder="#download-resume or https://..."
              />
              <DownloadIcon className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
            </div>
          </div>
        </div>
      </form>

      {/* Experiences List Card */}
      <div className="bg-[#0b1326] p-6 rounded-2xl border border-slate-800 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white">
              Work Experiences ({experiences.length})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Add new roles or edit timeline entries. They will render in order on the portfolio.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl cursor-pointer shadow-sm"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Experience</span>
          </button>
        </div>

        {/* Timeline List */}
        {experiences.length === 0 ? (
          <div className="p-8 text-center bg-[#121c33] rounded-2xl border border-dashed border-slate-700">
            <p className="text-sm font-semibold text-slate-300">No work experiences found</p>
            <p className="text-xs text-slate-400 mt-1">Click "Add Experience" to add your first work history entry.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {experiences.map((exp, idx) => (
              <div
                key={exp._id || idx}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-[#121c33] px-4 rounded-xl transition-colors"
              >
                <div className="space-y-0.5 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-primary/20 text-primary border border-primary/30 text-xs font-bold flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h3 className="font-bold text-sm text-white truncate">
                      {exp.company}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-300 font-medium pl-8">
                    {exp.role}
                  </p>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 pl-8 sm:pl-0">
                  <div className="text-left sm:text-right text-xs text-slate-400 space-y-0.5">
                    <p className="font-medium text-slate-200">{exp.location}</p>
                    <p className="text-slate-400">{exp.period}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(exp)}
                      className="p-1.5 rounded-lg bg-[#0b1326] border border-slate-700 text-slate-300 hover:text-primary hover:border-primary cursor-pointer transition-colors"
                      title="Edit Experience"
                    >
                      <PencilIcon className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteExperience(exp._id, exp.company)}
                      className="p-1.5 rounded-lg bg-[#0b1326] border border-slate-700 text-slate-300 hover:text-red-400 hover:border-red-500/30 cursor-pointer transition-colors"
                      title="Delete Experience"
                    >
                      <TrashIcon className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Experience Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="bg-[#0b1326] text-slate-100 w-full max-w-lg rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white">
                {editingId ? "Edit Work Experience" : "Add New Work Experience"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveExperience} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Company / Organization Name
                </label>
                <input
                  type="text"
                  required
                  value={modalFormData.company}
                  onChange={(e) => setModalFormData({ ...modalFormData, company: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700/70 bg-[#121c33] text-white focus:bg-[#16233f] focus:border-primary focus:outline-none"
                  placeholder="Designit - a Wipro Company"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Job Role / Title
                </label>
                <input
                  type="text"
                  required
                  value={modalFormData.role}
                  onChange={(e) => setModalFormData({ ...modalFormData, role: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700/70 bg-[#121c33] text-white focus:bg-[#16233f] focus:border-primary focus:outline-none"
                  placeholder="Principal Experience Designer"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={modalFormData.location}
                    onChange={(e) => setModalFormData({ ...modalFormData, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700/70 bg-[#121c33] text-white focus:bg-[#16233f] focus:border-primary focus:outline-none"
                    placeholder="Bengaluru, India"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Period / Timeframe
                  </label>
                  <input
                    type="text"
                    value={modalFormData.period}
                    onChange={(e) => setModalFormData({ ...modalFormData, period: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700/70 bg-[#121c33] text-white focus:bg-[#16233f] focus:border-primary focus:outline-none"
                    placeholder="2022 - Present"
                  />
                </div>
              </div>

              {/* Submit / Cancel Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 text-xs font-semibold text-slate-300 hover:text-white border border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingItem}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl cursor-pointer disabled:opacity-50 shadow-md shadow-primary/20"
                >
                  {savingItem ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <SaveIcon className="w-4 h-4" />
                      <span>{editingId ? "Update Entry" : "Create Entry"}</span>
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
