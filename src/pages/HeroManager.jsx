import { useState, useEffect } from "react";
import { HiOutlineSave, HiOutlineCheckCircle, HiOutlineSparkles, HiOutlineTag, HiOutlinePlus, HiOutlineTrash, HiOutlinePhotograph } from "react-icons/hi";
import ImageUploader from "../components/ImageUploader";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

const initialFormState = {
  logoUrl: "/images/logo.webp",
  logoAlt: " Pyush Anand Logo",
  titleLine1Prefix: "Principal",
  highlight1Text: "Experience",
  highlight1Color: "#00c853",
  badge1Text: "User Experience Audit",
  badge1Color: "#00c853",
  titleLine2: "Designer, rooted in Design",
  highlight2Text: "Thinking",
  highlight2Color: "#f59e0b",
  badge2Text: "Wireframing",
  badge2Color: "#f59e0b",
  titleLine3Middle: "and a",
  highlight3Text: "passion",
  highlight3Color: "#ff3d00",
  badge3Text: "Visual Design",
  badge3Color: "#ff3d00",
  titleLine3Suffix: "for",
  highlight4Text: "User-Centric",
  highlight4Color: "#ec4899",
  badge4Text: "User Research",
  badge4Color: "#ec4899",
  highlight5Text: "Solutions",
  highlight5Color: "#8b5cf6",
  badge5Text: "Prototype",
  badge5Color: "#8b5cf6",
  subtitle: "Pyush Anand, crafting equitable and enjoyable user experiences, where usability meets delight.",
  badge6Text: "Design System",
  badge6Color: "#0070f3",
  locations: ["Delhi", "Gurgaon", "Dubai", "UK", "US", "Noida"],
};

