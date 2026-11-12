import { useState } from "react";
import { Plus, Search, ArrowRight, MapPin } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const TABS = ["Buy", "Sell", "My Listings"];

const BUY_ITEMS = [
  { emoji: "🌱", name: "Arabica Coffee Seedlings", seller: "Mbale Nursery", price: "UGX 300/seedling", location: "Mbale", category: "Seeds", tag: "Popular" },
  { emoji: "🧪", name: "Neem Oil (500ml)", seller: "Agro Supplies Ltd", price: "UGX 18,000", location: "Kampala", category: "Inputs", tag: "Organic" },
  { emoji: "🌿", name: "Organic Compost (50kg)", seller: "Green Earth Farm", price: "UGX 25,000/bag", location: "Jinja", category: "Fertilizer", tag: "Organic" },
  { emoji: "🔧", name: "Hand Sprayer (15L)", seller: "Farm Tools Uganda", price: "UGX 85,000", location: "Kampala", category: "Equipment", tag: null },
  { emoji: "🪣", name: "Drip Irrigation Kit", seller: "Aqua Systems", price: "UGX 240,000", location: "Kampala", category: "Equipment", tag: "Sale" },
  { emoji: "🌾", name: "Bean Seeds (NABE 16)", seller: "NARO Seed Centre", price: "UGX 6,000/kg", location: "Tororo", category: "Seeds", tag: null },
];

const SELL_CATS = [
  { emoji: "☕", label: "Coffee Beans", color: "#795548" },
  { emoji: "🫘", label: "Dry Beans", color: "#8D6E63" },
  { emoji: "🥦", label: "Vegetables", color: "#2E7D32" },
  { emoji: "🌽", label: "Maize", color: "#F9A825" },
  { emoji: "🚛", label: "Transport", color: "#455A64" },
  { emoji: "🏭", label: "Storage", color: "#1976D2" },
];

const MY_LISTINGS = [
  { emoji: "🫘", name: "Dry Beans — 80kg", price: "UGX 4,500/kg", status: "active", inquiries: 3 },
  { emoji: "☕", name: "Green Coffee — 200kg", price: "UGX 9,000/kg", status: "sold", inquiries: 7 },
];

