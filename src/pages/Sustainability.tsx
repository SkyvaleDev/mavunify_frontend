import { ChevronRight, Check, Lock, Leaf, Droplets, Sprout, Trees, Trash2, Flower2, Wind } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const LEVELS = [
  { emoji: "🌱", label: "Beginner", desc: "Starting your sustainability journey", done: true },
  { emoji: "🌿", label: "Improving Farmer", desc: "Making steady progress with good practices", done: true, current: true },
  { emoji: "🌳", label: "Sustainable Farmer", desc: "Consistently farming in harmony with nature", done: false },
  { emoji: "♻️", label: "Regenerative Champion", desc: "Leading the way — inspiring your whole community", done: false },
];

const PILLARS = [
  { icon: Leaf, label: "Soil Health", pct: 72, color: "#2E7D32", bg: "#F3F8F3", tip: "Add compost to all your fields", tasks: ["Apply compost monthly ✓", "Reduce chemical inputs ✓", "Cover crop planting ⟳"] },
  { icon: Droplets, label: "Water Management", pct: 45, color: "#1976D2", bg: "#EEF4FD", tip: "Install a simple rainwater collection system", tasks: ["Mulch to retain moisture ✓", "Rainwater harvesting ⟳", "Drip irrigation —"] },
  { icon: Sprout, label: "Organic Practices", pct: 60, color: "#66BB6A", bg: "#F0FBF0", tip: "Switch more inputs to organic", tasks: ["Neem oil for pests ✓", "Organic fertilizer ✓", "Avoid synthetic chemicals ⟳"] },
  { icon: Trees, label: "Tree Planting", pct: 30, color: "#00796B", bg: "#E0F2F1", tip: "Plant shade trees around your coffee", tasks: ["Plant 10 trees this season ⟳", "Agroforestry plan —", "Record tree count —"] },
  { icon: Trash2, label: "Waste Management", pct: 55, color: "#455A64", bg: "#ECEFF1", tip: "Start composting all farm waste", tasks: ["Compost food waste ✓", "Recycle packaging ⟳", "No burning of waste —"] },
  { icon: Flower2, label: "Biodiversity", pct: 40, color: "#7B1FA2", bg: "#F3EEF8", tip: "Plant flowers to attract pollinators", tasks: ["Insect-friendly plants ⟳", "Bee habitat ⟳", "Avoid pesticide overuse ✓"] },
  { icon: Wind, label: "Climate-Friendly Practices", pct: 35, color: "#E64A19", bg: "#FBE9E7", tip: "Track and reduce your farm's emissions", tasks: ["Reduce burning ✓", "Carbon sequestration ⟳", "Efficient cooking fuel —"] },
];

export default function Sustainability() {
  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-[#1C2B1C]">Sustainability Journey</h1>
          <p className="text-sm text-[#5A6B5A]">Your path to becoming a Regenerative Champion</p>
        </div>

        {/* Level progression */}
        <div className="bg-white rounded-2xl p-5 border border-[#EAF3EA] shadow-xs">
          <h2 className="font-bold text-[#1C2B1C] mb-4">Your Journey</h2>
          <div className="space-y-3">
            {LEVELS.map(({ emoji, label, desc, done, current }, i) => (
              <div key={label} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-smooth ${
                current ? "border-[#2E7D32] bg-[#F3F8F3]" : done ? "border-[#D8EAD8] bg-[#FAFAF7]" : "border-[#EAF3EA] bg-white opacity-60"
              }`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0 ${done ? "" : "grayscale"}`}>
                  {emoji}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`font-bold text-sm ${current ? "text-[#2E7D32]" : "text-[#1C2B1C]"}`}>{label}</p>
                    {current && <span className="px-2 py-0.5 bg-[#2E7D32] text-white text-[10px] font-bold rounded-full">YOU ARE HERE</span>}
                    {done && !current && <Check className="w-4 h-4 text-[#66BB6A]" />}
                    {!done && <Lock className="w-3.5 h-3.5 text-[#8A9B8A]" />}
                  </div>
                  <p className="text-xs text-[#5A6B5A] mt-0.5">{desc}</p>
                </div>
                {i < LEVELS.length - 1 && done && <ChevronRight className="w-4 h-4 text-[#D8EAD8]" />}
              </div>
            ))}
          </div>
        </div>

        {/* Overall progress */}
        <div className="bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-3">
            <div>
              <p className="text-white/70 text-sm">Overall Sustainability Score</p>
              <p className="text-4xl font-bold">48 <span className="text-xl font-normal text-white/70">/ 100</span></p>
            </div>
            <div className="text-right">
              <p className="text-white/70 text-xs">Next level at</p>
              <p className="text-2xl font-bold">65</p>
            </div>
          </div>
          <div className="h-3 bg-white/20 rounded-full overflow-hidden">
            <div className="h-full bg-[#F9A825] rounded-full" style={{ width: "48%" }} />
          </div>
          <p className="text-white/70 text-xs mt-2">17 more points to reach Sustainable Farmer 🌳</p>
        </div>

        {/* Pillars */}
        <div>
          <h2 className="font-bold text-[#1C2B1C] mb-3">What We Track</h2>
          <div className="space-y-3">
            {PILLARS.map(({ icon: Icon, label, pct, color, bg, tip, tasks }) => (
              <details key={label} className="bg-white rounded-2xl border border-[#EAF3EA] shadow-xs overflow-hidden group">
                <summary className="flex items-center gap-3 p-4 cursor-pointer list-none">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bg }}>
                    <Icon className="w-5 h-5" style={{ color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <p className="font-semibold text-sm text-[#1C2B1C]">{label}</p>
                      <span className="text-sm font-bold" style={{ color }}>{pct}%</span>
                    </div>
                    <div className="h-2 bg-[#EAF3EA] rounded-full overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8A9B8A] flex-shrink-0 ml-2 group-open:rotate-90 transition-transform" />
                </summary>
                <div className="px-4 pb-4 pt-0">
                  <div className="bg-[#FAFAF7] rounded-xl p-3 mb-3">
                    <p className="text-xs font-semibold text-[#5A6B5A] mb-1">💡 Next step to improve:</p>
                    <p className="text-sm text-[#1C2B1C]">{tip}</p>
                  </div>
                  <div className="space-y-1.5">
                    {tasks.map(t => (
                      <div key={t} className={`flex items-center gap-2 text-xs ${t.includes("✓") ? "text-[#2E7D32]" : t.includes("⟳") ? "text-[#F9A825]" : "text-[#8A9B8A]"}`}>
                        <span className="text-base">{t.includes("✓") ? "✓" : t.includes("⟳") ? "↻" : "○"}</span>
                        <span>{t.replace(" ✓", "").replace(" ⟳", "").replace(" —", "")}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Certificate section */}
        <div className="bg-[#FFF8E1] border border-[#F9A825]/30 rounded-2xl p-5 text-center">
          <p className="text-3xl mb-2">🏆</p>
          <p className="font-bold text-[#1C2B1C]">Earn your Sustainability Certificate</p>
          <p className="text-sm text-[#5A6B5A] mt-1 mb-4">Reach Sustainable Farmer level to get a certificate you can share with buyers, banks, and cooperatives</p>
          <div className="h-2 bg-[#EAF3EA] rounded-full overflow-hidden">
            <div className="h-full bg-[#F9A825] rounded-full" style={{ width: "48%" }} />
          </div>
          <p className="text-xs text-[#5A6B5A] mt-1.5">48% complete · 17 points to go</p>
        </div>
      </div>
    </AppLayout>
  );
}
