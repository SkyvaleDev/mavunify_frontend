import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bell, BriefcaseBusiness, Camera, Check, Edit2, Globe2, LogOut, Mail,
  MapPin, MessageCircle, Phone, Ruler, ShieldCheck, Trash2, Users,
  UserRound, X,
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
  photo: string;
  language: string;
  gender: string;
  genderConsent: boolean;
  ageRange: string;
  cooperative: string;
  experience: string;
  communicationChannel: string;
  alternativeContact: string;
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
  photo: "",
  language: "English",
  gender: "",
  genderConsent: false,
  ageRange: "",
  cooperative: "Wanale Coffee Growers Cooperative",
  experience: "6-10 years",
  communicationChannel: "SMS",
  alternativeContact: "",
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

function resizeProfilePhoto(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Choose an image file."));
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, 512 / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const context = canvas.getContext("2d");
      URL.revokeObjectURL(objectUrl);

      if (!context) {
        reject(new Error("This photo could not be processed."));
        return;
      }

      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("This photo could not be opened."));
    };
    image.src = objectUrl;
  });
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
    setPreferences((current) => ({ ...current, language: draft.language }));
    setEditorOpen(false);
    setStatus("Profile saved on this device");
  };

  const updatePreference = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    setPreferences((current) => ({ ...current, [key]: value }));
    if (key === "language") {
      setProfile((current) => ({ ...current, language: value as string }));
    }
    setStatus("Preferences saved on this device");
  };

  const farmInfo = [
    { label: "Location", value: profile.location },
    { label: "Farm Size", value: profile.farmSize },
    { label: "Primary Crops", value: profile.crops },
    { label: "Farming Practice", value: profile.practice },
  ];
  const personalInfo = [
    { label: "Preferred language", value: profile.language },
    { label: "Gender", value: profile.genderConsent ? profile.gender || "Not provided" : "Not shared" },
    { label: "Age range", value: profile.ageRange || "Not shared" },
    { label: "Cooperative membership", value: profile.cooperative || "Not listed" },
    { label: "Farming experience", value: profile.experience || "Not provided" },
    { label: "Preferred contact", value: profile.communicationChannel },
    { label: "Alternative contact", value: profile.alternativeContact || "Not provided" },
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
            {profile.photo ? (
              <img src={profile.photo} alt={`${profile.name}'s profile`} className="-mt-10 mb-3 h-20 w-20 rounded-xl border-4 border-white object-cover shadow-md" />
            ) : (
              <div aria-label="No profile photo" className="-mt-10 mb-3 flex h-20 w-20 items-center justify-center rounded-xl border-4 border-white bg-[#E7EFE5] text-[#45644A] shadow-md">
                <UserRound className="h-9 w-9" />
              </div>
            )}
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#1C2B1C]">{profile.name}</h2>
                <p className="mt-0.5 text-sm text-[#5A6B5A]">{profile.cooperative || "Independent farmer"}</p>
              </div>
            </div>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-[#5A6B5A]">
              <div className="flex items-center gap-1.5"><MapPin className="h-4 w-4 text-[#2E7D32]" />{profile.location}</div>
              <div className="flex items-center gap-1.5"><Phone className="h-4 w-4 text-[#2E7D32]" />{profile.phone}</div>
              <div className="flex min-w-0 items-center gap-1.5"><Mail className="h-4 w-4 shrink-0 text-[#2E7D32]" /><span className="break-all">{profile.email}</span></div>
            </div>
          </div>
        </section>

        <section className="rounded-xl border border-[#EAF3EA] bg-white p-5 shadow-xs">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F3F8F3] text-[#2E7D32]"><ShieldCheck className="h-4 w-4" /></div>
              <div>
                <h2 className="font-bold text-[#1C2B1C]">About you</h2>
                <p className="text-xs text-[#718071]">Personal details and how to reach you</p>
              </div>
            </div>
            <button onClick={editProfile} aria-label="Edit personal details" className="rounded-lg p-2 text-[#5A6B5A] transition-colors hover:bg-[#F3F8F3]"><Edit2 className="h-4 w-4" /></button>
          </div>
          <dl className="divide-y divide-[#EAF3EA]">
            {personalInfo.map(({ label, value }) => (
              <div key={label} className="flex flex-wrap justify-between gap-x-4 gap-y-1 py-3 first:pt-1 last:pb-0">
                <dt className="text-sm text-[#5A6B5A]">{label}</dt>
                <dd className="max-w-[65%] text-right text-sm font-semibold text-[#1C2B1C]">{value}</dd>
              </div>
            ))}
          </dl>
        </section>

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
                <p className="mt-1 text-sm text-[#718071]">Your details are saved on this device.</p>
              </div>
              <button onClick={() => setEditorOpen(false)} aria-label="Close profile editor" className="rounded-lg p-2 text-[#5A6B5A] hover:bg-[#F3F8F3]"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={saveProfile} className="space-y-5">
              <section>
                <h3 className="mb-3 text-sm font-bold text-[#1C2B1C]">Personal details</h3>
                <div className="mb-4 flex flex-wrap items-center gap-3">
                  {draft.photo ? (
                    <img src={draft.photo} alt="Profile preview" className="h-16 w-16 rounded-lg object-cover" />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-[#E7EFE5] text-[#45644A]"><UserRound className="h-7 w-7" /></div>
                  )}
                  <div className="flex flex-wrap items-center gap-2">
                    <label className="inline-flex min-h-10 cursor-pointer items-center gap-2 rounded-lg border border-[#D8EAD8] px-3 text-sm font-semibold text-[#405740] hover:bg-[#F3F8F3]">
                      <Camera className="h-4 w-4" /> {draft.photo ? "Change photo" : "Add a photo"}
                      <input
                        type="file"
                        accept="image/*"
                        className="sr-only"
                        onChange={async (event) => {
                          const file = event.currentTarget.files?.[0];
                          event.currentTarget.value = "";
                          if (!file) return;
                          try {
                            const photo = await resizeProfilePhoto(file);
                            setDraft((current) => ({ ...current, photo }));
                            setStatus("");
                          } catch (error) {
                            setStatus(error instanceof Error ? error.message : "Photo could not be uploaded.");
                          }
                        }}
                      />
                    </label>
                    {draft.photo && (
                      <button type="button" onClick={() => setDraft((current) => ({ ...current, photo: "" }))} className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-3 text-sm font-semibold text-[#9A3D38] hover:bg-[#FFF4F3]">
                        <Trash2 className="h-4 w-4" /> Remove
                      </button>
                    )}
                    <span className="text-xs text-[#718071]">Optional</span>
                  </div>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-semibold text-[#344534]">
                    Full name <span className="text-[#B2433B]" aria-hidden="true">*</span>
                    <input required autoComplete="name" value={draft.name} onChange={(event) => setDraft((current) => ({ ...current, name: event.currentTarget.value }))} className="mt-1.5 block min-h-11 w-full rounded-lg border border-[#CEDDCE] px-3 text-sm font-normal text-[#1C2B1C] outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/15" />
                  </label>
                  <label className="block text-sm font-semibold text-[#344534]">
                    Phone number <span className="text-[#B2433B]" aria-hidden="true">*</span>
                    <input required type="tel" autoComplete="tel" value={draft.phone} onChange={(event) => setDraft((current) => ({ ...current, phone: event.currentTarget.value }))} className="mt-1.5 block min-h-11 w-full rounded-lg border border-[#CEDDCE] px-3 text-sm font-normal text-[#1C2B1C] outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/15" />
                  </label>
                  <label className="block text-sm font-semibold text-[#344534]">
                    Email address
                    <input type="email" autoComplete="email" value={draft.email} onChange={(event) => setDraft((current) => ({ ...current, email: event.currentTarget.value }))} className="mt-1.5 block min-h-11 w-full rounded-lg border border-[#CEDDCE] px-3 text-sm font-normal text-[#1C2B1C] outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/15" />
                  </label>
                  <label className="block text-sm font-semibold text-[#344534]">
                    Location <span className="text-[#B2433B]" aria-hidden="true">*</span>
                    <input required autoComplete="address-level2" value={draft.location} onChange={(event) => setDraft((current) => ({ ...current, location: event.currentTarget.value }))} placeholder="Village, district" className="mt-1.5 block min-h-11 w-full rounded-lg border border-[#CEDDCE] px-3 text-sm font-normal text-[#1C2B1C] outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/15" />
                  </label>
                  <label className="block text-sm font-semibold text-[#344534]">
                    Preferred language
                    <select value={draft.language} onChange={(event) => setDraft((current) => ({ ...current, language: event.currentTarget.value }))} className="mt-1.5 block min-h-11 w-full rounded-lg border border-[#CEDDCE] bg-white px-3 text-sm font-normal text-[#1C2B1C] outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/15">
                      {["English", "Luganda", "Runyankole", "Lusoga", "Ateso", "Lugbara", "Acholi", "Swahili"] .map((language) => <option key={language}>{language}</option>)}
                    </select>
                  </label>
                  <label className="block text-sm font-semibold text-[#344534]">
                    Age range <span className="font-normal text-[#718071]">(optional)</span>
                    <select value={draft.ageRange} onChange={(event) => setDraft((current) => ({ ...current, ageRange: event.currentTarget.value }))} className="mt-1.5 block min-h-11 w-full rounded-lg border border-[#CEDDCE] bg-white px-3 text-sm font-normal text-[#1C2B1C] outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/15">
                      <option value="">Prefer not to say</option>
                      {["Under 25", "25-34", "35-44", "45-54", "55-64", "65 or older"].map((range) => <option key={range}>{range}</option>)}
                    </select>
                  </label>
                </div>
                <div className="mt-4 rounded-lg bg-[#F7F9F5] p-3.5">
                  <label className="flex items-start gap-2.5 text-sm text-[#405740]">
                    <input
                      type="checkbox"
                      checked={draft.genderConsent}
                      onChange={(event) => setDraft((current) => ({ ...current, genderConsent: event.currentTarget.checked, gender: event.currentTarget.checked ? current.gender : "" }))}
                      className="mt-0.5 h-4 w-4 accent-[#2E7D32]"
                    />
                    <span>I consent to sharing my gender to support inclusive agricultural services. This is optional.</span>
                  </label>
                  {draft.genderConsent && (
                    <label className="mt-3 block text-sm font-semibold text-[#344534]">
                      Gender
                      <select value={draft.gender} onChange={(event) => setDraft((current) => ({ ...current, gender: event.currentTarget.value }))} className="mt-1.5 block min-h-11 w-full rounded-lg border border-[#CEDDCE] bg-white px-3 text-sm font-normal text-[#1C2B1C] outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/15">
                        <option value="">Prefer not to say</option>
                        <option>Woman</option>
                        <option>Man</option>
                        <option>Non-binary</option>
                        <option>Self-describe</option>
                      </select>
                    </label>
                  )}
                </div>
              </section>

              <section className="border-t border-[#EAF3EA] pt-4">
                <h3 className="mb-3 text-sm font-bold text-[#1C2B1C]">Farming and contact</h3>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-semibold text-[#344534]">
                    Cooperative membership
                    <input value={draft.cooperative} onChange={(event) => setDraft((current) => ({ ...current, cooperative: event.currentTarget.value }))} placeholder="Name of cooperative, or leave blank" className="mt-1.5 block min-h-11 w-full rounded-lg border border-[#CEDDCE] px-3 text-sm font-normal text-[#1C2B1C] outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/15" />
                  </label>
                  <label className="block text-sm font-semibold text-[#344534]">
                    Farming experience
                    <select value={draft.experience} onChange={(event) => setDraft((current) => ({ ...current, experience: event.currentTarget.value }))} className="mt-1.5 block min-h-11 w-full rounded-lg border border-[#CEDDCE] bg-white px-3 text-sm font-normal text-[#1C2B1C] outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/15">
                      {["Less than 1 year", "1-5 years", "6-10 years", "11-20 years", "More than 20 years"].map((range) => <option key={range}>{range}</option>)}
                    </select>
                  </label>
                  <label className="block text-sm font-semibold text-[#344534]">
                    Preferred communication channel
                    <select value={draft.communicationChannel} onChange={(event) => setDraft((current) => ({ ...current, communicationChannel: event.currentTarget.value }))} className="mt-1.5 block min-h-11 w-full rounded-lg border border-[#CEDDCE] bg-white px-3 text-sm font-normal text-[#1C2B1C] outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/15">
                      {["SMS", "WhatsApp", "Voice call"].map((channel) => <option key={channel}>{channel}</option>)}
                    </select>
                  </label>
                  <label className="block text-sm font-semibold text-[#344534]">
                    Emergency or alternative contact <span className="font-normal text-[#718071]">(optional)</span>
                    <input type="tel" value={draft.alternativeContact} onChange={(event) => setDraft((current) => ({ ...current, alternativeContact: event.currentTarget.value }))} placeholder="Name and phone number" className="mt-1.5 block min-h-11 w-full rounded-lg border border-[#CEDDCE] px-3 text-sm font-normal text-[#1C2B1C] outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/15" />
                  </label>
                  <label className="block text-sm font-semibold text-[#344534]">
                    Farm size
                    <input value={draft.farmSize} onChange={(event) => setDraft((current) => ({ ...current, farmSize: event.currentTarget.value }))} className="mt-1.5 block min-h-11 w-full rounded-lg border border-[#CEDDCE] px-3 text-sm font-normal text-[#1C2B1C] outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/15" />
                  </label>
                  <label className="block text-sm font-semibold text-[#344534]">
                    Primary crops
                    <input value={draft.crops} onChange={(event) => setDraft((current) => ({ ...current, crops: event.currentTarget.value }))} className="mt-1.5 block min-h-11 w-full rounded-lg border border-[#CEDDCE] px-3 text-sm font-normal text-[#1C2B1C] outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/15" />
                  </label>
                  <label className="block text-sm font-semibold text-[#344534] sm:col-span-2">
                    Farming practice
                    <input value={draft.practice} onChange={(event) => setDraft((current) => ({ ...current, practice: event.currentTarget.value }))} className="mt-1.5 block min-h-11 w-full rounded-lg border border-[#CEDDCE] px-3 text-sm font-normal text-[#1C2B1C] outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/15" />
                  </label>
                </div>
              </section>
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