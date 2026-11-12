import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell, Check, Edit2, Globe2, LogOut, Mail, MapPin,
  Phone, Ruler, Star, X,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";

const FARMER_HARVEST = "https://images.unsplash.com/photo-1551357176-7d517a48c209?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=300&q=80";
const PROFILE_STORAGE_KEY = "mavunify.farmer-profile";
const PREFERENCES_STORAGE_KEY = "mavunify.farmer-preferences";

type FarmerProfile = {
  name: string;
  location: string;
  phone: string;
  email: string;
  farmSize: string;
  crops: string;
  practice: string;
};

type Preferences = {
  language: string;
  units: "Metric" | "Imperial";
  weatherAlerts: boolean;
  marketUpdates: boolean;
  learningReminders: boolean;
  shareInsights: boolean;
};

const DEFAULT_PROFILE: FarmerProfile = {
  name: "Nakato Rose",
  location: "Wanale, Mbale District",
  phone: "+256 700 234 567",
  email: "nakato@email.com",
  farmSize: "3.5 acres",
  crops: "Arabica Coffee, Beans",
  practice: "Organic / Mixed",
};

const DEFAULT_PREFERENCES: Preferences = {
  language: "English",
  units: "Metric",
  weatherAlerts: true,
  marketUpdates: true,
  learningReminders: false,
  shareInsights: false,
};

const ACHIEVEMENTS = [
  { emoji: "🌱", label: "First Record", done: true },
  { emoji: "🎓", label: "First Lesson", done: true },
  { emoji: "🌿", label: "Soil Champion", done: true },
  { emoji: "💧", label: "Water Wise", done: true },
  { emoji: "🌳", label: "Tree Planter", done: false },
  { emoji: "♻️", label: "Regen Champ", done: false },
];

function readStored<T,>(key: string, fallback: T): T {
  try {
    const stored = window.localStorage.getItem(key);
    return stored ? { ...fallback, ...JSON.parse(stored) } : fallback;
  } catch {
    return fallback;
  }
}

function PreferenceToggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 border-b border-[#EAF3EA] py-4 last:border-0">
      <span>
        <span className="block text-sm font-semibold text-[#1C2B1C]">{label}</span>
        <span className="mt-0.5 block text-xs text-[#718071]">{description}</span>
      </span>
      <span className="relative inline-flex h-6 w-11 shrink-0 items-center">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.currentTarget.checked)}
          className="peer sr-only"
        />
        <span className="absolute inset-0 rounded-full bg-[#D8EAD8] transition-colors peer-checked:bg-[#2E7D32] peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#2E7D32]" />
        <span className="pointer-events-none absolute left-1 top-1 h-4 w-4 rounded-full bg-white shadow-sm transition-transform peer-checked:translate-x-5" />
      </span>
    </label>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<FarmerProfile>(() => readStored(PROFILE_STORAGE_KEY, DEFAULT_PROFILE));
  const [preferences, setPreferences] = useState<Preferences>(() => readStored(PREFERENCES_STORAGE_KEY, DEFAULT_PREFERENCES));
  const [draft, setDraft] = useState(profile);
  const [editorOpen, setEditorOpen] = useState(false);
  const [status, setStatus] = useState("");

  useEffect(() => {
    window.localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    window.localStorage.setItem(PREFERENCES_STORAGE_KEY, JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    if (!editorOpen) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setEditorOpen(false);
    };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [editorOpen]);

  const editProfile = () => {
    setDraft(profile);
    setEditorOpen(true);
  };

  const saveProfile = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setProfile(draft);
    setEditorOpen(false);
    setStatus("Profile saved on this device");
  };

  const updatePreference = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    setPreferences((current) => ({ ...current, [key]: value }));
    setStatus("Preferences saved on this device");
  };

  const farmInfo = [
    { label: "Location", value: profile.location },
    { label: "Farm Size", value: profile.farmSize },
    { label: "Primary Crops", value: profile.crops },
    { label: "Farming Practice", value: profile.practice },
    { label: "Member Since", value: "March 2024" },
  ];

  return (
    <AppLayout>
      <div className="mx-auto max-w-3xl space-y-5 px-4 py-6 sm:px-6 lg:py-8">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.12em] text-[#668066]">Your account</p>
            <h1 className="mt-1 text-2xl font-bold text-[#1C2B1C]">Profile &amp; preferences</h1>
          </div>
          <button
            onClick={editProfile}
            className="inline-flex items-center gap-2 rounded-lg bg-[#2E7D32] px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-[#1B5E20]"
          >
            <Edit2 className="h-4 w-4" /> Edit profile
          </button>
        </div>
        <p role="status" aria-live="polite" className="min-h-5 text-sm text-[#2E7D32]">{status}</p>

        <section className="overflow-hidden rounded-xl border border-[#EAF3EA] bg-white shadow-xs" aria-label="Farmer profile">
          <div className="relative h-24 bg-gradient-to-r from-[#2E7D32] via-[#3E8447] to-[#B7A455]">
            <button
              onClick={editProfile}
              aria-label="Edit farmer profile"
              className="absolute right-4 top-4 rounded-lg bg-white/20 p-2 text-white transition-colors hover:bg-white/35"
            >
              <Edit2 className="h-4 w-4" />
            </button>
          </div>
          <div className="px-5 pb-5">
            <img src={FARMER_HARVEST} alt="Farm harvest" className="-mt-10 mb-3 h-20 w-20 rounded-xl border-4 border-white object-cover shadow-md" />
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#1C2B1C]">{profile.name}</h2>
                <p className="text-sm font-semibold text-[#2E7D32]">Improving Farmer</p>
              </div>
              <div className="text-left sm:text-right">
                <div className="flex items-center gap-1 sm:justify-end">
                  <Star className="h-4 w-4 fill-[#C89022] text-[#C89022]" />
                  <span className="font-bold text-[#1C2B1C]">4.2</span>
                </div>
                <p className="text-xs text-[#718071]">Mavunify Score</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#5A6B5A]">
              <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[#2E7D32]" />{profile.location}</div>
              <div className="flex items-center gap-1.5"><Phone className="h-4 w-4 text-[#2E7D32]" />{profile.phone}</div>
              <div className="flex min-w-0 items-center gap-1.5"><Mail className="h-4 w-4 shrink-0 text-[#2E7D32]" /><span className="break-all">{profile.email}</span></div>
            </div>
          </div>
        </section>

        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Farm Records", value: "47" },
            { label: "Lessons Done", value: "3" },
            { label: "Days Active", value: "127" },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-[#EAF3EA] bg-white p-3 text-center shadow-xs sm:p-4">
              <p className="text-2xl font-bold text-[#2E7D32]">{value}</p>
              <p className="mt-0.5 text-xs text-[#718071]">{label}</p>
            </div>
          ))}
        </div>

        <section className="rounded-xl border border-[#EAF3EA] bg-white p-5 shadow-xs">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-[#1C2B1C]">Farm information</h2>
            <button onClick={editProfile} aria-label="Edit farm information" className="rounded-lg p-2 text-[#5A6B5A] transition-colors hover:bg-[#F3F8F3]">
              <Edit2 className="h-4 w-4" />
            </button>
          </div>
          <dl className="divide-y divide-[#EAF3EA]">
            {farmInfo.map(({ label, value }) => (
              <div key={label} className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-3 first:pt-1 last:pb-0">
                <dt className="text-sm text-[#5A6B5A]">{label}</dt>
                <dd className="text-right text-sm font-semibold text-[#1C2B1C]">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-xl border border-[#EAF3EA] bg-white p-5 shadow-xs">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F3F8F3] text-[#2E7D32]"><Globe2 className="h-4 w-4" /></div>
            <div>
              <h2 className="font-bold text-[#1C2B1C]">Language</h2>
              <p className="text-xs text-[#718071]">Choose the language used in Mavunify</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2" role="group" aria-label="Preferred language">
            {["English", "Luganda", "Runyankole"].map((language) => (
              <button
                key={language}
                onClick={() => updatePreference("language", language)}
                aria-pressed={preferences.language === language}
                className={`min-h-10 rounded-lg border px-2 text-xs font-bold transition-colors sm:text-sm ${preferences.language === language ? "border-[#2E7D32] bg-[#2E7D32] text-white" : "border-[#D8EAD8] text-[#5A6B5A] hover:bg-[#F3F8F3]"}`}
              >
                {language}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-[#EAF3EA] bg-white p-5 shadow-xs">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7F2E5] text-[#92722A]"><Ruler className="h-4 w-4" /></div>
            <div>
              <h2 className="font-bold text-[#1C2B1C]">Measurement units</h2>
              <p className="text-xs text-[#718071]">Choose how farm measurements are shown</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2" role="group" aria-label="Measurement units">
            {(["Metric", "Imperial"] as const).map((units) => (
              <button
                key={units}
                onClick={() => updatePreference("units", units)}
                aria-pressed={preferences.units === units}
                className={`min-h-10 rounded-lg border px-3 text-sm font-bold transition-colors ${preferences.units === units ? "border-[#2E7D32] bg-[#F3F8F3] text-[#2E7D32]" : "border-[#D8EAD8] text-[#5A6B5A] hover:bg-[#F3F8F3]"}`}
              >
                {units}{units === "Metric" ? " (kg, ha)" : " (lb, acres)"}
              </button>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-[#EAF3EA] bg-white px-5 shadow-xs">
          <div className="flex items-center gap-3 border-b border-[#EAF3EA] py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#EEF4F8] text-[#426A7C]"><Bell className="h-4 w-4" /></div>
            <div>
              <h2 className="font-bold text-[#1C2B1C]">Notifications &amp; privacy</h2>
              <p className="text-xs text-[#718071]">Choose what you receive and share</p>
            </div>
          </div>
          <PreferenceToggle label="Weather alerts" description="Rain, dry spells, and severe weather" checked={preferences.weatherAlerts} onChange={(checked) => updatePreference("weatherAlerts", checked)} />
          <PreferenceToggle label="Market updates" description="Local produce prices and buyer activity" checked={preferences.marketUpdates} onChange={(checked) => updatePreference("marketUpdates", checked)} />
          <PreferenceToggle label="Learning reminders" description="New lessons and your learning progress" checked={preferences.learningReminders} onChange={(checked) => updatePreference("learningReminders", checked)} />
          <PreferenceToggle label="Share anonymous farm insights" description="Help improve local farming recommendations" checked={preferences.shareInsights} onChange={(checked) => updatePreference("shareInsights", checked)} />
        </section>

        <section className="rounded-xl border border-[#EAF3EA] bg-white p-5 shadow-xs">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="font-bold text-[#1C2B1C]">Achievements</h2>
            <span className="text-xs text-[#718071]">4 / 6 earned</span>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
            {ACHIEVEMENTS.map(({ emoji, label, done }) => (
              <div key={label} className={`flex min-h-20 flex-col items-center justify-center gap-1 rounded-lg p-2 ${done ? "bg-[#F3F8F3]" : "bg-[#FAFAF7] opacity-50"}`}>
                <span className={`text-xl ${done ? "" : "grayscale"}`}>{emoji}</span>
                <p className="text-center text-[10px] font-medium leading-tight text-[#5A6B5A]">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <button
          onClick={() => navigate("/")}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#F2C6C4] py-3.5 text-sm font-bold text-[#C7433E] transition-colors hover:bg-[#FFF4F3]"
        >
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </div>

      {editorOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#172117]/45 p-0 sm:items-center sm:p-5" onClick={() => setEditorOpen(false)}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="profile-editor-title"
            className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-xl bg-white p-5 shadow-xl sm:rounded-xl sm:p-6"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-start justify-between gap-3">
              <div>
                <h2 id="profile-editor-title" className="text-lg font-bold text-[#1C2B1C]">Edit farmer profile</h2>
                <p className="mt-1 text-sm text-[#718071]">Update your contact and farm details.</p>
              </div>
              <button onClick={() => setEditorOpen(false)} aria-label="Close profile editor" className="rounded-lg p-2 text-[#5A6B5A] hover:bg-[#F3F8F3]"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={saveProfile} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {([
                  ["name", "Full name"],
                  ["location", "Location"],
                  ["phone", "Phone number"],
                  ["email", "Email address"],
                  ["farmSize", "Farm size"],
                  ["crops", "Primary crops"],
                  ["practice", "Farming practice"],
                ] as const).map(([field, label]) => (
                  <label key={field} className="block text-sm font-semibold text-[#344534]">
                    {label}
                    <input
                      required
                      type={field === "email" ? "email" : "text"}
                      value={draft[field]}
                      onChange={(event) => setDraft((current) => ({ ...current, [field]: event.currentTarget.value }))}
                      className="mt-1.5 block min-h-11 w-full rounded-lg border border-[#CEDDCE] px-3 text-sm font-normal text-[#1C2B1C] outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/15"
                    />
                  </label>
                ))}
              </div>
              <div className="flex justify-end gap-2 border-t border-[#EAF3EA] pt-4">
                <button type="button" onClick={() => setEditorOpen(false)} className="rounded-lg border border-[#D8EAD8] px-4 py-2.5 text-sm font-bold text-[#5A6B5A] hover:bg-[#F3F8F3]">Cancel</button>
                <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-[#2E7D32] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1B5E20]"><Check className="h-4 w-4" /> Save profile</button>
              </div>
            </form>
          </section>
        </div>
      )}
    </AppLayout>
  );
}