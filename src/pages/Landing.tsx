import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Sprout, BookOpen, CloudSun, Leaf, GraduationCap, Users, Headphones,
  ShoppingBag, Phone, ArrowRight, Menu, X, Star, CheckCircle, ChevronRight,
  TrendingUp, Shield, Zap,
} from "lucide-react";

const HERO = "https://images.unsplash.com/photo-1707235163412-df7e8c119322?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=1400&q=85";
const FARMER_1 = "https://images.unsplash.com/photo-1740741707068-fc902687835d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const FARMER_2 = "https://images.unsplash.com/photo-1597816760638-406d7271105c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const FARMER_3 = "https://images.unsplash.com/photo-1741940365182-bc0ffdc1262d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=400&q=80";
const FARMER_HARVEST = "https://images.unsplash.com/photo-1551357176-7d517a48c209?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800&q=80";

const NAV_LINKS = ["About", "Features", "How It Works", "Success Stories", "Pricing", "Contact"];

const FEATURES = [
  { icon: Sprout, title: "Personalized Farming Guidance", desc: "Get advice tailored to your soil, crops, and local weather — not generic tips.", color: "#2E7D32" },
  { icon: BookOpen, title: "Farm Records", desc: "Keep digital records of everything — planting, harvesting, expenses, and income.", color: "#1976D2" },
  { icon: CloudSun, title: "Weather-Based Recommendations", desc: "Know the best time to plant, harvest, or spray based on real local weather.", color: "#F9A825" },
  { icon: Leaf, title: "Sustainability Journey", desc: "Track your path from Beginner to Regenerative Champion with clear milestones.", color: "#66BB6A" },
  { icon: GraduationCap, title: "Learning Centre", desc: "Short lessons, videos, and audio in your language. Learn at your own pace.", color: "#7B1FA2" },
  { icon: Users, title: "Community", desc: "Talk with farmers in your district. Share tips, ask questions, celebrate wins.", color: "#0288D1" },
  { icon: Headphones, title: "Expert Support", desc: "Book an agronomist, vet, or extension officer. Get help when you need it.", color: "#E64A19" },
  { icon: ShoppingBag, title: "Marketplace", desc: "Buy seeds and inputs. Sell your produce directly to verified buyers.", color: "#00796B" },
  { icon: Phone, title: "Works on Any Phone", desc: "Smartphone, feature phone, or USSD (*000*000#). No internet always needed.", color: "#455A64" },
];

const STEPS = [
  { num: "01", title: "Create your account", desc: "Sign up free in 2 minutes. Choose your account type — farmer, cooperative, or buyer." },
  { num: "02", title: "Set up your farm", desc: "Tell us about your land, crops, and location. We personalise everything for you." },
  { num: "03", title: "Receive farming recommendations", desc: "Get daily advice matched to your farm, your crops, and today's weather." },
  { num: "04", title: "Record farm activities", desc: "Log what you do each day — planting, spraying, harvesting — with photos." },
  { num: "05", title: "Track progress and grow", desc: "Watch your farm health improve. Build a record that opens doors to finance and markets." },
];

const TESTIMONIALS = [
  { name: "Nakato Rose", role: "Coffee Farmer, Mbale", quote: "Before Mavunify I was guessing. Now I know exactly when to prune, when to spray, and what my coffee is worth. My harvest improved by 40%.", img: FARMER_1 },
  { name: "Okello James", role: "Vegetable Farmer, Kampala", quote: "The marketplace changed everything. I now sell directly to restaurants in Kampala. No middlemen taking my profit.", img: FARMER_2 },
  { name: "Akello Grace", role: "Maize Farmer, Gulu", quote: "I used to walk hours to find an extension officer. Now I ask Mavunify and get an answer in minutes. My children are proud of our farm.", img: FARMER_3 },
];

