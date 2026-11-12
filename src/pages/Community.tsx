import { useState } from "react";
import { MessageCircle, Heart, Plus } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const FARMER_HARVEST = "https://images.unsplash.com/photo-1551357176-7d517a48c209?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=200&q=80";

const GROUPS = [
  { name: "Mbale Coffee Farmers", members: 243, emoji: "☕", active: true },
  { name: "Women Farmers Uganda", members: 1240, emoji: "👩‍🌾", active: false },
  { name: "Youth Agri Network", members: 567, emoji: "🌱", active: false },
  { name: "Vegetable Growers", members: 389, emoji: "🥦", active: false },
];

const POSTS = [
  { user: "Okello James", district: "Kampala", avatar: "O", time: "1h ago", text: "Has anyone tried neem oil spray for aphids on beans? It worked well for my crop last season. Mix 2 spoons of neem oil in 5 litres of water.", likes: 24, replies: 12, image: null, tag: "Pest Control" },
  { user: "Nakato Rose", district: "Mbale", avatar: "N", time: "3h ago", text: "Reminder: Mbale Coffee Farmers monthly meeting this Saturday at Wanale road market hall. We'll discuss selling prices and the new certification programme. All welcome! 🌟", likes: 41, replies: 5, image: null, tag: "Event" },
  { user: "Akello Grace", district: "Gulu", time: "1d ago", avatar: "A", text: "My soil test results came back — the extension officer said my nitrogen levels are low. Any natural ways to fix this without buying expensive fertilizer?", likes: 18, replies: 22, image: FARMER_HARVEST, tag: "Question" },
  { user: "Mugisha Peter", district: "Mbarara", time: "2d ago", avatar: "M", text: "Just finished my first full season record on Mavunify. Sold 3 bags more coffee than last year and I can prove my sustainability score to the cooperative. Keep recording your activities! 💪", likes: 89, replies: 17, image: null, tag: "Success Story" },
];

const TAG_COLORS: Record<string, string> = {
  "Pest Control": "#00796B",
  "Event": "#7B1FA2",
  "Question": "#1976D2",
  "Success Story": "#2E7D32",
};

export default function Community() {
  const [liked, setLiked] = useState<Set<number>>(new Set());
  const [showNew, setShowNew] = useState(false);

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#1C2B1C]">Community</h1>
            <p className="text-sm text-[#5A6B5A]">Learn and grow with fellow farmers</p>
          </div>
          <button
            onClick={() => setShowNew(!showNew)}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#2E7D32] text-white text-sm font-bold rounded-xl hover:bg-[#1B5E20] transition-smooth"
          >
            <Plus className="w-4 h-4" /> Post
          </button>
        </div>

        {/* Groups */}
        <div>
          <h2 className="font-bold text-[#1C2B1C] text-sm mb-2.5">Your Groups</h2>
          <div className="flex gap-2.5 overflow-x-auto pb-1">
            {GROUPS.map(({ name, members, emoji, active }) => (
              <button key={name} className={`flex-shrink-0 flex items-center gap-2 px-3.5 py-2.5 rounded-xl border transition-smooth ${active ? "bg-[#2E7D32] border-[#2E7D32] text-white" : "bg-white border-[#EAF3EA] text-[#5A6B5A] hover:border-[#2E7D32]"}`}>
                <span className="text-base">{emoji}</span>
                <div className="text-left">
                  <p className="text-xs font-bold whitespace-nowrap">{name}</p>
                  <p className={`text-[10px] ${active ? "text-white/70" : "text-[#8A9B8A]"}`}>{members} members</p>
                </div>
              </button>
            ))}
            <button className="flex-shrink-0 flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-dashed border-[#D8EAD8] text-[#5A6B5A] hover:border-[#2E7D32] transition-smooth">
              <Plus className="w-4 h-4" />
              <span className="text-xs font-semibold whitespace-nowrap">Find Group</span>
            </button>
          </div>
        </div>

        {/* New post form */}
        {showNew && (
          <div className="bg-white rounded-2xl p-4 border border-[#EAF3EA] shadow-sm space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-[#2E7D32]/15 flex items-center justify-center font-bold text-[#2E7D32]">N</div>
              <p className="text-sm font-semibold text-[#1C2B1C]">Share with the community</p>
            </div>
            <textarea placeholder="Ask a question, share a tip, or celebrate a win..." rows={3} className="w-full px-3 py-2.5 rounded-xl border border-[#D8EAD8] text-sm text-[#1C2B1C] placeholder:text-[#8A9B8A] focus:outline-none focus:border-[#2E7D32] resize-none" />
            <div className="flex items-center gap-2">
              <select className="flex-1 px-3 py-2 rounded-xl border border-[#D8EAD8] text-xs text-[#5A6B5A] focus:outline-none focus:border-[#2E7D32] bg-white">
                <option>Choose a group</option>
                {GROUPS.map(g => <option key={g.name}>{g.name}</option>)}
              </select>
              <button onClick={() => setShowNew(false)} className="px-5 py-2 bg-[#2E7D32] text-white text-sm font-bold rounded-xl hover:bg-[#1B5E20] transition-smooth">Post</button>
            </div>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-3">
          {POSTS.map(({ user, district, avatar, time, text, likes, replies, image, tag }, i) => (
            <div key={i} className="bg-white rounded-2xl border border-[#EAF3EA] shadow-xs overflow-hidden">
              <div className="p-4">
                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-9 h-9 rounded-full bg-[#2E7D32]/15 flex items-center justify-center font-bold text-sm text-[#2E7D32] flex-shrink-0">
                    {avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-[#1C2B1C]">{user}</p>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold" style={{ backgroundColor: `${TAG_COLORS[tag] || "#2E7D32"}15`, color: TAG_COLORS[tag] || "#2E7D32" }}>{tag}</span>
                    </div>
                    <p className="text-xs text-[#8A9B8A]">{district} · {time}</p>
                  </div>
                </div>
                <p className="text-sm text-[#1C2B1C] leading-relaxed">{text}</p>
              </div>
              {image && <img src={image} alt="" className="w-full h-48 object-cover" />}
              <div className="px-4 py-3 flex items-center gap-4 border-t border-[#EAF3EA]">
                <button
                  onClick={() => setLiked(prev => { const n = new Set(prev); n.has(i) ? n.delete(i) : n.add(i); return n; })}
                  className={`flex items-center gap-1.5 text-sm font-medium transition-smooth ${liked.has(i) ? "text-[#E53935]" : "text-[#5A6B5A] hover:text-[#E53935]"}`}
                >
                  <Heart className={`w-4 h-4 ${liked.has(i) ? "fill-[#E53935]" : ""}`} />
                  {likes + (liked.has(i) ? 1 : 0)}
                </button>
                <button className="flex items-center gap-1.5 text-sm font-medium text-[#5A6B5A] hover:text-[#2E7D32] transition-smooth">
                  <MessageCircle className="w-4 h-4" /> {replies} replies
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
