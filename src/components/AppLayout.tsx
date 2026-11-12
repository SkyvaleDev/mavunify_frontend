import { type ReactNode, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Sprout, Home, MessageSquare, ClipboardList, Leaf, CloudSun, Map,
  ShoppingBag, GraduationCap, Users, Headphones, User, Bell,
  Menu, X, LogOut, Settings,
} from "lucide-react";

const NAV_ITEMS = [
  { path: "/dashboard", icon: Home, label: "My Farm" },
  { path: "/farm", icon: Map, label: "Farm Management" },
  { path: "/ask", icon: MessageSquare, label: "Ask Mavunify" },
  { path: "/records", icon: ClipboardList, label: "Farm Records" },
  { path: "/sustainability", icon: Leaf, label: "Sustainability" },
  { path: "/weather", icon: CloudSun, label: "Weather" },
  { path: "/marketplace", icon: ShoppingBag, label: "Marketplace" },
  { path: "/learn", icon: GraduationCap, label: "Learning Centre" },
  { path: "/community", icon: Users, label: "Community" },
  { path: "/experts", icon: Headphones, label: "Experts" },
  { path: "/profile", icon: User, label: "Profile" },
];

const BOTTOM_NAV = [
  { path: "/dashboard", icon: Home, label: "My Farm" },
  { path: "/ask", icon: MessageSquare, label: "Ask" },
  { path: "/records", icon: ClipboardList, label: "Records" },
  { path: "/learn", icon: GraduationCap, label: "Learn" },
  { path: "/profile", icon: User, label: "Profile" },
];

export default function AppLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex">
      {/* ── DESKTOP SIDEBAR ── */}
      <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-[#EAF3EA] fixed inset-y-0 left-0 z-30">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[#EAF3EA]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2E7D32] flex items-center justify-center">
              <Sprout className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="text-lg font-bold text-[#1C2B1C]">Mavunify</span>
          </div>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-smooth ${
                isActive(path)
                  ? "bg-[#F3F8F3] text-[#2E7D32] font-bold"
                  : "text-[#5A6B5A] hover:bg-[#F3F8F3] hover:text-[#1C2B1C]"
              }`}
            >
              <Icon className={`w-4.5 h-4.5 flex-shrink-0 ${isActive(path) ? "text-[#2E7D32]" : ""}`} />
              {label}
              {isActive(path) && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-[#2E7D32]" />}
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-[#EAF3EA] space-y-0.5">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#5A6B5A] hover:bg-[#F3F8F3] transition-smooth">
            <Settings className="w-4.5 h-4.5" /> Settings
          </button>
          <button
            onClick={() => navigate("/")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-[#E53935] hover:bg-red-50 transition-smooth"
          >
            <LogOut className="w-4.5 h-4.5" /> Log Out
          </button>
        </div>
      </aside>

      {/* ── MOBILE SIDEBAR OVERLAY ── */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
          <aside className="relative w-72 bg-white h-full flex flex-col shadow-xl slide-up">
            <div className="px-5 py-5 flex items-center justify-between border-b border-[#EAF3EA]">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#2E7D32] flex items-center justify-center">
                  <Sprout className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-[#1C2B1C]">Mavunify</span>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="p-2 rounded-lg text-[#5A6B5A]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
              {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
                <button
                  key={path}
                  onClick={() => { navigate(path); setSidebarOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium transition-smooth ${
                    isActive(path) ? "bg-[#F3F8F3] text-[#2E7D32] font-bold" : "text-[#5A6B5A]"
                  }`}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" /> {label}
                </button>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 lg:ml-64 flex flex-col min-h-screen">
        {/* Top bar (mobile) */}
        <header className="lg:hidden sticky top-0 z-20 bg-white border-b border-[#EAF3EA] px-4 py-3.5 flex items-center justify-between">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl text-[#5A6B5A] hover:bg-[#F3F8F3]">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#2E7D32] flex items-center justify-center">
              <Sprout className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-[#1C2B1C] text-base">Mavunify</span>
          </div>
          <button className="relative p-2 rounded-xl text-[#5A6B5A] hover:bg-[#F3F8F3]">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#E53935] pulse-green" />
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 pb-20 lg:pb-0">
          {children}
        </main>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-20 bg-white border-t border-[#EAF3EA] px-2 py-2 flex items-center justify-around">
        {BOTTOM_NAV.map(({ path, icon: Icon, label }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-smooth ${
              isActive(path) ? "text-[#2E7D32]" : "text-[#8A9B8A]"
            }`}
          >
            <Icon className={`w-5 h-5 ${isActive(path) ? "text-[#2E7D32]" : ""}`} />
            <span className={`text-[10px] font-medium ${isActive(path) ? "font-bold" : ""}`}>{label}</span>
            {isActive(path) && <div className="w-1 h-1 rounded-full bg-[#2E7D32]" />}
          </button>
        ))}
      </nav>
    </div>
  );
}
