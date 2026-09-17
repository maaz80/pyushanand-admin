import { useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { clearAdminToken, isAdminLoggedIn, setAdminToken } from "../utils/auth.js";
import { HiOutlineLockClosed, HiOutlineUser, HiOutlineLockOpen } from "react-icons/hi";

const API = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000/api";

export default function Login() {
     const navigate = useNavigate();
     const [username, setUsername] = useState("");
     const [password, setPassword] = useState("");
     const [loading, setLoading] = useState(false);
     const [error, setError] = useState("");

     if (isAdminLoggedIn()) {
          return <Navigate to="/" replace />;
     }

     const handleSubmit = async (event) => {
          event.preventDefault();
          clearAdminToken();
          setError("");
          setLoading(true);

          try {
               const res = await fetch(`${API}/admin/login`, {
                    method: "POST",
                    headers: {
                         "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ username: username.trim(), password })
               });

               const data = await res.json();

               if (!res.ok) {
                    throw new Error(data.error || "Login failed.");
               }

               setAdminToken(data.token);
               navigate("/", { replace: true });
          } catch (err) {
               setError(err.message);
          } finally {
               setLoading(false);
          }
     };

     return (
          <div className="min-h-screen bg-[#14203A] text-slate-100 flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans">
               {/* Background Decorative Blobs */}
               <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
               <div className="absolute bottom-0 right-0 translate-x-1/3 translate-y-1/3 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />

               <div className="w-full max-w-md z-10 space-y-8">
                    {/* Brand / Logo */}
                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                         <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center text-white font-extrabold text-2xl shadow-lg shadow-primary/30">
                              P
                         </div>
                         <div>
                              <h1 className="text-2xl font-bold text-white tracking-tight">
                                   Pyush Anand Admin
                              </h1>
                              <p className="text-slate-400 text-sm mt-1">
                                   Enter credentials to manage your portfolio
                              </p>
                         </div>
                    </div>

                    {/* Card Container */}
                    <div className="bg-[#0b1326] border border-slate-800 p-8 rounded-3xl shadow-2xl space-y-6">
                         <form onSubmit={handleSubmit} className="space-y-5">
                              {/* Username Input */}
                              <div className="space-y-1.5">
                                   <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Username
                                   </label>
                                   <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                             <HiOutlineUser className="w-5 h-5" />
                                        </div>
                                        <input
                                             type="text"
                                             value={username}
                                             onChange={(event) => setUsername(event.target.value)}
                                             className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-700/70 bg-[#121c33] text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:bg-[#16233f] transition-all duration-200"
                                             placeholder="admin"
                                             autoComplete="username"
                                             required
                                        />
                                   </div>
                              </div>

                              {/* Password Input */}
                              <div className="space-y-1.5">
                                   <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        Password
                                   </label>
                                   <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                                             <HiOutlineLockClosed className="w-5 h-5" />
                                        </div>
                                        <input
                                             type="password"
                                             value={password}
                                             onChange={(event) => setPassword(event.target.value)}
                                             className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-700/70 bg-[#121c33] text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary focus:bg-[#16233f] transition-all duration-200"
                                             placeholder="••••••••"
                                             autoComplete="current-password"
                                             required
                                        />
                                   </div>
                              </div>

                              {/* Error alert */}
                              {error && (
                                   <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-xs font-medium flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                                        <span>{error}</span>
                                   </div>
                              )}

                              {/* Submit button */}
                              <button
                                   type="submit"
                                   disabled={loading}
                                   className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white py-3 rounded-xl font-semibold shadow-lg shadow-primary/25 hover:-translate-y-0.5 disabled:translate-y-0 transition-all duration-200 cursor-pointer disabled:cursor-not-allowed text-sm"
                              >
                                   {loading ? (
                                        <>
                                             <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                             <span>Logging in...</span>
                                        </>
                                   ) : (
                                        <>
                                             <span>Sign In</span>
                                        </>
                                   )}
                              </button>
                         </form>
                    </div>
               </div>
          </div>
     );
}