export default function HeroManager() {
  const [formData, setFormData] = useState(initialFormState);
  const [imageFile, setImageFile] = useState(null);
  const [newLocation, setNewLocation] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/hero`);
      const data = await res.json();
      if (res.ok && data.data) {
        setFormData((prev) => ({
          ...prev,
          ...data.data,
          locations: data.data.locations || prev.locations,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch hero data:", err);
      setStatusMessage({ type: "error", text: "Failed to load hero section data." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddLocation = () => {
    if (!newLocation.trim()) return;
    if (formData.locations.includes(newLocation.trim())) {
      setNewLocation("");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      locations: [...prev.locations, newLocation.trim()],
    }));
    setNewLocation("");
  };

  const handleRemoveLocation = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      locations: prev.locations.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage({ type: "", text: "" });

    try {
      let updatedLogoUrl = formData.logoUrl;

      // Handle image upload if a new file is chosen
      if (imageFile instanceof File) {
        const uploadData = new FormData();
        uploadData.append("image", imageFile);

        const uploadRes = await fetch(`${API}/upload`, {
          method: "POST",
          body: uploadData,
        });

        const uploadJson = await uploadRes.json();
        if (uploadRes.ok && uploadJson.url) {
          updatedLogoUrl = uploadJson.url;
        } else {
          throw new Error(uploadJson.error || "Image upload failed");
        }
      }

      const payload = {
        ...formData,
        logoUrl: updatedLogoUrl,
      };

      const res = await fetch(`${API}/hero`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save Hero section.");
      }

      setFormData((prev) => ({ ...prev, ...data.data }));
      setImageFile(null);
      setStatusMessage({ type: "success", text: "Hero section updated successfully!" });
      setTimeout(() => setStatusMessage({ type: "", text: "" }), 4000);
    } catch (err) {
      console.error("Save Hero Error:", err);
      setStatusMessage({ type: "error", text: err.message || "Failed to save changes." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-gray-500">Loading Hero Section details...</p>
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
              <HiOutlineSparkles className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Hero Section Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Edit titles, highlight colors, floating badge labels, logo, subtitle & locations dynamically.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary/90 text-white rounded-xl font-semibold shadow-md shadow-primary/20 transition-all cursor-pointer disabled:opacity-50"
        >
          {saving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <HiOutlineSave className="w-5 h-5" />
              <span>Save Changes</span>
            </>
          )}
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
            <HiOutlineCheckCircle className="w-5 h-5 shrink-0 text-emerald-600" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Form Content Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Logo & Brand */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <HiOutlinePhotograph className="w-5 h-5 text-primary" />
              <span>Logo Settings</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Logo Image Upload</label>
                <ImageUploader setImage={setImageFile} initialImage={formData.logoUrl} />
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Logo URL (Direct Link)</label>
                  <input
                    type="text"
                    value={formData.logoUrl}
                    onChange={(e) => handleChange("logoUrl", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none"
                    placeholder="/images/logo.webp"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Logo Alt Text</label>
                  <input
                    type="text"
                    value={formData.logoAlt}
                    onChange={(e) => handleChange("logoAlt", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none"
                    placeholder="Pyush AnandLogo"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Main Heading Lines */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-6">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Main Heading Content & Badges
            </h2>

            {/* Line 1 */}
            <div className="p-4 bg-gray-50/60 rounded-xl border border-gray-100 space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Line 1 Elements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Line 1 Prefix Text</label>
                  <input
                    type="text"
                    value={formData.titleLine1Prefix}
                    onChange={(e) => handleChange("titleLine1Prefix", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Highlighted Word 1</label>
                  <input
                    type="text"
                    value={formData.highlight1Text}
                    onChange={(e) => handleChange("highlight1Text", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Underline Color 1</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.highlight1Color}
                      onChange={(e) => handleChange("highlight1Color", e.target.value)}
                      className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.highlight1Color}
                      onChange={(e) => handleChange("highlight1Color", e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Badge 1 Text</label>
                  <input
                    type="text"
                    value={formData.badge1Text}
                    onChange={(e) => handleChange("badge1Text", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-primary"
                  />
                </div>
              </div>
            </div>

            {/* Line 2 */}
            <div className="p-4 bg-gray-50/60 rounded-xl border border-gray-100 space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Line 2 Elements</h3>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Line 2 Full Text</label>
                <input
                  type="text"
                  value={formData.titleLine2}
                  onChange={(e) => handleChange("titleLine2", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white focus:outline-none focus:border-primary"
                />
              </div>
            </div>

            {/* Line 3 */}
            <div className="p-4 bg-gray-50/60 rounded-xl border border-gray-100 space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Line 3 Elements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Highlighted Word 2</label>
                  <input
                    type="text"
                    value={formData.highlight2Text}
                    onChange={(e) => handleChange("highlight2Text", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Badge 2 Text</label>
                  <input
                    type="text"
                    value={formData.badge2Text}
                    onChange={(e) => handleChange("badge2Text", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Badge 2 Color</label>
                  <input
                    type="color"
                    value={formData.highlight2Color}
                    onChange={(e) => {
                      handleChange("highlight2Color", e.target.value);
                      handleChange("badge2Color", e.target.value);
                    }}
                    className="w-full h-8 rounded border border-gray-200 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Middle Text ("and a")</label>
                  <input
                    type="text"
                    value={formData.titleLine3Middle}
                    onChange={(e) => handleChange("titleLine3Middle", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Suffix Text ("for")</label>
                  <input
                    type="text"
                    value={formData.titleLine3Suffix}
                    onChange={(e) => handleChange("titleLine3Suffix", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Highlighted Word 3</label>
                  <input
                    type="text"
                    value={formData.highlight3Text}
                    onChange={(e) => handleChange("highlight3Text", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Badge 3 Text</label>
                  <input
                    type="text"
                    value={formData.badge3Text}
                    onChange={(e) => handleChange("badge3Text", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Badge 3 Color</label>
                  <input
                    type="color"
                    value={formData.highlight3Color}
                    onChange={(e) => {
                      handleChange("highlight3Color", e.target.value);
                      handleChange("badge3Color", e.target.value);
                    }}
                    className="w-full h-8 rounded border border-gray-200 cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Line 4 */}
            <div className="p-4 bg-gray-50/60 rounded-xl border border-gray-100 space-y-3">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Line 4 Elements</h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Highlighted Word 4</label>
                  <input
                    type="text"
                    value={formData.highlight4Text}
                    onChange={(e) => handleChange("highlight4Text", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Badge 4 Text</label>
                  <input
                    type="text"
                    value={formData.badge4Text}
                    onChange={(e) => handleChange("badge4Text", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Badge 4 Color</label>
                  <input
                    type="color"
                    value={formData.highlight4Color}
                    onChange={(e) => {
                      handleChange("highlight4Color", e.target.value);
                      handleChange("badge4Color", e.target.value);
                    }}
                    className="w-full h-8 rounded border border-gray-200 cursor-pointer"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Highlighted Word 5</label>
                  <input
                    type="text"
                    value={formData.highlight5Text}
                    onChange={(e) => handleChange("highlight5Text", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Badge 5 Text</label>
                  <input
                    type="text"
                    value={formData.badge5Text}
                    onChange={(e) => handleChange("badge5Text", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-gray-200 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Badge 5 Color</label>
                  <input
                    type="color"
                    value={formData.highlight5Color}
                    onChange={(e) => {
                      handleChange("highlight5Color", e.target.value);
                      handleChange("badge5Color", e.target.value);
                    }}
                    className="w-full h-8 rounded border border-gray-200 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Subtitle Pill & Bottom Badge */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Subtitle Pill & Subtitle Badge
            </h2>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">Subtitle Text</label>
              <textarea
                rows={3}
                value={formData.subtitle}
                onChange={(e) => handleChange("subtitle", e.target.value)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Subtitle Floating Badge Text</label>
                <input
                  type="text"
                  value={formData.badge6Text}
                  onChange={(e) => handleChange("badge6Text", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Subtitle Floating Badge Color</label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={formData.badge6Color}
                    onChange={(e) => handleChange("badge6Color", e.target.value)}
                    className="w-8 h-8 rounded border border-gray-200 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={formData.badge6Color}
                    onChange={(e) => handleChange("badge6Color", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Footer Location Tags */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <HiOutlineTag className="w-5 h-5 text-primary" />
              <span>Location Tags (Footer Bar)</span>
            </h2>

            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newLocation}
                onChange={(e) => setNewLocation(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddLocation())}
                placeholder="Add location (e.g. Toronto)"
                className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddLocation}
                className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl flex items-center gap-1 hover:bg-primary/90 cursor-pointer"
              >
                <HiOutlinePlus className="w-4 h-4" />
                <span>Add Tag</span>
              </button>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              {formData.locations.map((loc, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 border border-gray-200 text-gray-800 rounded-full text-xs font-medium"
                >
                  <span>{loc}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLocation(idx)}
                    className="text-gray-400 hover:text-red-500 cursor-pointer"
                  >
                    <HiOutlineTrash className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Live Visual Preview Panel (Right Column) */}
        <div className="space-y-6">
          <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-2xl text-white sticky top-24 space-y-6 overflow-hidden font-serif">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 font-sans text-xs text-zinc-400">
              <span className="font-semibold text-zinc-200">Live Hero Preview</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">Active</span>
            </div>

            {/* Logo Preview */}
            <div className="flex items-center justify-between">
              {formData.logoUrl ? (
                <img src={formData.logoUrl} alt={formData.logoAlt} className="h-7 w-auto object-contain" />
              ) : (
                <span className="text-xs text-zinc-500 font-sans">Logo Placeholder</span>
              )}
            </div>

            {/* Heading Preview */}
            <div className="text-center text-sm leading-relaxed space-y-1">
              <div>
                <span>{formData.titleLine1Prefix} </span>
                <span className="border-b-2 font-bold" style={{ borderColor: formData.highlight1Color }}>
                  {formData.highlight1Text}
                </span>
              </div>
              <div className="text-zinc-300 font-sans text-xs">{formData.titleLine2}</div>
              <div>
                <span className="border-b-2" style={{ borderColor: formData.highlight2Color }}>
                  {formData.highlight2Text}
                </span>{" "}
                <span>{formData.titleLine3Middle} </span>
                <span className="border-b-2" style={{ borderColor: formData.highlight3Color }}>
                  {formData.highlight3Text}
                </span>{" "}
                <span>{formData.titleLine3Suffix}</span>
              </div>
              <div>
                <span className="border-b-2" style={{ borderColor: formData.highlight4Color }}>
                  {formData.highlight4Text}
                </span>{" "}
                <span className="border-b-2" style={{ borderColor: formData.highlight5Color }}>
                  {formData.highlight5Text}
                </span>
              </div>
            </div>

            {/* Badges Summary */}
            <div className="space-y-1.5 font-sans pt-2 border-t border-zinc-800/80">
              <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block">Active Badges</span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  { text: formData.badge1Text, color: formData.highlight1Color },
                  { text: formData.badge2Text, color: formData.highlight2Color },
                  { text: formData.badge3Text, color: formData.highlight3Color },
                  { text: formData.badge4Text, color: formData.highlight4Color },
                  { text: formData.badge5Text, color: formData.highlight5Color },
                  { text: formData.badge6Text, color: formData.badge6Color },
                ].map((b, i) => (
                  <span
                    key={i}
                    style={{ backgroundColor: b.color }}
                    className="text-[10px] text-white font-medium px-2 py-0.5 rounded-full shadow-xs"
                  >
                    {b.text}
                  </span>
                ))}
              </div>
            </div>

            {/* Subtitle Preview */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 text-center text-xs text-zinc-300 font-sans">
              <p className="line-clamp-3">{formData.subtitle}</p>
            </div>

            {/* Footer Location Bar Preview */}
            <div className="text-center text-[11px] text-zinc-400 font-sans pt-2 border-t border-zinc-800/80 flex flex-wrap justify-center gap-1.5">
              {formData.locations.map((loc, i) => (
                <span key={i}>
                  {loc} {i < formData.locations.length - 1 && "•"}
                </span>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
