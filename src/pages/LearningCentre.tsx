import { useState } from "react";
import { Play, BookOpen, Mic, CheckCircle, Lock, ArrowRight, Star } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const CATEGORIES = ["All", "Soil Health", "Pest Control", "Water", "Harvesting", "Market", "Sustainability"];

const COURSES = [
  { title: "Composting for Coffee Farmers", category: "Soil Health", lessons: 6, duration: "45 min", progress: 65, type: "video", emoji: "🧪", level: "Beginner", rating: 4.8 },
  { title: "Water Management Basics", category: "Water", lessons: 5, duration: "30 min", progress: 30, type: "audio", emoji: "💧", level: "Beginner", rating: 4.6 },
  { title: "Organic Pest Control", category: "Pest Control", lessons: 8, duration: "60 min", progress: 0, type: "video", emoji: "🌿", level: "Intermediate", rating: 4.9 },
  { title: "Getting the Best Price for Your Coffee", category: "Market", lessons: 4, duration: "25 min", progress: 0, type: "article", emoji: "☕", level: "Beginner", rating: 4.7 },
  { title: "Cover Cropping for Healthy Soil", category: "Soil Health", lessons: 5, duration: "35 min", progress: 100, type: "video", emoji: "🌾", level: "Intermediate", rating: 4.8 },
  { title: "Rainwater Harvesting at Home", category: "Water", lessons: 3, duration: "20 min", progress: 0, type: "audio", emoji: "🌧️", level: "Beginner", rating: 4.5 },
];

const PATHS = [
  { title: "Coffee Farming Excellence", emoji: "☕", courses: 5, duration: "4 hrs", color: "#795548" },
  { title: "Sustainable Farming Journey", emoji: "🌱", courses: 8, duration: "6 hrs", color: "#2E7D32" },
  { title: "Finance Ready Farmer", emoji: "💰", courses: 4, duration: "3 hrs", color: "#F9A825" },
];

const ACHIEVEMENTS = [
  { emoji: "🎖️", label: "Soil Champion", done: true },
  { emoji: "💧", label: "Water Wise", done: true },
  { emoji: "🌿", label: "Organic Expert", done: false },
  { emoji: "📊", label: "Record Keeper", done: false },
];

export default function LearningCentre() {
  const [activeTab, setActiveTab] = useState("All");

  const filtered = activeTab === "All" ? COURSES : COURSES.filter(c => c.category === activeTab);

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-[#1C2B1C]">Learning Centre</h1>
          <p className="text-sm text-[#5A6B5A]">Short lessons in your language, at your pace</p>
        </div>

        {/* Progress banner */}
        <div className="bg-gradient-to-br from-[#7B1FA2] to-[#4A148C] rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white/70 text-sm">Your learning streak</p>
              <p className="text-2xl font-bold">🔥 12 days</p>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-sm">Courses completed</p>
              <p className="text-2xl font-bold">3 / 6</p>
            </div>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-[#F9A825] rounded-full" style={{ width: "50%" }} />
          </div>
          <p className="text-white/70 text-xs mt-1.5">3 more courses to earn your Basic Certificate</p>
        </div>

        {/* Achievements */}
        <div className="bg-white rounded-2xl p-4 border border-[#EAF3EA] shadow-xs">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold text-[#1C2B1C] text-sm">Your Achievements</h2>
            <span className="text-xs text-[#5A6B5A]">2 / 4 earned</span>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {ACHIEVEMENTS.map(({ emoji, label, done }) => (
              <div key={label} className={`flex flex-col items-center gap-1 p-3 rounded-xl border ${done ? "border-[#D8EAD8] bg-[#F3F8F3]" : "border-[#EAF3EA] bg-[#FAFAF7] opacity-50"}`}>
                <span className={`text-2xl ${done ? "" : "grayscale"}`}>{emoji}</span>
                <p className="text-[10px] text-center font-semibold text-[#5A6B5A] leading-tight">{label}</p>
                {done && <CheckCircle className="w-3.5 h-3.5 text-[#2E7D32]" />}
                {!done && <Lock className="w-3.5 h-3.5 text-[#8A9B8A]" />}
              </div>
            ))}
          </div>
        </div>

        {/* Learning paths */}
        <div>
          <h2 className="font-bold text-[#1C2B1C] mb-3">Learning Paths</h2>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {PATHS.map(({ title, emoji, courses, duration, color }) => (
              <div key={title} className="flex-shrink-0 w-48 bg-white rounded-2xl p-4 border border-[#EAF3EA] shadow-xs cursor-pointer hover:shadow-sm transition-smooth">
                <span className="text-3xl">{emoji}</span>
                <p className="font-bold text-sm text-[#1C2B1C] mt-2 mb-1 leading-tight">{title}</p>
                <p className="text-[10px] text-[#8A9B8A]">{courses} courses · {duration}</p>
                <div className="mt-3 flex items-center gap-1 text-xs font-semibold" style={{ color }}>
                  Start Path <ArrowRight className="w-3 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map(t => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-smooth flex-shrink-0 ${
                activeTab === t ? "bg-[#2E7D32] text-white" : "bg-white text-[#5A6B5A] border border-[#D8EAD8]"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Course cards */}
        <div className="space-y-3">
          {filtered.map(({ title, category, lessons, duration, progress, type, emoji, rating }) => (
            <div key={title} className="bg-white rounded-2xl border border-[#EAF3EA] shadow-xs overflow-hidden hover:shadow-sm transition-smooth cursor-pointer">
              <div className="flex gap-4 p-4">
                <div className="w-14 h-14 rounded-2xl bg-[#F3F8F3] flex items-center justify-center text-3xl flex-shrink-0">
                  {emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <p className="font-bold text-[#1C2B1C] text-sm leading-snug">{title}</p>
                    {progress === 100 && <CheckCircle className="w-5 h-5 text-[#2E7D32] flex-shrink-0" />}
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-semibold px-2 py-0.5 bg-[#F3F8F3] text-[#2E7D32] rounded-full border border-[#D8EAD8]">{category}</span>
                    <span className="text-[10px] text-[#8A9B8A]">{lessons} lessons · {duration}</span>
                    <div className="flex items-center gap-0.5 ml-auto">
                      <Star className="w-3 h-3 fill-[#F9A825] text-[#F9A825]" />
                      <span className="text-[10px] font-bold text-[#1C2B1C]">{rating}</span>
                    </div>
                  </div>
                  {progress > 0 && progress < 100 && (
                    <div>
                      <div className="flex justify-between text-[10px] text-[#8A9B8A] mb-1">
                        <span>In progress</span><span className="font-bold text-[#2E7D32]">{progress}%</span>
                      </div>
                      <div className="h-1.5 bg-[#EAF3EA] rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-[#2E7D32] to-[#66BB6A] rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="px-4 pb-4">
                <button className={`w-full py-2.5 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-smooth ${
                  progress === 100
                    ? "bg-[#F3F8F3] text-[#2E7D32] border border-[#D8EAD8]"
                    : progress > 0
                    ? "bg-[#2E7D32] text-white hover:bg-[#1B5E20]"
                    : "bg-[#2E7D32] text-white hover:bg-[#1B5E20]"
                }`}>
                  {type === "video" ? <Play className="w-4 h-4" /> : type === "audio" ? <Mic className="w-4 h-4" /> : <BookOpen className="w-4 h-4" />}
                  {progress === 100 ? "Review Course" : progress > 0 ? "Continue" : "Start Learning"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
