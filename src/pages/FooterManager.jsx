import { useState, useEffect } from "react";
import {
  HiOutlineSave as SaveIcon,
  HiOutlineCheckCircle as CheckIcon,
  HiOutlineLink as LinkIcon,
  HiOutlinePhotograph as PhotoIcon,
  HiOutlinePlus as PlusIcon,
  HiOutlineTrash as TrashIcon,
  HiOutlineMail as MailIcon,
  HiOutlinePhone as PhoneIcon,
  HiOutlineDownload as DownloadIcon,
} from "react-icons/hi";
import ImageUploader from "../components/ImageUploader";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

const initialFormState = {
  watermarkText: "Let's Collaborate",
  logoUrl: "/images/logo.webp",
  hirePillText: "Hire me :)",
  headline:
    "Let’s collaborate & craft more equitable and enjoyable user experiences.",
  quickLinks: [
    { category: "Banking", title: "Transforming Genie", link: "#project-genie" },
    { category: "Finance", title: "Personal Finance Management", link: "#project-finance" },
    { category: "Wellbeing", title: "Design Thinking & Innovation", link: "#project-bmcr" },
    { category: "Wellbeing", title: "Insijam", link: "#project-insijam" },
  ],
  behanceUrl: "https://www.behance.net/pyushanand",
  dribbbleUrl: "https://dribbble.com/pyushanand",
  instagramUrl: "#instagram",
  linkedinUrl: "https://www.linkedin.com/in/kalra/",
  email: "pyushanand2007@gmail.com",
  phone: "+91-8700671102",
  downloadText: "Download Resume",
  downloadLink: "#download-resume",
};

