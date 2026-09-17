import { Link, useLocation, useNavigate } from "react-router-dom";
import { HiOutlineHome, HiChevronRight, HiOutlineArrowLeft } from "react-icons/hi";

const Breadcrumb = () => {
     const location = useLocation();
     const navigate = useNavigate();

     const pathnames = location.pathname.split("/").filter((x) => x);

     const filteredPathnames =
          pathnames[0] === "location" && pathnames.length >= 3
               ? [pathnames[pathnames.length - 1]]
               : pathnames;

     return (
          <div className="flex items-center justify-between px-6 py-4 bg-[#0b1326] border-b border-slate-800 mb-6 shrink-0 w-full text-slate-300">
               <div className="flex items-center gap-2 text-xs text-slate-400 font-medium font-sans">
                    {/* Home Link */}
                    <Link
                         to="/"
                         className="flex items-center gap-1.5 hover:text-primary transition-colors text-slate-300"
                    >
                         <HiOutlineHome className="w-3.5 h-3.5" />
                         <span>Home</span>
                    </Link>

                    {filteredPathnames.map((name, index) => {
                         const routeTo = "/" + filteredPathnames.slice(0, index + 1).join("/");
                         const isLast = index === filteredPathnames.length - 1;

                         const label = name
                              .replace(/[-_]/g, " ")
                              .replace(/\b\w/g, (l) => l.toUpperCase());

                         return (
                              <div key={routeTo} className="flex items-center gap-2">
                                   <HiChevronRight className="w-3.5 h-3.5 text-slate-500" />
                                   {isLast ? (
                                        <span className="text-white font-semibold truncate max-w-[150px] sm:max-w-[300px]">
                                             {label}
                                        </span>
                                   ) : (
                                        <Link
                                             to={routeTo}
                                             className="hover:text-primary transition-colors truncate max-w-[150px] sm:max-w-[300px] text-slate-300"
                                        >
                                             {label}
                                        </Link>
                                   )}
                              </div>
                         );
                    })}
               </div>

               {/* Back Button */}
               {pathnames.length > 0 && (
                    <button
                         onClick={() => navigate(-1)}
                         className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-[#121c33] hover:bg-[#182440] hover:text-white text-slate-300 text-xs font-semibold transition-all duration-200 cursor-pointer shadow-sm font-sans"
                    >
                         <HiOutlineArrowLeft className="w-3.5 h-3.5" />
                         <span>Back</span>
                    </button>
               )}
          </div>
     );
};

export default Breadcrumb;