export default function Marketplace() {
  const [tab, setTab] = useState("Buy");
  const [showSellForm, setShowSellForm] = useState(false);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1C2B1C]">Marketplace</h1>
            <p className="text-sm text-[#5A6B5A]">Buy inputs, sell your produce</p>
          </div>
          {tab === "Sell" && (
            <button onClick={() => setShowSellForm(!showSellForm)} className="flex items-center gap-2 px-4 py-2.5 bg-[#2E7D32] text-white text-sm font-bold rounded-xl hover:bg-[#1B5E20] transition-smooth">
              <Plus className="w-4 h-4" /> List Item
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex bg-[#F3F8F3] rounded-xl p-1">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-smooth ${tab === t ? "bg-white text-[#2E7D32] shadow-xs" : "text-[#5A6B5A]"}`}>{t}</button>
          ))}
        </div>

        {tab === "Buy" && (
          <>
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8A9B8A]" />
              <input placeholder="Search seeds, inputs, equipment..." className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#D8EAD8] bg-white text-sm text-[#1C2B1C] placeholder:text-[#8A9B8A] focus:outline-none focus:border-[#2E7D32]" />
            </div>

            {/* Category pills */}
            <div className="flex gap-2 overflow-x-auto pb-1">
              {["All", "Seeds", "Inputs", "Fertilizer", "Equipment", "Tools"].map(c => (
                <button key={c} className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap bg-white border border-[#D8EAD8] text-[#5A6B5A] hover:border-[#2E7D32] transition-smooth flex-shrink-0">
                  {c}
                </button>
              ))}
            </div>

            {/* Items grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {BUY_ITEMS.map(({ emoji, name, seller, price, location, tag }) => (
                <div key={name} className="bg-white rounded-2xl border border-[#EAF3EA] shadow-xs overflow-hidden hover:shadow-sm transition-smooth cursor-pointer">
                  <div className="h-24 bg-[#F3F8F3] flex items-center justify-center text-4xl relative">
                    {emoji}
                    {tag && (
                      <span className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold ${tag === "Organic" ? "bg-[#2E7D32] text-white" : tag === "Sale" ? "bg-[#E53935] text-white" : "bg-[#F9A825] text-[#1C2B1C]"}`}>
                        {tag}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="font-bold text-sm text-[#1C2B1C] mb-0.5">{name}</p>
                    <p className="text-xs text-[#8A9B8A] mb-2">{seller}</p>
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-[#2E7D32] text-sm">{price}</p>
                      <div className="flex items-center gap-0.5 text-[10px] text-[#8A9B8A]">
                        <MapPin className="w-3 h-3" />{location}
                      </div>
                    </div>
                    <button className="mt-3 w-full py-2 bg-[#2E7D32] text-white text-xs font-bold rounded-xl hover:bg-[#1B5E20] transition-smooth">
                      View & Buy
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {tab === "Sell" && (
          <>
            {showSellForm && (
              <div className="bg-white rounded-2xl p-5 border border-[#EAF3EA] shadow-sm space-y-3">
                <h3 className="font-bold text-[#1C2B1C]">List Your Produce</h3>
                <select className="w-full px-4 py-3 rounded-xl border border-[#D8EAD8] text-sm text-[#1C2B1C] focus:outline-none focus:border-[#2E7D32] bg-white">
                  <option>What are you selling?</option>
                  <option>Coffee</option><option>Beans</option><option>Maize</option><option>Vegetables</option><option>Other</option>
                </select>
                <div className="grid grid-cols-2 gap-3">
                  <input placeholder="Quantity (e.g. 80 kg)" className="px-4 py-3 rounded-xl border border-[#D8EAD8] text-sm focus:outline-none focus:border-[#2E7D32]" />
                  <input placeholder="Your price per kg" className="px-4 py-3 rounded-xl border border-[#D8EAD8] text-sm focus:outline-none focus:border-[#2E7D32]" />
                </div>
                <textarea placeholder="Describe your product — quality, organic, delivery available?" rows={2} className="w-full px-4 py-3 rounded-xl border border-[#D8EAD8] text-sm placeholder:text-[#8A9B8A] focus:outline-none focus:border-[#2E7D32] resize-none" />
                <button onClick={() => setShowSellForm(false)} className="w-full py-3 bg-[#2E7D32] text-white text-sm font-bold rounded-xl hover:bg-[#1B5E20] transition-smooth">
                  List on Marketplace
                </button>
              </div>
            )}

            <div>
              <h2 className="font-bold text-[#1C2B1C] mb-3">What can you sell?</h2>
              <div className="grid grid-cols-3 gap-3">
                {SELL_CATS.map(({ emoji, label, color }) => (
                  <div key={label} className="bg-white rounded-2xl p-4 border border-[#EAF3EA] shadow-xs text-center cursor-pointer hover:shadow-sm transition-smooth">
                    <span className="text-3xl">{emoji}</span>
                    <p className="text-xs font-bold mt-2" style={{ color }}>{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-[#F3F8F3] rounded-2xl p-5 border border-[#D8EAD8]">
              <p className="font-bold text-[#1C2B1C] mb-1">💡 Sell at a better price</p>
              <p className="text-sm text-[#5A6B5A]">Farmers with a verified sustainability score and farm records get 10–20% better prices from buyers. Build your record today.</p>
            </div>
          </>
        )}

        {tab === "My Listings" && (
          <div className="space-y-3">
            {MY_LISTINGS.map(({ emoji, name, price, status, inquiries }) => (
              <div key={name} className="bg-white rounded-2xl p-4 border border-[#EAF3EA] shadow-xs flex items-center gap-3">
                <span className="text-3xl">{emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="font-bold text-sm text-[#1C2B1C]">{name}</p>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${status === "active" ? "bg-[#2E7D32] text-white" : "bg-[#8A9B8A] text-white"}`}>
                      {status}
                    </span>
                  </div>
                  <p className="text-xs text-[#5A6B5A]">{price} · {inquiries} buyer inquiries</p>
                </div>
                <ArrowRight className="w-4 h-4 text-[#8A9B8A]" />
              </div>
            ))}
            <button onClick={() => { setTab("Sell"); setShowSellForm(true); }} className="w-full py-3 border-2 border-dashed border-[#D8EAD8] rounded-2xl text-sm font-semibold text-[#5A6B5A] hover:border-[#2E7D32] hover:text-[#2E7D32] transition-smooth flex items-center justify-center gap-2">
              <Plus className="w-4 h-4" /> Add New Listing
            </button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
