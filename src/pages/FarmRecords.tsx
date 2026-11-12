import { useState } from "react";
import { Plus, Camera, FileText, TrendingUp, Sprout, Package, DollarSign, ArrowUpRight } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const TABS = ["All", "Planting", "Harvesting", "Inputs", "Expenses", "Income", "Photos"];

const RECORDS = [
  { icon: "🌱", type: "Planting", title: "Planted 200 coffee seedlings", date: "15 July 2025", note: "Field A, using organic nursery seedlings", category: "Planting", color: "#2E7D32" },
  { icon: "💧", type: "Input", title: "Applied neem oil spray — Field B", date: "12 July 2025", note: "2 litres mixed in 10L water, aphid control", category: "Inputs", color: "#1976D2" },
  { icon: "🧺", type: "Harvest", title: "Harvested 120kg dry beans", date: "8 July 2025", note: "Field C, Long rains season yield", category: "Harvesting", color: "#F9A825" },
  { icon: "💰", type: "Income", title: "Sold beans — UGX 480,000", date: "9 July 2025", note: "Sold to Jinja market, UGX 4,000/kg", category: "Income", color: "#00796B" },
  { icon: "🧪", type: "Input", title: "Applied compost — Field A", date: "5 July 2025", note: "50kg homemade compost around coffee trees", category: "Inputs", color: "#7B1FA2" },
  { icon: "💸", type: "Expense", title: "Bought seedlings — UGX 60,000", date: "14 July 2025", note: "200 seedlings from Mbale nursery", category: "Expenses", color: "#E53935" },
];

const SUMMARY = [
  { label: "This Season Income", value: "UGX 1.2M", change: "+18%", icon: TrendingUp, color: "#00796B", bg: "#E0F2F1" },
  { label: "Total Expenses", value: "UGX 340K", change: "-5%", icon: DollarSign, color: "#E53935", bg: "#FFEBEE" },
  { label: "Crops Planted", value: "3 types", change: "Coffee, Beans, Maize", icon: Sprout, color: "#2E7D32", bg: "#F3F8F3" },
  { label: "Inputs Used", value: "8 records", change: "Mostly organic", icon: Package, color: "#7B1FA2", bg: "#F3EEF8" },
];

export default function FarmRecords() {
  const [activeTab, setActiveTab] = useState("All");
  const [showForm, setShowForm] = useState(false);

  const filtered = activeTab === "All" ? RECORDS : RECORDS.filter(r => r.category === activeTab);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1C2B1C]">Farm Records</h1>
            <p className="text-sm text-[#5A6B5A]">Your digital farming diary</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2E7D32] text-white text-sm font-bold rounded-xl hover:bg-[#1B5E20] transition-smooth shadow-sm"
          >
            <Plus className="w-4 h-4" /> Save Record
          </button>
        </div>

        {/* Quick add form */}
        {showForm && (
          <div className="bg-white rounded-2xl p-5 border border-[#EAF3EA] shadow-sm space-y-3">
            <h3 className="font-bold text-[#1C2B1C]">Save a New Record</h3>
            <select className="w-full px-4 py-3 rounded-xl border border-[#D8EAD8] text-sm text-[#1C2B1C] focus:outline-none focus:border-[#2E7D32] bg-white">
              <option>Planting</option><option>Harvesting</option><option>Inputs Applied</option>
              <option>Expense</option><option>Income</option><option>Farm Activity</option>
            </select>
            <textarea placeholder="What did you do on your farm today?" rows={3} className="w-full px-4 py-3 rounded-xl border border-[#D8EAD8] text-sm text-[#1C2B1C] placeholder:text-[#8A9B8A] focus:outline-none focus:border-[#2E7D32] resize-none" />
            <input type="date" className="w-full px-4 py-3 rounded-xl border border-[#D8EAD8] text-sm text-[#1C2B1C] focus:outline-none focus:border-[#2E7D32]" />
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-2 py-3 border border-[#D8EAD8] rounded-xl text-sm font-medium text-[#5A6B5A] hover:bg-[#F3F8F3] transition-smooth">
                <Camera className="w-4 h-4" /> Add Photo
              </button>
              <button onClick={() => setShowForm(false)} className="flex-1 py-3 bg-[#2E7D32] text-white text-sm font-bold rounded-xl hover:bg-[#1B5E20] transition-smooth">
                Save Record
              </button>
            </div>
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3">
          {SUMMARY.map(({ label, value, change, icon: Icon, color, bg }) => (
            <div key={label} className="bg-white rounded-2xl p-4 border border-[#EAF3EA] shadow-xs">
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
                  <Icon className="w-4 h-4" style={{ color }} />
                </div>
                <span className="text-[10px] font-semibold" style={{ color }}>{change}</span>
              </div>
              <p className="font-bold text-[#1C2B1C]">{value}</p>
              <p className="text-xs text-[#8A9B8A]">{label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-smooth flex-shrink-0 ${
                activeTab === t ? "bg-[#2E7D32] text-white" : "bg-white text-[#5A6B5A] border border-[#D8EAD8] hover:border-[#2E7D32]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Records list */}
        <div className="space-y-3">
          {filtered.map(({ icon, type, title, date, note, color }) => (
            <div key={title} className="bg-white rounded-2xl p-4 border border-[#EAF3EA] shadow-xs flex items-start gap-3 hover:shadow-sm transition-smooth cursor-pointer">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}15`, color }}>{type}</span>
                  <span className="text-[10px] text-[#8A9B8A] ml-auto">{date}</span>
                </div>
                <p className="font-semibold text-[#1C2B1C] text-sm">{title}</p>
                <p className="text-xs text-[#5A6B5A] mt-0.5">{note}</p>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#8A9B8A] flex-shrink-0 mt-1" />
            </div>
          ))}
        </div>

        {/* Reports CTA */}
        <div className="bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-2xl p-5 text-white flex items-center gap-4">
          <div className="w-12 h-12 bg-white/15 rounded-2xl flex items-center justify-center flex-shrink-0">
            <FileText className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold">Download Farm Report</p>
            <p className="text-white/75 text-sm">Share your record with banks, cooperatives, and buyers</p>
          </div>
          <ArrowUpRight className="w-5 h-5 text-white/70" />
        </div>
      </div>
    </AppLayout>
  );
}
