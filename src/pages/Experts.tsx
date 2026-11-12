import { Phone, MessageSquare, Video, Star, MapPin, Calendar } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const EXPERT_1 = "https://images.unsplash.com/photo-1597816760638-406d7271105c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&q=80";
const EXPERT_2 = "https://images.unsplash.com/photo-1560885673-9cd7b3718c7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&q=80";

const CATEGORIES = ["All", "Agronomist", "Veterinarian", "Extension Officer", "Business Advisor"];

const EXPERTS = [
  { name: "Dr. Ssekandi John", role: "Agronomist", specialty: "Coffee & Soil Health", district: "Mbale", rating: 4.9, reviews: 128, available: true, img: EXPERT_1, price: "UGX 30,000/visit" },
  { name: "Namukasa Sarah", role: "Extension Officer", specialty: "Vegetable & Organic Farming", district: "Jinja", rating: 4.7, reviews: 89, available: true, img: EXPERT_2, price: "Free via NAADS" },
  { name: "Dr. Ochieng Paul", role: "Veterinarian", specialty: "Cattle & Poultry", district: "Gulu", rating: 4.8, reviews: 67, available: false, img: EXPERT_1, price: "UGX 50,000/visit" },
  { name: "Birungi Grace", role: "Business Advisor", specialty: "Farm Finance & Markets", district: "Kampala", rating: 4.6, reviews: 43, available: true, img: EXPERT_2, price: "UGX 25,000/session" },
];

const MY_BOOKINGS = [
  { expert: "Dr. Ssekandi John", date: "Saturday, 26 July", time: "10:00 AM", type: "Farm Visit", status: "confirmed" },
];

export default function Experts() {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-[#1C2B1C]">Expert Support</h1>
          <p className="text-sm text-[#5A6B5A]">Book a certified expert for your farm</p>
        </div>

        {/* Upcoming booking */}
        {MY_BOOKINGS.map(({ expert, date, time, status }) => (
          <div key={expert} className="bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-2xl p-5 text-white">
            <p className="text-white/70 text-xs font-semibold uppercase tracking-wide mb-3">Upcoming Booking</p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center font-bold text-lg">D</div>
              <div>
                <p className="font-bold">{expert}</p>
                <p className="text-white/80 text-sm">{date} at {time}</p>
              </div>
              <div className="ml-auto">
                <span className="px-2.5 py-1 bg-[#F9A825] text-[#1C2B1C] text-xs font-bold rounded-full">{status}</span>
              </div>
            </div>
            <div className="mt-3 flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white/15 hover:bg-white/25 rounded-xl text-sm font-semibold transition-smooth">
                <MessageSquare className="w-4 h-4" /> Message
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white/15 hover:bg-white/25 rounded-xl text-sm font-semibold transition-smooth">
                <Phone className="w-4 h-4" /> Call
              </button>
            </div>
          </div>
        ))}

        {/* Contact options */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Phone, label: "Phone Call", color: "#2E7D32", bg: "#F3F8F3" },
            { icon: MessageSquare, label: "Chat", color: "#1976D2", bg: "#EEF4FD" },
            { icon: Video, label: "Video Call", color: "#7B1FA2", bg: "#F3EEF8" },
          ].map(({ icon: Icon, label, color, bg }) => (
            <button key={label} className="bg-white rounded-2xl p-4 border border-[#EAF3EA] shadow-xs flex flex-col items-center gap-2 hover:shadow-sm transition-smooth">
              <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ backgroundColor: bg }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <p className="text-xs font-semibold text-[#5A6B5A]">{label}</p>
            </button>
          ))}
        </div>

        {/* Category filter */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map(c => (
            <button key={c} className="px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap bg-white border border-[#D8EAD8] text-[#5A6B5A] hover:border-[#2E7D32] transition-smooth flex-shrink-0">
              {c}
            </button>
          ))}
        </div>

        {/* Experts list */}
        <div className="space-y-3">
          {EXPERTS.map(({ name, role, specialty, district, rating, reviews, available, img, price }) => (
            <div key={name} className="bg-white rounded-2xl p-4 border border-[#EAF3EA] shadow-xs hover:shadow-sm transition-smooth">
              <div className="flex gap-3">
                <img src={img} alt={name} className="w-14 h-14 rounded-2xl object-cover border-2 border-[#D8EAD8] flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-[#1C2B1C] text-sm">{name}</p>
                      <p className="text-xs font-semibold text-[#2E7D32]">{role}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex-shrink-0 ${available ? "bg-[#F3F8F3] text-[#2E7D32] border border-[#D8EAD8]" : "bg-[#ECEFF1] text-[#8A9B8A]"}`}>
                      {available ? "Available" : "Busy"}
                    </span>
                  </div>
                  <p className="text-xs text-[#5A6B5A] mt-0.5">{specialty}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <div className="flex items-center gap-0.5 text-xs">
                      <Star className="w-3 h-3 fill-[#F9A825] text-[#F9A825]" />
                      <span className="font-bold text-[#1C2B1C]">{rating}</span>
                      <span className="text-[#8A9B8A]">({reviews})</span>
                    </div>
                    <div className="flex items-center gap-0.5 text-xs text-[#8A9B8A]">
                      <MapPin className="w-3 h-3" />{district}
                    </div>
                    <span className="text-xs font-semibold text-[#2E7D32] ml-auto">{price}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 border border-[#D8EAD8] rounded-xl text-xs font-semibold text-[#5A6B5A] hover:bg-[#F3F8F3] transition-smooth">
                  <MessageSquare className="w-3.5 h-3.5" /> Chat
                </button>
                <button disabled={!available} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-[#2E7D32] text-white rounded-xl text-xs font-bold hover:bg-[#1B5E20] disabled:opacity-40 transition-smooth">
                  <Calendar className="w-3.5 h-3.5" /> Book Visit
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
