import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Sprout, Eye, EyeOff, ArrowLeft, ChevronRight, Check } from "lucide-react";

const ACCOUNT_TYPES = [
  { id: "farmer", label: "Farmer", emoji: "🌱", desc: "I grow crops or raise livestock" },
  { id: "extension", label: "Extension Officer", emoji: "👨‍🌾", desc: "I support and advise farmers" },
  { id: "agronomist", label: "Agronomist", emoji: "🔬", desc: "I provide expert crop advice" },
  { id: "buyer", label: "Buyer", emoji: "🛒", desc: "I buy farm produce" },
  { id: "cooperative", label: "Cooperative", emoji: "🤝", desc: "We represent a farmer group" },
  { id: "finance", label: "Financial Institution", emoji: "🏦", desc: "We provide financial services" },
];

const DISTRICTS = ["Kampala", "Mbale", "Gulu", "Mbarara", "Jinja", "Arua", "Fort Portal", "Masaka", "Soroti", "Lira", "Kabale", "Hoima", "Tororo", "Iganga", "Mukono"];
const LANGUAGES = ["English", "Luganda", "Runyakitara", "Acholi", "Ateso", "Lugbara", "Lusoga"];
const CROPS = ["Coffee", "Maize", "Beans", "Cassava", "Sweet Potatoes", "Bananas", "Vegetables", "Rice", "Sorghum", "Millet"];

const Logo = () => (
  <div className="flex items-center gap-2.5">
    <div className="w-9 h-9 rounded-xl bg-[#2E7D32] flex items-center justify-center shadow-sm">
      <Sprout className="w-5 h-5 text-white" />
    </div>
    <span className="text-xl font-bold text-[#1C2B1C] tracking-tight">Mavunify</span>
  </div>
);

function Input({ label, type = "text", placeholder, optional, ...props }: any) {
  const [show, setShow] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <label className="block text-sm font-semibold text-[#1C2B1C] mb-1.5">
        {label} {optional && <span className="font-normal text-[#8A9B8A]">(optional)</span>}
      </label>
      <div className="relative">
        <input
          type={isPassword && show ? "text" : type}
          placeholder={placeholder}
          className="w-full px-4 py-3.5 rounded-xl border border-[#D8EAD8] bg-white text-[#1C2B1C] text-sm placeholder:text-[#8A9B8A] focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10 transition-smooth"
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#8A9B8A] hover:text-[#2E7D32]"
          >
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
    </div>
  );
}