const PARTNERS = [
  { label: "AGRA", sub: "Alliance for a Green Revolution in Africa", type: "Development" },
  { label: "FANRPAN", sub: "Food, Agriculture & Natural Resources Policy Network", type: "Policy" },
  { label: "East African Community", sub: "EAC", type: "Government" },
  { label: "YASE", sub: "Youth in Agri-food Systems in East Africa", type: "Youth" },
  { label: "EAAYEA", sub: "East Africa Agritech Youth Ecosystem Alliance", type: "Youth" },
  { label: "SBIL", sub: "Stanbic Business Incubator Limited", type: "Finance" },
];

const Logo = () => (
  <div className="flex items-center gap-2.5">
    <div className="w-9 h-9 rounded-xl bg-[#2E7D32] flex items-center justify-center shadow-sm">
      <Sprout className="w-5 h-5 text-white" />
    </div>
    <span className="text-xl font-bold text-[#1C2B1C] tracking-tight">Mavunify</span>
  </div>
);

export default function Landing() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF7]">
      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/90 backdrop-blur-md border-b border-[#EAF3EA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Logo />

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map((l) => (
              <button
                key={l}
                onClick={() => scrollTo(l.toLowerCase().replace(/\s+/g, "-"))}
                className="text-sm text-[#5A6B5A] hover:text-[#2E7D32] font-medium transition-smooth cursor-pointer"
              >
                {l}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <button
              onClick={() => navigate("/auth?mode=signin")}
              className="px-4 py-2 text-sm font-semibold text-[#2E7D32] hover:bg-[#F3F8F3] rounded-xl transition-smooth"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/auth?mode=signup")}
              className="px-5 py-2.5 text-sm font-semibold text-white bg-[#2E7D32] hover:bg-[#1B5E20] rounded-xl shadow-sm transition-smooth"
            >
              Create Account
            </button>
          </div>

          {/* Mobile menu toggle */}
          <button className="lg:hidden p-2 rounded-lg text-[#5A6B5A]" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="lg:hidden bg-white border-t border-[#EAF3EA] px-4 py-4 space-y-1">
            {NAV_LINKS.map((l) => (
              <button
                key={l}
                onClick={() => scrollTo(l.toLowerCase().replace(/\s+/g, "-"))}
                className="block w-full text-left px-3 py-3 text-sm font-medium text-[#1C2B1C] hover:bg-[#F3F8F3] rounded-xl transition-smooth"
              >
                {l}
              </button>
            ))}
            <div className="pt-3 space-y-2">
              <button
                onClick={() => navigate("/auth?mode=signin")}
                className="block w-full px-4 py-3 text-sm font-semibold text-[#2E7D32] border border-[#2E7D32] rounded-xl text-center"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/auth?mode=signup")}
                className="block w-full px-4 py-3 text-sm font-semibold text-white bg-[#2E7D32] rounded-xl text-center"
              >
                Create Free Account
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ── HERO ── */}
      <section className="relative min-h-[100svh] flex items-center pt-16">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${HERO})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAFAF7]/90 via-[#FAFAF7]/75 to-[#FAFAF7]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAFAF7]/80 via-transparent to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#2E7D32]/10 border border-[#2E7D32]/20 rounded-full text-sm font-semibold text-[#2E7D32] mb-8">
              <Sprout className="w-4 h-4" />
              Trusted by farmers across Uganda
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-[#1C2B1C] leading-[1.08] tracking-tight mb-6">
              Grow Better.<br />
              Farm Smarter.<br />
              <span className="text-[#2E7D32]">Prosper Together.</span>
            </h1>

            <p className="text-lg md:text-xl text-[#5A6B5A] max-w-2xl mb-4 leading-relaxed">
              Personalized farming guidance, digital farm records, sustainability tracking,
              learning resources, expert support, and better market opportunities — all in one place.
            </p>
            <p className="text-base font-semibold text-[#2E7D32] mb-10">
              Works on smartphones, feature phones, and USSD.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button
                onClick={() => navigate("/auth?mode=signup")}
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-bold text-white bg-[#2E7D32] hover:bg-[#1B5E20] rounded-2xl shadow-md transition-smooth"
              >
                Create Free Account
                <ArrowRight className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate("/auth?mode=signin")}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-[#2E7D32] bg-white border-2 border-[#2E7D32]/30 hover:border-[#2E7D32] hover:bg-[#F3F8F3] rounded-2xl transition-smooth"
              >
                Sign In
              </button>
            </div>

            <p className="text-sm text-[#8A9B8A] flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-[#66BB6A] flex-shrink-0" />
              Trusted by farmers, cooperatives, development partners, and agricultural organizations across Uganda.
            </p>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF STRIP ── */}
      <div className="bg-[#2E7D32] py-5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-wrap justify-center gap-x-12 gap-y-3 text-white/90 text-sm font-medium">
            {["10,000+ Farmers", "65+ Districts", "3 Languages", "Any Phone"].map((s) => (
              <div key={s} className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-[#A5D6A7]" />
                {s}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── WHY FARMERS CHOOSE MAVUNIFY ── */}
      <section id="features" className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-[#F3F8F3] text-[#2E7D32] text-sm font-semibold rounded-full border border-[#D8EAD8] mb-4">
            Everything you need
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1C2B1C] mb-4">
            Why Farmers Choose Mavunify
          </h2>
          <p className="text-lg text-[#5A6B5A] max-w-2xl mx-auto">
            One platform. Everything your farm needs to thrive.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(({ icon: Icon, title, desc, color }) => (
            <div
              key={title}
              className="group bg-white hover:bg-[#F3F8F3] border border-[#EAF3EA] rounded-2xl p-7 shadow-xs hover:shadow-md transition-smooth cursor-default"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
                style={{ backgroundColor: `${color}15` }}
              >
                <Icon className="w-7 h-7" style={{ color }} />
              </div>
              <h3 className="text-lg font-bold text-[#1C2B1C] mb-2">{title}</h3>
              <p className="text-[#5A6B5A] text-sm leading-relaxed">{desc}</p>
              <div className="mt-4 flex items-center gap-1.5 text-xs font-semibold" style={{ color }}>
                Learn more <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-24 bg-[#F3F8F3]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1.5 bg-white text-[#2E7D32] text-sm font-semibold rounded-full border border-[#D8EAD8] mb-4">
              Simple to start
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1C2B1C] mb-4">How It Works</h2>
            <p className="text-lg text-[#5A6B5A]">Be up and farming smarter in minutes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {STEPS.map(({ num, title, desc }, i) => (
              <div key={num} className="relative">
                <div className="bg-white rounded-2xl p-6 shadow-xs border border-[#EAF3EA] h-full">
                  <div className="w-12 h-12 rounded-2xl bg-[#2E7D32] text-white font-bold text-lg flex items-center justify-center mb-4">
                    {num}
                  </div>
                  <h3 className="font-bold text-[#1C2B1C] mb-2 text-base">{title}</h3>
                  <p className="text-[#5A6B5A] text-sm leading-relaxed">{desc}</p>
                </div>
                {i < STEPS.length - 1 && (
                  <div className="hidden md:block absolute top-10 -right-3 z-10">
                    <ArrowRight className="w-5 h-5 text-[#66BB6A]" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUCCESS STORIES ── */}
      <section id="success-stories" className="py-24 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 bg-[#F3F8F3] text-[#2E7D32] text-sm font-semibold rounded-full border border-[#D8EAD8] mb-4">
            Real farmers, real results
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-[#1C2B1C] mb-4">Farmer Success Stories</h2>
          <p className="text-lg text-[#5A6B5A]">Hear from farmers who are growing better with Mavunify.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map(({ name, role, quote, img }) => (
            <div key={name} className="bg-white rounded-2xl p-7 shadow-sm border border-[#EAF3EA] flex flex-col">
              <div className="flex gap-1 mb-5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-[#F9A825] text-[#F9A825]" />
                ))}
              </div>
              <p className="text-[#1C2B1C] text-base leading-relaxed flex-1 mb-6 italic">
                "{quote}"
              </p>
              <div className="flex items-center gap-3">
                <img src={img} alt={name} className="w-12 h-12 rounded-full object-cover border-2 border-[#D8EAD8]" />
                <div>
                  <p className="font-bold text-[#1C2B1C] text-sm">{name}</p>
                  <p className="text-[#5A6B5A] text-xs">{role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Impact photo */}
        <div className="mt-12 relative rounded-3xl overflow-hidden shadow-lg">
          <img src={FARMER_HARVEST} alt="Farmers thriving with Mavunify" className="w-full h-72 md:h-96 object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1B5E20]/80 to-transparent" />
          <div className="absolute inset-0 flex items-center px-8 md:px-16">
            <div className="max-w-lg">
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">Join thousands of farmers growing better</h3>
              <p className="text-white/85 text-base mb-6">Across Uganda's 65 districts, farmers are building healthier farms and better lives.</p>
              <button
                onClick={() => navigate("/auth?mode=signup")}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[#F9A825] hover:bg-[#F57F17] text-[#1C2B1C] font-bold rounded-xl transition-smooth"
              >
                Start Your Journey <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── PARTNER LOGOS ── */}
      <section className="py-16 bg-[#F3F8F3] border-y border-[#EAF3EA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <p className="text-center text-sm font-semibold text-[#8A9B8A] uppercase tracking-widest mb-10">
            Trusted by leading organizations
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {PARTNERS.map(({ label, sub, type }) => (
              <div key={label} className="bg-white rounded-xl border border-[#EAF3EA] p-5 flex flex-col items-center justify-center gap-2 shadow-xs text-center">
                <div className="w-9 h-9 rounded-xl bg-[#2E7D32]/10 flex items-center justify-center">
                  {type === "Government" && <Shield className="w-4.5 h-4.5 text-[#2E7D32]" />}
                  {type === "Policy" && <Users className="w-4.5 h-4.5 text-[#1976D2]" />}
                  {type === "Finance" && <TrendingUp className="w-4.5 h-4.5 text-[#F9A825]" />}
                  {type === "Youth" && <Sprout className="w-4.5 h-4.5 text-[#66BB6A]" />}
                  {type === "Development" && <Zap className="w-4.5 h-4.5 text-[#7B1FA2]" />}
                </div>
                <p className="text-sm font-bold text-[#1C2B1C]">{label}</p>
                <p className="text-[10px] text-[#8A9B8A] leading-snug">{sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section id="contact" className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <div className="bg-gradient-to-br from-[#2E7D32] to-[#1B5E20] rounded-3xl p-12 md:p-20 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#F9A825]/10 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24" />
            <div className="relative">
              <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Sprout className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-5 leading-tight">
                Start Growing Better Today
              </h2>
              <p className="text-white/85 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
                Join thousands of farmers in Mbale, Kampala, Gulu, and across Uganda who are improving their farms with Mavunify.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={() => navigate("/auth?mode=signup")}
                  className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-bold text-[#1B5E20] bg-white hover:bg-[#F3F8F3] rounded-2xl shadow-md transition-smooth"
                >
                  Create Free Account
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate("/auth?mode=signin")}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 text-base font-bold text-white bg-white/15 hover:bg-white/25 border border-white/30 rounded-2xl transition-smooth"
                >
                  Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#1C2B1C] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#2E7D32] flex items-center justify-center">
                <Sprout className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-white">Mavunify</span>
              <span className="text-white/40 text-sm ml-2">by Boresha Mavuno Agritech Ltd</span>
            </div>
            <p className="text-white/50 text-sm text-center">
              Empowering Ugandan farmers with world-class agricultural extension services.
            </p>
            <div className="flex gap-4 text-white/50 text-xs">
              <span className="hover:text-white cursor-pointer">Privacy</span>
              <span className="hover:text-white cursor-pointer">Terms</span>
              <span className="hover:text-white cursor-pointer">Support</span>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10 text-center text-white/30 text-xs">
            © 2025 Boresha Mavuno Agritech Ltd. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
