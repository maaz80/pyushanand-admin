import { useState, useEffect } from "react";
import { HiOutlineSave, HiOutlineCheckCircle, HiOutlineUser, HiOutlineExternalLink, HiOutlineDocumentText } from "react-icons/hi";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

const initialFormState = {
  sectionTitle: "About",
  primaryParagraph:
    "I’m currently working as Principal Experience Designer @Designit - a Wipro Company, Bangalore, with 12 years of experience in sectors including Telecom, Banking, Media, E-commerce, and Healthcare. With a fervent commitment to Design Thinking and a User-Centric approach.",
  ctaText: "About me",
  ctaLink: "#about",
  secondaryParagraph1:
    "Over the past 12 years, I have the privilege of collaborating with great global brands like Cynergy Bank, YesBank, Etisalat, OLX, NDTV, V&A Museum and many more.",
  secondaryParagraph2:
    "My collaborative approach and passion for crafting exceptional user experiences make me a valuable asset to any project or team.",
};

export default function AboutManager() {
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    fetchAboutData();
  }, []);

  const fetchAboutData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/about`);
      const data = await res.json();
      if (res.ok && data.data) {
        setFormData((prev) => ({
          ...prev,
          ...data.data,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch about data:", err);
      setStatusMessage({ type: "error", text: "Failed to load About section data." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage({ type: "", text: "" });

    try {
      const res = await fetch(`${API}/about`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to save About section.");
      }

      setFormData((prev) => ({ ...prev, ...data.data }));
      setStatusMessage({ type: "success", text: "About section updated successfully!" });
      setTimeout(() => setStatusMessage({ type: "", text: "" }), 4000);
    } catch (err) {
      console.error("Save About Error:", err);
      setStatusMessage({ type: "error", text: err.message || "Failed to save changes." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-gray-500">Loading About Section details...</p>
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
              <HiOutlineUser className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              About Section Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Customize section title, main bio paragraph, CTA link, and brand experience paragraphs.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary hover:bg-primary-hover text-white rounded-xl font-semibold shadow-md shadow-primary/20 transition-all cursor-pointer disabled:opacity-50"
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
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
              : "bg-red-500/10 text-red-400 border border-red-500/30"
          }`}
        >
          {statusMessage.type === "success" ? (
            <HiOutlineCheckCircle className="w-5 h-5 shrink-0 text-emerald-400" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-red-400 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Form & Live Preview Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Section Title & CTA Button */}
          <div className="bg-[#0b1326] p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
            <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <HiOutlineDocumentText className="w-5 h-5 text-primary" />
              <span>Heading & Call To Action (CTA)</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Section Title</label>
                <input
                  type="text"
                  value={formData.sectionTitle}
                  onChange={(e) => handleChange("sectionTitle", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700/70 bg-[#121c33] text-white focus:bg-[#16233f] focus:border-primary focus:outline-none"
                  placeholder="About"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">CTA Link Text</label>
                <input
                  type="text"
                  value={formData.ctaText}
                  onChange={(e) => handleChange("ctaText", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-700/70 bg-[#121c33] text-white focus:bg-[#16233f] focus:border-primary focus:outline-none"
                  placeholder="About me"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">CTA Target Link / URL</label>
                <div className="relative">
                  <input
                    type="text"
                    value={formData.ctaLink}
                    onChange={(e) => handleChange("ctaLink", e.target.value)}
                    className="w-full pl-3 pr-8 py-2 text-xs rounded-xl border border-slate-700/70 bg-[#121c33] text-white focus:bg-[#16233f] focus:border-primary focus:outline-none"
                    placeholder="#about or /about"
                  />
                  <HiOutlineExternalLink className="w-4 h-4 text-slate-400 absolute right-2.5 top-2.5 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Primary Paragraph */}
          <div className="bg-[#0b1326] p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
            <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Primary Bio / Intro Paragraph
            </h2>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Main Highlighted Paragraph Text
              </label>
              <textarea
                rows={4}
                value={formData.primaryParagraph}
                onChange={(e) => handleChange("primaryParagraph", e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-700/70 bg-[#121c33] text-white focus:bg-[#16233f] focus:border-primary focus:outline-none leading-relaxed"
                placeholder="Enter main bio..."
              />
            </div>
          </div>

          {/* Card 3: Secondary Story Paragraphs */}
          <div className="bg-[#0b1326] p-6 rounded-2xl border border-slate-800 shadow-md space-y-4">
            <h2 className="text-base font-bold text-white border-b border-slate-800 pb-3">
              Secondary Story Paragraphs
            </h2>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Paragraph 1 (Brands & Collaboration)
              </label>
              <textarea
                rows={3}
                value={formData.secondaryParagraph1}
                onChange={(e) => handleChange("secondaryParagraph1", e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-700/70 bg-[#121c33] text-white focus:bg-[#16233f] focus:border-primary focus:outline-none leading-relaxed"
                placeholder="Over the past 12 years..."
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Paragraph 2 (Approach & Values)
              </label>
              <textarea
                rows={3}
                value={formData.secondaryParagraph2}
                onChange={(e) => handleChange("secondaryParagraph2", e.target.value)}
                className="w-full px-3 py-2.5 text-xs rounded-xl border border-slate-700/70 bg-[#121c33] text-white focus:bg-[#16233f] focus:border-primary focus:outline-none leading-relaxed"
                placeholder="My collaborative approach..."
              />
            </div>
          </div>
        </div>

        {/* Live Visual Preview Panel (Right Column) */}
        <div className="space-y-6">
          <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-2xl text-white sticky top-24 space-y-6 overflow-hidden font-sans">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-xs text-zinc-400">
              <span className="font-semibold text-zinc-200">Live About Preview</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">
                Active
              </span>
            </div>

            <div className="space-y-4">
              <h2 className="font-serif font-semibold text-2xl text-white">
                {formData.sectionTitle || "About"}
              </h2>

              <p className="text-zinc-200 text-xs leading-relaxed font-normal border-l-2 border-primary/60 pl-3">
                {formData.primaryParagraph}
              </p>

              <div>
                <a
                  href={formData.ctaLink || "#about"}
                  onClick={(e) => e.preventDefault()}
                  className="inline-flex items-center gap-1.5 text-[#ff5252] text-xs font-medium"
                >
                  <span>{formData.ctaText || "About me"}</span>
                  <span>→</span>
                </a>
              </div>

              <div className="space-y-2 pt-2 border-t border-zinc-800 text-[11px] text-zinc-400 leading-relaxed">
                <p>{formData.secondaryParagraph1}</p>
                <p>{formData.secondaryParagraph2}</p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
