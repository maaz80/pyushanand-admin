import { useState, useEffect } from "react";
import ImageUploader from "../components/ImageUploader";

import {
  HiOutlineSave as SaveIcon,
  HiOutlineCheckCircle as CheckIcon,
  HiOutlineFolder as FolderIcon,
  HiOutlinePlus as PlusIcon,
  HiOutlinePencil as PencilIcon,
  HiOutlineTrash as TrashIcon,
  HiOutlineHeart as HeartIcon,
  HiOutlineTag as TagIcon,
  HiOutlineX as CloseIcon,
  HiOutlinePhotograph as PhotoIcon,
} from "react-icons/hi";



const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

const initialHeaderState = {
  sectionTitle: "Portfolio",
  watermarkText: "Portfolio",
  description:
    "I closely collaborate with stakeholders and interact with users to deliver tailored solutions addressing specific pain points. My focus revolves around the essentials of UI/UX design: instincts, innovation, and intuitive interfaces—the bear necessities for exceptional user experiences.",
  viewAllButtonText: "View all projects",
  viewAllButtonLink: "#",
};

const initialModalForm = {
  category: "UI/UX Case Study",
  title: "",
  image: "/images/bank-image.webp",
  imageAlt: "Project Mockup",
  likes: 0,
  tags: [],
  projectLink: "#",
  linkText: "View Project",
  imagePosition: "left",
};