function Select({ label, options, ...props }: any) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#1C2B1C] mb-1.5">{label}</label>
      <select
        className="w-full px-4 py-3.5 rounded-xl border border-[#D8EAD8] bg-white text-[#1C2B1C] text-sm focus:outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10 transition-smooth appearance-none"
        {...props}
      >
        <option value="">Choose one</option>
        {options.map((o: string) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

function SignIn({ onSwitch }: { onSwitch: () => void }) {
  const navigate = useNavigate();
  return (
    <div className="space-y-5">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#1C2B1C] mb-2">Welcome back</h1>
        <p className="text-[#5A6B5A]">Sign in to your farm account</p>
      </div>

      <Input label="Phone Number or Email" type="text" placeholder="+256 700 000 000 or name@email.com" />
      <Input label="Password" type="password" placeholder="Your password" />

      <div className="flex items-center justify-between text-sm">
        <label className="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" className="w-4 h-4 rounded accent-[#2E7D32]" />
          <span className="text-[#5A6B5A]">Remember me</span>
        </label>
        <button className="text-[#2E7D32] font-semibold hover:underline">Forgot Password?</button>
      </div>

      <button
        onClick={() => navigate("/dashboard")}
        className="w-full py-4 text-base font-bold text-white bg-[#2E7D32] hover:bg-[#1B5E20] rounded-xl shadow-sm transition-smooth"
      >
        Sign In
      </button>

      <p className="text-center text-sm text-[#5A6B5A]">
        Don't have an account?{" "}
        <button onClick={onSwitch} className="font-bold text-[#2E7D32] hover:underline">
          Create Free Account
        </button>
      </p>
    </div>
  );
}

function SignUp({ onSwitch }: { onSwitch: () => void }) {
  const navigate = useNavigate();
  const [step, setStep] = useState<"type" | "details">("type");
  const [accountType, setAccountType] = useState("");
  const [selectedCrops, setSelectedCrops] = useState<string[]>([]);
  const [agreed, setAgreed] = useState(false);

  const toggleCrop = (c: string) => {
    setSelectedCrops(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  if (step === "type") {
    return (
      <div className="space-y-5">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-[#1C2B1C] mb-2">Create your account</h1>
          <p className="text-[#5A6B5A]">Who are you? Choose your account type.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ACCOUNT_TYPES.map(({ id, label, emoji, desc }) => (
            <button
              key={id}
              onClick={() => setAccountType(id)}
              className={`p-4 rounded-xl border-2 text-left transition-smooth ${
                accountType === id
                  ? "border-[#2E7D32] bg-[#F3F8F3]"
                  : "border-[#EAF3EA] bg-white hover:border-[#D8EAD8]"
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-2xl mb-1.5">{emoji}</div>
                  <p className="font-bold text-[#1C2B1C] text-sm">{label}</p>
                  <p className="text-[#5A6B5A] text-xs mt-0.5">{desc}</p>
                </div>
                {accountType === id && (
                  <div className="w-5 h-5 rounded-full bg-[#2E7D32] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>

        <button
          onClick={() => accountType && setStep("details")}
          disabled={!accountType}
          className="w-full py-4 text-base font-bold text-white bg-[#2E7D32] hover:bg-[#1B5E20] rounded-xl shadow-sm transition-smooth disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          Continue <ChevronRight className="w-5 h-5" />
        </button>

        <p className="text-center text-sm text-[#5A6B5A]">
          Already have an account?{" "}
          <button onClick={onSwitch} className="font-bold text-[#2E7D32] hover:underline">Sign In</button>
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => setStep("type")} className="p-2 rounded-lg hover:bg-[#F3F8F3] transition-smooth">
          <ArrowLeft className="w-5 h-5 text-[#5A6B5A]" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-[#1C2B1C]">Your farm details</h1>
          <p className="text-sm text-[#5A6B5A]">We personalise your experience for you</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Full Name" placeholder="Your name" />
        <Input label="Phone Number" type="tel" placeholder="+256 700 000 000" />
      </div>
      <Input label="Email" type="email" placeholder="name@email.com" optional />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="District" options={DISTRICTS} />
        <Input label="Sub-county" placeholder="Your sub-county" />
      </div>
      <Input label="Village" placeholder="Your village name" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select label="Preferred Language" options={LANGUAGES} />
        <Select label="Farm Size" options={["Less than 1 acre", "1–5 acres", "5–20 acres", "More than 20 acres"]} />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1C2B1C] mb-2">Primary Crops</label>
        <div className="flex flex-wrap gap-2">
          {CROPS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => toggleCrop(c)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-smooth ${
                selectedCrops.includes(c)
                  ? "bg-[#2E7D32] text-white border-[#2E7D32]"
                  : "bg-white text-[#5A6B5A] border-[#D8EAD8] hover:border-[#2E7D32]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <Select label="Farming Practice" options={["Conventional", "Organic", "Mixed", "Regenerative", "Not sure yet"]} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input label="Password" type="password" placeholder="Create a password" />
        <Input label="Confirm Password" type="password" placeholder="Repeat your password" />
      </div>

      <label className="flex items-start gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="w-4 h-4 mt-0.5 rounded accent-[#2E7D32] flex-shrink-0"
        />
        <span className="text-sm text-[#5A6B5A]">
          I agree to Mavunify's{" "}
          <span className="text-[#2E7D32] font-semibold">Terms of Service</span> and{" "}
          <span className="text-[#2E7D32] font-semibold">Privacy Policy</span>
        </span>
      </label>

      <button
        onClick={() => navigate("/dashboard")}
        disabled={!agreed}
        className="w-full py-4 text-base font-bold text-white bg-[#2E7D32] hover:bg-[#1B5E20] rounded-xl shadow-sm transition-smooth disabled:opacity-40 disabled:cursor-not-allowed"
      >
        Create Account
      </button>
    </div>
  );
}

export default function Auth() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<"signin" | "signup">(
    searchParams.get("mode") === "signup" ? "signup" : "signin"
  );

  return (
    <div className="min-h-screen bg-[#FAFAF7] flex flex-col">
      {/* Header */}
      <div className="px-4 sm:px-6 py-5 flex items-center justify-between max-w-7xl mx-auto w-full">
        <button onClick={() => navigate("/")} className="flex items-center gap-2 text-[#5A6B5A] hover:text-[#2E7D32] transition-smooth text-sm font-medium">
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <Logo />
        <div className="w-16" />
      </div>

      <div className="flex-1 flex items-start justify-center px-4 py-8">
        <div className="w-full max-w-xl bg-white rounded-3xl shadow-md border border-[#EAF3EA] p-8 md:p-10">
          {/* Mode toggle pills */}
          <div className="flex bg-[#F3F8F3] rounded-xl p-1 mb-8">
            <button
              onClick={() => setMode("signin")}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-smooth ${
                mode === "signin" ? "bg-white text-[#2E7D32] shadow-xs" : "text-[#5A6B5A]"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode("signup")}
              className={`flex-1 py-2.5 text-sm font-bold rounded-lg transition-smooth ${
                mode === "signup" ? "bg-white text-[#2E7D32] shadow-xs" : "text-[#5A6B5A]"
              }`}
            >
              Create Account
            </button>
          </div>

          {mode === "signin"
            ? <SignIn onSwitch={() => setMode("signup")} />
            : <SignUp onSwitch={() => setMode("signin")} />
          }
        </div>
      </div>
    </div>
  );
}
