import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import HeroManager from "./pages/HeroManager";
import AboutManager from "./pages/AboutManager";
import PortfolioManager from "./pages/PortfolioManager";
import ResumeManager from "./pages/ResumeManager";
import CompanyManager from "./pages/CompanyManager";
import FooterManager from "./pages/FooterManager";
import AdminLayout from "./components/AdminLayout";

const protectedPage = (page) => (
  <ProtectedRoute>
    <AdminLayout>{page}</AdminLayout>
  </ProtectedRoute>
);

const App = () => {
  return (
    <div className="poppins-regular">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={protectedPage(<HeroManager />)} />
        <Route path="/hero" element={protectedPage(<HeroManager />)} />
        <Route path="/about" element={protectedPage(<AboutManager />)} />
        <Route path="/portfolio" element={protectedPage(<PortfolioManager />)} />
        <Route path="/resume" element={protectedPage(<ResumeManager />)} />
        <Route path="/companies" element={protectedPage(<CompanyManager />)} />
        <Route path="/footer" element={protectedPage(<FooterManager />)} />
      </Routes>
    </div>
  );
};

export default App;
