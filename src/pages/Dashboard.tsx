import { useNavigate } from "react-router-dom";
import {
  CloudSun, Droplets, Thermometer, MessageSquare, ClipboardList,
  Camera, ShoppingBag, GraduationCap, Headphones, Users, Bell,
  ChevronRight, CheckCircle, Clock, Sprout, TrendingUp, Leaf,
  ArrowRight, Star,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";

const WEATHER = { temp: 24, condition: "Partly Cloudy", rain: "40%", humidity: "72%", icon: "⛅" };

const TODAY_TASKS = [
  { done: true, task: "Apply compost to coffee seedlings", time: "Morning" },
  { done: false, task: "Check soil moisture in Field B", time: "Afternoon" },
  { done: false, task: "Prune lower coffee branches", time: "Before sunset" },
];

const RECENT_ACTIVITIES = [
  { icon: "🌱", text: "Planted 200 coffee seedlings", time: "2 days ago", color: "#2E7D32" },
  { icon: "💧", text: "Applied irrigation — 3 hours", time: "4 days ago", color: "#1976D2" },
  { icon: "🧪", text: "Soil test completed — Field A", time: "1 week ago", color: "#F9A825" },
];

const LEARNING = [
  { title: "Composting for Coffee Farmers", progress: 65, category: "Soil Health" },
  { title: "Water Management Basics", progress: 30, category: "Sustainability" },
];

const COMMUNITY = [
  { user: "Okello J.", text: "Has anyone tried neem oil for aphids on beans?", replies: 12, time: "1h ago" },
  { user: "Nakato R.", text: "Mbale coffee farmers — monthly meeting this Saturday!", replies: 5, time: "3h ago" },
];

const QUICK_ACTIONS = [
  { icon: MessageSquare, label: "Ask Mavunify", path: "/ask", color: "#2E7D32", bg: "#F3F8F3" },
  { icon: ClipboardList, label: "Record Activity", path: "/records", color: "#1976D2", bg: "#EEF4FD" },
  { icon: Camera, label: "Farm Photo", path: "/records", color: "#7B1FA2", bg: "#F3EEF8" },
  { icon: CloudSun, label: "View Weather", path: "/weather", color: "#F9A825", bg: "#FFF8E1" },
  { icon: ShoppingBag, label: "Marketplace", path: "/marketplace", color: "#00796B", bg: "#E0F2F1" },
  { icon: GraduationCap, label: "Learning Centre", path: "/learn", color: "#E64A19", bg: "#FBE9E7" },
  { icon: Headphones, label: "Talk to Expert", path: "/experts", color: "#455A64", bg: "#ECEFF1" },
  { icon: Users, label: "Community", path: "/community", color: "#0288D1", bg: "#E1F5FE" },
];

const SUSTAINABILITY_LEVEL = { level: "Improving Farmer", emoji: "🌿", next: "Sustainable Farmer", progress: 58 };

const SUSTAINABILITY_PILLARS = [
  { label: "Soil Health", pct: 72, color: "#2E7D32" },
  { label: "Water", pct: 45, color: "#1976D2" },
  { label: "Organic Inputs", pct: 60, color: "#66BB6A" },
  { label: "Tree Planting", pct: 30, color: "#00796B" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-6">

        {/* ── GREETING + WEATHER ── */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Greeting card */}
          <div className="flex-1 bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-2xl p-6 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
            <div className="relative">
              <p className="text-white/70 text-sm font-medium mb-1">{greeting}, Nakato 👋</p>
              <h1 className="text-2xl font-bold mb-1">Your farm is looking good</h1>
              <p className="text-white/80 text-sm">3 tasks today · Mbale, Eastern Uganda</p>
              <div className="mt-4 flex items-center gap-2">
                <div className="px-3 py-1 bg-white/15 rounded-full text-xs font-semibold text-white flex items-center gap-1.5">
                  {SUSTAINABILITY_LEVEL.emoji} {SUSTAINABILITY_LEVEL.level}
                </div>
              </div>
            </div>
          </div>

          {/* Weather card */}
          <div className="sm:w-56 bg-white rounded-2xl p-5 border border-[#EAF3EA] shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-[#8A9B8A] uppercase tracking-wide">Today's Weather</span>
              <button onClick={() => navigate("/weather")} className="text-[#2E7D32]">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="text-4xl mb-2">{WEATHER.icon}</div>
            <p className="text-2xl font-bold text-[#1C2B1C]">{WEATHER.temp}°C</p>
            <p className="text-sm text-[#5A6B5A] mb-3">{WEATHER.condition}</p>
            <div className="space-y-1.5">
              <div className="flex items-center gap-1.5 text-xs text-[#5A6B5A]">
                <Droplets className="w-3.5 h-3.5 text-[#1976D2]" /> Rain chance: {WEATHER.rain}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-[#5A6B5A]">
                <Thermometer className="w-3.5 h-3.5 text-[#F9A825]" /> Humidity: {WEATHER.humidity}
              </div>
            </div>
          </div>
        </div>

        {/* ── QUICK ACTIONS ── */}
        <div>
          <h2 className="text-lg font-bold text-[#1C2B1C] mb-3">Quick Actions</h2>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
            {QUICK_ACTIONS.map(({ icon: Icon, label, path, color, bg }) => (
              <button
                key={label}
                onClick={() => navigate(path)}
                className="flex flex-col items-center gap-1.5 p-3 rounded-2xl border border-[#EAF3EA] bg-white hover:shadow-sm transition-smooth"
              >
                <div className="w-11 h-11 rounded-xl flex items-center justify-center" style={{ backgroundColor: bg }}>
                  <Icon className="w-5 h-5" style={{ color }} />
                </div>
                <span className="text-[10px] font-semibold text-[#5A6B5A] text-center leading-tight">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ── TODAY'S TASKS + SUSTAINABILITY ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Today's recommended activities */}
          <div className="bg-white rounded-2xl p-5 border border-[#EAF3EA] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#1C2B1C]">Today's Activities</h2>
              <span className="text-xs text-[#8A9B8A]">
                {TODAY_TASKS.filter(t => t.done).length}/{TODAY_TASKS.length} done
              </span>
            </div>
            <div className="space-y-3">
              {TODAY_TASKS.map(({ done, task, time }) => (
                <div key={task} className={`flex items-start gap-3 p-3 rounded-xl ${done ? "bg-[#F3F8F3]" : "bg-[#FAFAF7]"}`}>
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 ${done ? "bg-[#2E7D32] border-[#2E7D32]" : "border-[#D8EAD8]"}`}>
                    {done && <CheckCircle className="w-3 h-3 text-white" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-medium leading-snug ${done ? "line-through text-[#8A9B8A]" : "text-[#1C2B1C]"}`}>{task}</p>
                    <p className="text-xs text-[#8A9B8A] mt-0.5 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/ask")}
              className="mt-4 w-full py-2.5 text-sm font-semibold text-[#2E7D32] border border-[#D8EAD8] rounded-xl hover:bg-[#F3F8F3] transition-smooth"
            >
              Ask Mavunify for more advice
            </button>
          </div>

          {/* Sustainability progress */}
          <div className="bg-white rounded-2xl p-5 border border-[#EAF3EA] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#1C2B1C]">Sustainability Journey</h2>
              <button onClick={() => navigate("/sustainability")} className="text-[#2E7D32]">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center gap-3 mb-4 p-3 bg-[#F3F8F3] rounded-xl">
              <span className="text-2xl">{SUSTAINABILITY_LEVEL.emoji}</span>
              <div>
                <p className="text-xs text-[#5A6B5A]">Current level</p>
                <p className="font-bold text-[#1C2B1C] text-sm">{SUSTAINABILITY_LEVEL.level}</p>
              </div>
              <div className="ml-auto text-right">
                <p className="text-xs text-[#5A6B5A]">Next</p>
                <p className="text-xs font-semibold text-[#2E7D32]">{SUSTAINABILITY_LEVEL.next}</p>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between text-xs text-[#5A6B5A] mb-1.5">
                <span>Overall progress</span><span className="font-bold text-[#2E7D32]">{SUSTAINABILITY_LEVEL.progress}%</span>
              </div>
              <div className="h-2.5 bg-[#EAF3EA] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] rounded-full" style={{ width: `${SUSTAINABILITY_LEVEL.progress}%` }} />
              </div>
            </div>
            <div className="space-y-2.5">
              {SUSTAINABILITY_PILLARS.map(({ label, pct, color }) => (
                <div key={label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-[#5A6B5A]">{label}</span>
                    <span className="font-semibold" style={{ color }}>{pct}%</span>
                  </div>
                  <div className="h-1.5 bg-[#EAF3EA] rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── RECENT ACTIVITIES + FARM HEALTH ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Recent activities */}
          <div className="bg-white rounded-2xl p-5 border border-[#EAF3EA] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#1C2B1C]">Recent Farm Activities</h2>
              <button onClick={() => navigate("/records")} className="text-xs font-semibold text-[#2E7D32]">View all</button>
            </div>
            <div className="space-y-3">
              {RECENT_ACTIVITIES.map(({ icon, text, time, color }) => (
                <div key={text} className="flex items-center gap-3 p-3 bg-[#FAFAF7] rounded-xl">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: `${color}15` }}>
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1C2B1C] leading-snug">{text}</p>
                    <p className="text-xs text-[#8A9B8A] mt-0.5">{time}</p>
                  </div>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/records")}
              className="mt-4 w-full py-2.5 text-sm font-semibold text-white bg-[#2E7D32] rounded-xl hover:bg-[#1B5E20] transition-smooth flex items-center justify-center gap-2"
            >
              <ClipboardList className="w-4 h-4" /> Save a New Record
            </button>
          </div>

          {/* Farm Health */}
          <div className="bg-white rounded-2xl p-5 border border-[#EAF3EA] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#1C2B1C]">Farm Health</h2>
              <span className="px-2.5 py-1 bg-[#F3F8F3] text-[#2E7D32] text-xs font-bold rounded-full border border-[#D8EAD8]">Good</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { icon: Sprout, label: "Crops", value: "Coffee, Beans", sub: "3 plots", color: "#2E7D32" },
                { icon: Leaf, label: "Soil Health", value: "72/100", sub: "Improving", color: "#66BB6A" },
                { icon: TrendingUp, label: "This Season", value: "+18%", sub: "vs last season", color: "#F9A825" },
                { icon: Star, label: "Mavunify Score", value: "4.2 / 5", sub: "Improving Farmer", color: "#7B1FA2" },
              ].map(({ icon: Icon, label, value, sub, color }) => (
                <div key={label} className="p-3 bg-[#FAFAF7] rounded-xl">
                  <Icon className="w-4 h-4 mb-2" style={{ color }} />
                  <p className="text-xs text-[#5A6B5A]">{label}</p>
                  <p className="font-bold text-[#1C2B1C] text-sm">{value}</p>
                  <p className="text-[10px] text-[#8A9B8A]">{sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── LEARNING + COMMUNITY ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Learning progress */}
          <div className="bg-white rounded-2xl p-5 border border-[#EAF3EA] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#1C2B1C]">Learning Progress</h2>
              <button onClick={() => navigate("/learn")} className="text-xs font-semibold text-[#2E7D32]">See all</button>
            </div>
            <div className="space-y-3">
              {LEARNING.map(({ title, progress, category }) => (
                <div key={title} className="p-3 bg-[#FAFAF7] rounded-xl">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-sm font-medium text-[#1C2B1C] flex-1 mr-3">{title}</p>
                    <span className="text-xs font-bold text-[#2E7D32]">{progress}%</span>
                  </div>
                  <div className="h-1.5 bg-[#EAF3EA] rounded-full overflow-hidden mb-1">
                    <div className="h-full bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] rounded-full" style={{ width: `${progress}%` }} />
                  </div>
                  <p className="text-[10px] text-[#8A9B8A]">{category}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/learn")}
              className="mt-3 w-full py-2.5 text-sm font-semibold text-[#2E7D32] border border-[#D8EAD8] rounded-xl hover:bg-[#F3F8F3] transition-smooth flex items-center justify-center gap-2"
            >
              Continue Learning <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Community */}
          <div className="bg-white rounded-2xl p-5 border border-[#EAF3EA] shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-[#1C2B1C]">Community Updates</h2>
              <button onClick={() => navigate("/community")} className="text-xs font-semibold text-[#2E7D32]">See all</button>
            </div>
            <div className="space-y-3">
              {COMMUNITY.map(({ user, text, replies, time }) => (
                <div key={text} className="p-3 bg-[#FAFAF7] rounded-xl">
                  <div className="flex items-center gap-2 mb-1.5">
                    <div className="w-7 h-7 rounded-full bg-[#2E7D32]/15 flex items-center justify-center text-xs font-bold text-[#2E7D32]">
                      {user[0]}
                    </div>
                    <p className="text-xs font-semibold text-[#1C2B1C]">{user}</p>
                    <p className="text-[10px] text-[#8A9B8A] ml-auto">{time}</p>
                  </div>
                  <p className="text-sm text-[#5A6B5A] leading-snug">{text}</p>
                  <p className="text-[10px] text-[#8A9B8A] mt-1.5">{replies} replies</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => navigate("/community")}
              className="mt-3 w-full py-2.5 text-sm font-semibold text-[#2E7D32] border border-[#D8EAD8] rounded-xl hover:bg-[#F3F8F3] transition-smooth"
            >
              Join the Conversation
            </button>
          </div>
        </div>

        {/* ── NOTIFICATIONS ── */}
        <div className="bg-white rounded-2xl p-5 border border-[#EAF3EA] shadow-xs">
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4 text-[#2E7D32]" />
            <h2 className="font-bold text-[#1C2B1C]">Notifications</h2>
            <span className="ml-auto px-2 py-0.5 bg-[#E53935] text-white text-[10px] font-bold rounded-full">3</span>
          </div>
          <div className="space-y-2">
            {[
              { icon: "🌧️", text: "Rain expected tomorrow — good time to apply compost", type: "Weather", time: "1h ago", color: "#1976D2" },
              { icon: "📚", text: "New lesson available: Cover Cropping for Coffee Farmers", type: "Learning", time: "3h ago", color: "#7B1FA2" },
              { icon: "🛒", text: "Your beans listing received 2 new buyer inquiries", type: "Marketplace", time: "1d ago", color: "#00796B" },
            ].map(({ icon, text, type, time, color }) => (
              <div key={text} className="flex items-start gap-3 p-3 rounded-xl hover:bg-[#FAFAF7] transition-smooth cursor-pointer">
                <span className="text-xl flex-shrink-0">{icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[#1C2B1C] leading-snug">{text}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}15`, color }}>{type}</span>
                    <span className="text-[10px] text-[#8A9B8A]">{time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
