import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Landing from "@/pages/Landing";
import Auth from "@/pages/Auth";
import Dashboard from "@/pages/Dashboard";
import AskMavunify from "@/pages/AskMavunify";
import FarmRecords from "@/pages/FarmRecords";
import Sustainability from "@/pages/Sustainability";
import Weather from "@/pages/Weather";
import Marketplace from "@/pages/Marketplace";
import LearningCentre from "@/pages/LearningCentre";
import Community from "@/pages/Community";
import Experts from "@/pages/Experts";
import Profile from "@/pages/Profile";
import FarmManagement from "@/pages/FarmPortfolio";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/farm" element={<FarmManagement />} />
        <Route path="/ask" element={<AskMavunify />} />
        <Route path="/records" element={<FarmRecords />} />
        <Route path="/sustainability" element={<Sustainability />} />
        <Route path="/weather" element={<Weather />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/learn" element={<LearningCentre />} />
        <Route path="/community" element={<Community />} />
        <Route path="/experts" element={<Experts />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