export default function PortfolioManager() {
  const [headerData, setHeaderData] = useState(initialHeaderState);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingHeader, setSavingHeader] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [modalFormData, setModalFormData] = useState(initialModalForm);
  const [modalImageFile, setModalImageFile] = useState(null);
  const [tagInput, setTagInput] = useState("");
  const [savingProject, setSavingProject] = useState(false);

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  const fetchPortfolioData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/portfolio`);
      const data = await res.json();
      if (res.ok && data.data) {
        if (data.data.header) setHeaderData((prev) => ({ ...prev, ...data.data.header }));
        if (data.data.projects) setProjects(data.data.projects);
      }
    } catch (err) {
      console.error("Failed to fetch portfolio data:", err);
      setStatusMessage({ type: "error", text: "Failed to load Portfolio data." });
    } finally {
      setLoading(false);
    }
  };

  // Header Save Handler
  const handleSaveHeader = async (e) => {
    e.preventDefault();
    setSavingHeader(true);
    setStatusMessage({ type: "", text: "" });

    try {
      const res = await fetch(`${API}/portfolio/header`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(headerData),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save portfolio header.");

      setHeaderData((prev) => ({ ...prev, ...data.data }));
      setStatusMessage({ type: "success", text: "Portfolio header updated successfully!" });
      setTimeout(() => setStatusMessage({ type: "", text: "" }), 4000);
    } catch (err) {
      console.error("Save Header Error:", err);
      setStatusMessage({ type: "error", text: err.message || "Failed to save header." });
    } finally {
      setSavingHeader(false);
    }
  };

  // Modal Open Handlers
  const handleOpenAddModal = () => {
    setEditingProjectId(null);
    setModalFormData({
      ...initialModalForm,
      imagePosition: projects.length % 2 === 0 ? "left" : "right",
    });
    setModalImageFile(null);
    setTagInput("");
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (proj) => {
    setEditingProjectId(proj._id);
    setModalFormData({
      category: proj.category || "",
      title: proj.title || "",
      image: proj.image || "",
      imageAlt: proj.imageAlt || "",
      likes: proj.likes || 0,
      tags: proj.tags || [],
      projectLink: proj.projectLink || "#",
      linkText: proj.linkText || "View Project",
      imagePosition: proj.imagePosition || "left",
    });
    setModalImageFile(null);
    setTagInput("");
    setIsModalOpen(true);
  };

  // Skill Tag Handlers inside Modal
  const handleAddTag = () => {
    if (!tagInput.trim()) return;
    if (modalFormData.tags.includes(tagInput.trim())) {
      setTagInput("");
      return;
    }
    setModalFormData((prev) => ({
      ...prev,
      tags: [...prev.tags, tagInput.trim()],
    }));
    setTagInput("");
  };

  const handleRemoveTag = (indexToRemove) => {
    setModalFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  // Save Project (Create or Edit)
  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!modalFormData.title.trim()) {
      alert("Please enter project title.");
      return;
    }

    setSavingProject(true);
    try {
      let finalImageUrl = modalFormData.image;

      // Handle Image Upload if new file selected
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
      };

      let res, data;
      if (editingProjectId) {
        res = await fetch(`${API}/portfolio/items/${editingProjectId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        res = await fetch(`${API}/portfolio/items`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save project.");

      setIsModalOpen(false);
      fetchPortfolioData();
      setStatusMessage({
        type: "success",
        text: editingProjectId
          ? "Project updated successfully!"
          : "New project added successfully!",
      });
      setTimeout(() => setStatusMessage({ type: "", text: "" }), 4000);
    } catch (err) {
      console.error("Save Project Error:", err);
      alert(err.message || "Failed to save project.");
    } finally {
      setSavingProject(false);
    }
  };

  // Delete Project Handler
  const handleDeleteProject = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;

    try {
      const res = await fetch(`${API}/portfolio/items/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to delete project.");

      setProjects((prev) => prev.filter((p) => p._id !== id));
      setStatusMessage({ type: "success", text: "Project deleted successfully!" });
      setTimeout(() => setStatusMessage({ type: "", text: "" }), 4000);
    } catch (err) {
      console.error("Delete Project Error:", err);
      alert(err.message || "Failed to delete project.");
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-gray-500">Loading Portfolio Section details...</p>
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
              <FolderIcon className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Portfolio Section Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage section title, description, and add/edit/delete portfolio project case studies dynamically.
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold shadow-md shadow-primary/20 transition-all cursor-pointer"
        >
          <PlusIcon className="w-5 h-5" />
          <span>Add New Project</span>
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

      {/* Card 1: Header & Section Settings */}
      <form onSubmit={handleSaveHeader} className="bg-[#0b1326] p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <h2 className="text-base font-bold text-white">
            Portfolio Header Settings
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
            <label className="block text-xs font-semibold text-slate-300 mb-1">Watermark Background Text</label>
            <input
              type="text"
              value={headerData.watermarkText}
              onChange={(e) => setHeaderData({ ...headerData, watermarkText: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700/70 bg-[#121c33] text-white focus:bg-[#16233f] focus:border-primary focus:outline-none"
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Bottom "View All Projects" Button Text</label>
            <input
              type="text"
              value={headerData.viewAllButtonText}
              onChange={(e) => setHeaderData({ ...headerData, viewAllButtonText: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700/70 bg-[#121c33] text-white focus:bg-[#16233f] focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Button Link URL</label>
            <input
              type="text"
              value={headerData.viewAllButtonLink}
              onChange={(e) => setHeaderData({ ...headerData, viewAllButtonLink: e.target.value })}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700/70 bg-[#121c33] text-white focus:bg-[#16233f] focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      </form>

      {/* Projects List Card */}
      <div className="bg-[#0b1326] p-6 rounded-2xl border border-slate-800 shadow-md space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white">
              Portfolio Projects ({projects.length})
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Add new projects or edit existing case studies. They will display dynamically on the website.
            </p>
          </div>

          <button
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl cursor-pointer shadow-sm"
          >
            <PlusIcon className="w-4 h-4" />
            <span>Add Project</span>
          </button>
        </div>

        {/* Projects Cards Grid */}
        {projects.length === 0 ? (
          <div className="p-8 text-center bg-[#121c33] rounded-2xl border border-dashed border-slate-700">
            <p className="text-sm font-semibold text-slate-300">No portfolio projects found</p>
            <p className="text-xs text-slate-400 mt-1">Click "Add Project" to add your first case study.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {projects.map((proj, idx) => (
              <div
                key={proj._id || idx}
                className="bg-[#121c33] border border-slate-800 p-5 rounded-2xl flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all shadow-md"
              >
                <div className="space-y-3">
                  {/* Category Badge & Controls */}
                  <div className="flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase tracking-wider border border-primary/30">
                      {proj.category || "Case Study"}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleOpenEditModal(proj)}
                        className="p-1.5 rounded-lg bg-[#0b1326] border border-slate-700 text-slate-300 hover:text-primary hover:border-primary cursor-pointer transition-colors"
                        title="Edit Project"
                      >
                        <PencilIcon className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteProject(proj._id, proj.title)}
                        className="p-1.5 rounded-lg bg-[#0b1326] border border-slate-700 text-slate-300 hover:text-red-400 hover:border-red-500/30 cursor-pointer transition-colors"
                        title="Delete Project"
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail & Title */}
                  <div className="flex gap-4 items-start pt-1">
                    {proj.image ? (
                      <img
                        src={proj.image}
                        alt={proj.imageAlt || proj.title}
                        className="w-20 h-20 object-cover rounded-xl border border-slate-700 shrink-0 bg-zinc-900"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 shrink-0 border border-slate-700">
                        <PhotoIcon className="w-8 h-8" />
                      </div>
                    )}

                    <div className="space-y-1 min-w-0">
                      <h3 className="font-semibold text-sm text-white line-clamp-2 leading-snug">
                        {proj.title}
                      </h3>
                      <div className="flex items-center gap-3 text-xs text-slate-400 pt-1">
                        <span className="flex items-center gap-1 text-red-400 font-medium">
                          <HeartIcon className="w-3.5 h-3.5 fill-red-400" />
                          <span>{proj.likes || 0}</span>
                        </span>
                        <span>•</span>
                        <span className="text-slate-400">
                          Pos: <strong className="uppercase text-slate-200">{proj.imagePosition || "left"}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Skill Tags */}
                  {proj.tags && proj.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {proj.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="px-2.5 py-0.5 rounded-md bg-[#0b1326] border border-slate-700 text-slate-300 text-[11px] font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Footer link */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                  <span className="truncate">Link: {proj.projectLink || "#"}</span>
                  <span className="font-medium text-slate-200 shrink-0">{proj.linkText || "View Project"}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add / Edit Project Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
          <div className="bg-[#0b1326] text-slate-100 w-full max-w-2xl rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto my-8">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h2 className="text-lg font-bold text-white">
                {editingProjectId ? "Edit Portfolio Project" : "Add New Portfolio Project"}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-200 cursor-pointer"
              >
                <CloseIcon className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category (e.g. Banking, Finance, Healthcare)
                  </label>
                  <input
                    type="text"
                    required
                    value={modalFormData.category}
                    onChange={(e) => setModalFormData({ ...modalFormData, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700/70 bg-[#121c33] text-white focus:bg-[#16233f] focus:border-primary focus:outline-none"
                    placeholder="Banking"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Likes Count (Heart Counter)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={modalFormData.likes}
                    onChange={(e) => setModalFormData({ ...modalFormData, likes: parseInt(e.target.value) || 0 })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700/70 bg-[#121c33] text-white focus:bg-[#16233f] focus:border-primary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Project Title / Case Study Headline
                </label>
                <textarea
                  rows={2}
                  required
                  value={modalFormData.title}
                  onChange={(e) => setModalFormData({ ...modalFormData, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700/70 bg-[#121c33] text-white focus:bg-[#16233f] focus:border-primary focus:outline-none leading-relaxed"
                  placeholder="Transforming 'Genie' into a User-Centric Hub..."
                />
              </div>

              {/* Image Upload Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Project Image Upload
                  </label>
                  <ImageUploader setImage={setModalImageFile} initialImage={modalFormData.image} />
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Direct Image URL / Path
                    </label>
                    <input
                      type="text"
                      value={modalFormData.image}
                      onChange={(e) => setModalFormData({ ...modalFormData, image: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700/70 bg-[#121c33] text-white focus:bg-[#16233f] focus:border-primary focus:outline-none"
                      placeholder="/images/bank-image.webp"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Image Alt Text
                    </label>
                    <input
                      type="text"
                      value={modalFormData.imageAlt}
                      onChange={(e) => setModalFormData({ ...modalFormData, imageAlt: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700/70 bg-[#121c33] text-white focus:bg-[#16233f] focus:border-primary focus:outline-none"
                      placeholder="Genie Banking Dashboard UI"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Image Position Layout
                    </label>
                    <select
                      value={modalFormData.imagePosition}
                      onChange={(e) => setModalFormData({ ...modalFormData, imagePosition: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700/70 bg-[#121c33] text-white focus:bg-[#16233f] focus:border-primary focus:outline-none cursor-pointer"
                    >
                      <option value="left">Image on Left (Standard)</option>
                      <option value="right">Image on Right (Flipped)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Skill Tags */}
              <div className="space-y-2 pt-1">
                <label className="block text-xs font-semibold text-slate-300 flex items-center gap-1">
                  <TagIcon className="w-4 h-4 text-primary" />
                  <span>Skill Tags (e.g. Wireframing, Usability Testing)</span>
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddTag())}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-700/70 bg-[#121c33] text-white focus:bg-[#16233f] focus:border-primary focus:outline-none"
                    placeholder="Add tag (e.g. User Research)"
                  />
                  <button
                    type="button"
                    onClick={handleAddTag}
                    className="px-4 py-2 bg-slate-800 text-white text-xs font-semibold rounded-xl flex items-center gap-1 hover:bg-slate-700 cursor-pointer border border-slate-700"
                  >
                    <PlusIcon className="w-4 h-4" />
                    <span>Add Tag</span>
                  </button>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-2">
                  {modalFormData.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 px-3 py-1 bg-[#121c33] border border-slate-700 text-slate-200 rounded-full text-xs font-medium"
                    >
                      <span>{t}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(idx)}
                        className="text-slate-400 hover:text-red-400 cursor-pointer"
                      >
                        <CloseIcon className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Project Link / Target URL
                  </label>
                  <input
                    type="text"
                    value={modalFormData.projectLink}
                    onChange={(e) => setModalFormData({ ...modalFormData, projectLink: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700/70 bg-[#121c33] text-white focus:bg-[#16233f] focus:border-primary focus:outline-none"
                    placeholder="#project-genie or https://..."
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Link Button Text
                  </label>
                  <input
                    type="text"
                    value={modalFormData.linkText}
                    onChange={(e) => setModalFormData({ ...modalFormData, linkText: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700/70 bg-[#121c33] text-white focus:bg-[#16233f] focus:border-primary focus:outline-none"
                    placeholder="View Project"
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
                  disabled={savingProject}
                  className="flex items-center gap-1.5 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl cursor-pointer disabled:opacity-50 shadow-md shadow-primary/20"
                >
                  {savingProject ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving Project...</span>
                    </>
                  ) : (
                    <>
                      <SaveIcon className="w-4 h-4" />
                      <span>{editingProjectId ? "Update Project" : "Create Project"}</span>
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