export default function FooterManager() {
  const [formData, setFormData] = useState(initialFormState);
  const [logoFile, setLogoFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState({ type: "", text: "" });

  // Quick Link Add Form
  const [newQuickLink, setNewQuickLink] = useState({ category: "", title: "", link: "#" });

  useEffect(() => {
    fetchFooterData();
  }, []);

  const fetchFooterData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/footer`);
      const data = await res.json();
      if (res.ok && data.data) {
        setFormData((prev) => ({
          ...prev,
          ...data.data,
          quickLinks: data.data.quickLinks || prev.quickLinks,
        }));
      }
    } catch (err) {
      console.error("Failed to fetch footer data:", err);
      setStatusMessage({ type: "error", text: "Failed to load Footer section data." });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddQuickLink = () => {
    if (!newQuickLink.title.trim()) return;
    setFormData((prev) => ({
      ...prev,
      quickLinks: [
        ...prev.quickLinks,
        {
          category: newQuickLink.category.trim() || "Case Study",
          title: newQuickLink.title.trim(),
          link: newQuickLink.link.trim() || "#",
        },
      ],
    }));
    setNewQuickLink({ category: "", title: "", link: "#" });
  };

  const handleRemoveQuickLink = (indexToRemove) => {
    setFormData((prev) => ({
      ...prev,
      quickLinks: prev.quickLinks.filter((_, idx) => idx !== indexToRemove),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMessage({ type: "", text: "" });

    try {
      let updatedLogoUrl = formData.logoUrl;

      // Handle logo upload if a file was selected
      if (logoFile instanceof File) {
        const uploadData = new FormData();
        uploadData.append("image", logoFile);

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

      const res = await fetch(`${API}/footer`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save Footer section.");

      setFormData((prev) => ({ ...prev, ...data.data }));
      setLogoFile(null);
      setStatusMessage({ type: "success", text: "Footer section updated successfully!" });
      setTimeout(() => setStatusMessage({ type: "", text: "" }), 4000);
    } catch (err) {
      console.error("Save Footer Error:", err);
      setStatusMessage({ type: "error", text: err.message || "Failed to save changes." });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-sm font-medium text-gray-500">Loading Footer Section details...</p>
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
              <LinkIcon className="w-5 h-5" />
            </span>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Footer Section Management
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Customize watermark text, main headline, social links, contact info, and case study quick links.
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
              <SaveIcon className="w-5 h-5" />
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
            <CheckIcon className="w-5 h-5 shrink-0 text-emerald-600" />
          ) : (
            <div className="w-2 h-2 rounded-full bg-red-600 shrink-0" />
          )}
          <span>{statusMessage.text}</span>
        </div>
      )}

      {/* Form Content Grid */}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Branding & Headline */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <PhotoIcon className="w-5 h-5 text-primary" />
              <span>Logo & Headline Settings</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Footer Logo Upload</label>
                <ImageUploader setImage={setLogoFile} initialImage={formData.logoUrl} />
              </div>
              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Logo URL / Path</label>
                  <input
                    type="text"
                    value={formData.logoUrl}
                    onChange={(e) => handleChange("logoUrl", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none"
                    placeholder="/images/logo.webp"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Hire Me Badge Pill Text</label>
                  <input
                    type="text"
                    value={formData.hirePillText}
                    onChange={(e) => handleChange("hirePillText", e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none"
                    placeholder="Hire me :)"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Watermark Background Text</label>
                <input
                  type="text"
                  value={formData.watermarkText}
                  onChange={(e) => handleChange("watermarkText", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none"
                  placeholder="Let's Collaborate"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Main Headline</label>
                <textarea
                  rows={2}
                  value={formData.headline}
                  onChange={(e) => handleChange("headline", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none leading-relaxed"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Contact Details & Resume */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3 flex items-center gap-2">
              <MailIcon className="w-5 h-5 text-primary" />
              <span>Contact Details & Resume Link</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                  <MailIcon className="w-3.5 h-3.5 text-gray-400" />
                  <span>Email Address</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none"
                  placeholder="pyushanand2007@gmail.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                  <PhoneIcon className="w-3.5 h-3.5 text-gray-400" />
                  <span>Phone Number</span>
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none"
                  placeholder="+91-8700671102"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Download Resume Link Text</label>
                <input
                  type="text"
                  value={formData.downloadText}
                  onChange={(e) => handleChange("downloadText", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none"
                  placeholder="Download Resume"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1 flex items-center gap-1">
                  <DownloadIcon className="w-3.5 h-3.5 text-gray-400" />
                  <span>Resume PDF / Link URL</span>
                </label>
                <input
                  type="text"
                  value={formData.downloadLink}
                  onChange={(e) => handleChange("downloadLink", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none"
                  placeholder="#download-resume or https://..."
                />
              </div>
            </div>
          </div>

          {/* Card 3: Social Media Links */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Social Media Links
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Behance Profile URL</label>
                <input
                  type="text"
                  value={formData.behanceUrl}
                  onChange={(e) => handleChange("behanceUrl", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none"
                  placeholder="https://www.behance.net/pyushanand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Dribbble Profile URL</label>
                <input
                  type="text"
                  value={formData.dribbbleUrl}
                  onChange={(e) => handleChange("dribbbleUrl", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none"
                  placeholder="https://dribbble.com/pyushanand"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Instagram Profile URL</label>
                <input
                  type="text"
                  value={formData.instagramUrl}
                  onChange={(e) => handleChange("instagramUrl", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none"
                  placeholder="#instagram"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">LinkedIn Profile URL</label>
                <input
                  type="text"
                  value={formData.linkedinUrl}
                  onChange={(e) => handleChange("linkedinUrl", e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none"
                  placeholder="https://www.linkedin.com/in/kalra/"
                />
              </div>
            </div>
          </div>

          {/* Card 4: Quick Links / Case Studies Links Manager */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-gray-900 border-b border-gray-100 pb-3">
              Footer Quick Links ({formData.quickLinks.length})
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Category (e.g. Banking)"
                value={newQuickLink.category}
                onChange={(e) => setNewQuickLink({ ...newQuickLink, category: e.target.value })}
                className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none"
              />
              <input
                type="text"
                placeholder="Link Title (e.g. Transforming Genie)"
                value={newQuickLink.title}
                onChange={(e) => setNewQuickLink({ ...newQuickLink, title: e.target.value })}
                className="px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none"
              />
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Target Link (#project-genie)"
                  value={newQuickLink.link}
                  onChange={(e) => setNewQuickLink({ ...newQuickLink, link: e.target.value })}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-gray-200 bg-gray-50 focus:bg-white focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddQuickLink}
                  className="px-3 py-2 bg-primary text-white text-xs font-semibold rounded-xl flex items-center gap-1 hover:bg-primary/90 cursor-pointer"
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {formData.quickLinks.map((ql, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-gray-50 border border-gray-200 rounded-xl flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5 truncate">
                    <span className="text-[10px] text-gray-400 font-semibold uppercase block">
                      {ql.category || "Case Study"}
                    </span>
                    <p className="font-bold text-gray-800 truncate">{ql.title}</p>
                    <p className="text-gray-400 text-[11px] truncate">{ql.link}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveQuickLink(idx)}
                    className="text-gray-400 hover:text-red-500 cursor-pointer p-1"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Visual Preview Panel (Right Column) */}
        <div className="space-y-6">
          <div className="bg-zinc-950 p-6 rounded-3xl border border-zinc-800 shadow-2xl text-white sticky top-24 space-y-6 overflow-hidden font-sans">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3 text-xs text-zinc-400">
              <span className="font-semibold text-zinc-200">Live Footer Preview</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px]">Active</span>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                {formData.logoUrl && (
                  <img src={formData.logoUrl} alt="Logo" className="h-6 w-auto object-contain" />
                )}
                <span className="bg-white/10 text-white text-[10px] px-2.5 py-0.5 rounded-full">
                  {formData.hirePillText}
                </span>
              </div>

              <h3 className="font-serif font-bold text-lg text-white leading-snug">
                {formData.headline}
              </h3>

              <div className="pt-2 border-t border-zinc-800 space-y-2 text-xs">
                <span className="text-[10px] text-zinc-500 uppercase tracking-wider block font-semibold">Quick Links</span>
                <div className="grid grid-cols-2 gap-2">
                  {formData.quickLinks.map((q, i) => (
                    <div key={i} className="text-[11px]">
                      <span className="text-zinc-500 block text-[9px]">{q.category}</span>
                      <span className="font-semibold text-zinc-200 hover:underline">{q.title}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-zinc-800 space-y-1 text-[11px] text-zinc-300">
                <p>Email: <span className="text-zinc-100 font-medium">{formData.email}</span></p>
                <p>Phone: <span className="text-zinc-100 font-medium">{formData.phone}</span></p>
                <p>Resume: <span className="text-primary font-medium">{formData.downloadText}</span></p>
              </div>

              <div className="text-[10px] text-zinc-500 pt-2 border-t border-zinc-800 text-center uppercase tracking-widest font-serif">
                {formData.watermarkText}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
