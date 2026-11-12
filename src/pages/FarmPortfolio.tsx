import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent, type ReactNode } from "react";
import { Check, Edit2, MapPin, PawPrint, Plus, Sprout, Trash2, Upload, X } from "lucide-react";
import AppLayout from "@/components/AppLayout";

const STORAGE_KEY = "mavunify.farm-management";
const CROPS = ["Arabica Coffee", "Robusta Coffee", "Beans", "Maize", "Banana", "Cassava", "Groundnuts", "Rice", "Other"];
const STAGES = ["Land preparation", "Planted", "Germination", "Vegetative", "Flowering", "Fruiting", "Mature", "Harvested"];
const STATUSES = ["Active", "Planned", "Completed", "Fallow"];
const INPUT = "w-full rounded-lg border border-[#D8EAD8] bg-white px-3 py-2.5 text-sm text-[#1C2B1C] outline-none focus:border-[#2E7D32] focus:ring-2 focus:ring-[#2E7D32]/10";

type Farm = {
  id: string; name: string; district: string; subCounty: string; parish: string; village: string;
  latitude: string; longitude: string; estimatedSize: string; sizeUnit: "acres" | "hectares";
  landAccess: string; waterSource: string; soilType: string; irrigation: string; farmingSystem: string;
  practiceStatus: string; photos: string[]; boundaryGeoJson: string;
};
type CropCycle = {
  id: string; farmId: string; crop: string; variety: string; areaPlanted: string;
  plantingDate: string; expectedHarvestDate: string; growthStage: string; currentStatus: string;
};
type LivestockGroup = {
  id: string; farmId: string; livestockType: string; breed: string; numberOfAnimals: string;
  productionPurpose: string; housingSystem: string; healthInformation: string; currentStatus: string;
};
type Portfolio = { farms: Farm[]; cropCycles: CropCycle[]; livestockGroups: LivestockGroup[] };
type Tab = "crops" | "livestock";

const EMPTY_PORTFOLIO: Portfolio = { farms: [], cropCycles: [], livestockGroups: [] };
const EMPTY_FARM: Omit<Farm, "id"> = {
  name: "New farm", district: "", subCounty: "", parish: "", village: "", latitude: "", longitude: "",
  estimatedSize: "", sizeUnit: "acres", landAccess: "", waterSource: "", soilType: "", irrigation: "Unknown",
  farmingSystem: "Mixed farming", practiceStatus: "Active", photos: [], boundaryGeoJson: "",
};

function id() { return globalThis.crypto?.randomUUID?.() ?? `record-${Date.now()}-${Math.random().toString(36).slice(2)}`; }
function readPortfolio(): Portfolio {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_PORTFOLIO;
    const saved = JSON.parse(raw);
    if (Array.isArray(saved.farms)) return {
      farms: saved.farms,
      cropCycles: Array.isArray(saved.cropCycles) ? saved.cropCycles : [],
      livestockGroups: Array.isArray(saved.livestockGroups) ? saved.livestockGroups : [],
    };
    const old = saved as Record<string, any>;
    const farm: Farm = {
      ...EMPTY_FARM, ...old, id: id(), name: old.name || "My farm",
      district: old.district || (old.location || "").split(",").at(-1)?.trim() || "",
      village: old.village || (old.location || "").split(",")[0]?.trim() || "",
      estimatedSize: old.estimatedSize || old.totalArea || "", sizeUnit: old.sizeUnit || old.unit || "acres",
      landAccess: old.landAccess || old.tenure || "", photos: old.photos || [], boundaryGeoJson: old.boundaryGeoJson || "",
    };
    return {
      farms: [farm],
      cropCycles: (old.plots || []).map((plot: any) => ({
        id: plot.id || id(), farmId: farm.id, crop: plot.crop, variety: "", areaPlanted: plot.area,
        plantingDate: "", expectedHarvestDate: "", growthStage: "Planted", currentStatus: plot.status || "Active",
      })),
      livestockGroups: [],
    };
  } catch { return EMPTY_PORTFOLIO; }
}
function Field({ label, children, optional = false }: { label: string; children: ReactNode; optional?: boolean }) {
  return <label className="block space-y-1.5"><span className="text-xs font-semibold text-[#5A6B5A]">{label}{optional && <span className="ml-1 font-normal text-[#8A9B8A]">Optional</span>}</span>{children}</label>;
}
function fileUrl(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader(); reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Photo could not be read.")); reader.readAsDataURL(file);
  });
}

export default function FarmPortfolio() {
  const [portfolio, setPortfolio] = useState<Portfolio>(readPortfolio);
  const [activeId, setActiveId] = useState("");
  const [tab, setTab] = useState<Tab>("crops");
  const [farmDraft, setFarmDraft] = useState<Farm | null>(null);
  const [cropDraft, setCropDraft] = useState<CropCycle | null>(null);
  const [stockDraft, setStockDraft] = useState<LivestockGroup | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const selectedId = activeId || portfolio.farms[0]?.id || "";
  const farm = portfolio.farms.find((item) => item.id === selectedId) ?? null;
  const crops = useMemo(() => portfolio.cropCycles.filter((item) => item.farmId === selectedId), [portfolio.cropCycles, selectedId]);
  const livestock = useMemo(() => portfolio.livestockGroups.filter((item) => item.farmId === selectedId), [portfolio.livestockGroups, selectedId]);

  useEffect(() => {
    try { window.localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio)); }
    catch { setMessage("Storage is full. Remove one or more farm photos and try again."); }
  }, [portfolio]);

  const addFarm = () => {
    const next = { ...EMPTY_FARM, id: id(), name: `Farm ${portfolio.farms.length + 1}` };
    setPortfolio((current) => ({ ...current, farms: [...current.farms, next] }));
    setActiveId(next.id); setFarmDraft(next); setMessage("");
  };
  const saveFarm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!farmDraft) return;
    if (farmDraft.boundaryGeoJson.trim()) {
      try {
        const shape = JSON.parse(farmDraft.boundaryGeoJson);
        if (!["Polygon", "MultiPolygon", "Feature"].includes(shape.type)) throw new Error();
      } catch { setError("Enter valid GeoJSON Polygon, MultiPolygon, or Feature data."); return; }
    }
    setPortfolio((current) => ({ ...current, farms: current.farms.map((item) => item.id === farmDraft.id ? farmDraft : item) }));
    setFarmDraft(null); setError(""); setMessage("Farm details saved on this device.");
  };
  const captureGps = () => {
    if (!navigator.geolocation) { setError("Location is not available in this browser."); return; }
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => setFarmDraft((current) => current ? { ...current, latitude: coords.latitude.toFixed(6), longitude: coords.longitude.toFixed(6) } : current),
      () => setError("Location was not shared. You can enter coordinates manually."), { enableHighAccuracy: true, timeout: 10000 },
    );
  };
  const addPhotos = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!farmDraft) return;
    const files = Array.from(event.currentTarget.files ?? []); event.currentTarget.value = "";
    if (files.some((file) => file.size > 1024 * 1024)) { setError("Each photo must be 1 MB or smaller."); return; }
    try {
      const photos = await Promise.all(files.map(fileUrl));
      setFarmDraft((current) => current ? { ...current, photos: [...current.photos, ...photos].slice(0, 5) } : current); setError("");
    } catch { setError("Could not read the selected photo."); }
  };
  const removeFarm = () => {
    if (!farm || portfolio.farms.length < 2 || !window.confirm(`Remove ${farm.name} and its records?`)) return;
    const remaining = portfolio.farms.filter((item) => item.id !== farm.id);
    setPortfolio((current) => ({ farms: current.farms.filter((item) => item.id !== farm.id), cropCycles: current.cropCycles.filter((item) => item.farmId !== farm.id), livestockGroups: current.livestockGroups.filter((item) => item.farmId !== farm.id) }));
    setActiveId(remaining[0].id); setMessage("Farm and its records removed.");
  };
  const saveCrop = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!cropDraft) return;
    setPortfolio((current) => ({ ...current, cropCycles: current.cropCycles.some((item) => item.id === cropDraft.id) ? current.cropCycles.map((item) => item.id === cropDraft.id ? cropDraft : item) : [...current.cropCycles, cropDraft] }));
    setCropDraft(null); setMessage("Crop cycle saved on this device.");
  };
  const saveLivestock = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); if (!stockDraft) return;
    setPortfolio((current) => ({ ...current, livestockGroups: current.livestockGroups.some((item) => item.id === stockDraft.id) ? current.livestockGroups.map((item) => item.id === stockDraft.id ? stockDraft : item) : [...current.livestockGroups, stockDraft] }));
    setStockDraft(null); setMessage("Livestock group saved on this device.");
  };
  const startCrop = (record?: CropCycle) => farm && setCropDraft(record ?? { id: id(), farmId: farm.id, crop: CROPS[0], variety: "", areaPlanted: "", plantingDate: "", expectedHarvestDate: "", growthStage: STAGES[0], currentStatus: "Active" });
  const startLivestock = (record?: LivestockGroup) => farm && setStockDraft(record ?? { id: id(), farmId: farm.id, livestockType: "Cattle", breed: "", numberOfAnimals: "1", productionPurpose: "Mixed", housingSystem: "", healthInformation: "", currentStatus: "Active" });
  const updateCrop = <K extends keyof CropCycle>(key: K, value: CropCycle[K]) => setCropDraft((current) => current ? { ...current, [key]: value } : current);
  const updateStock = <K extends keyof LivestockGroup>(key: K, value: LivestockGroup[K]) => setStockDraft((current) => current ? { ...current, [key]: value } : current);

  return <AppLayout><div className="mx-auto max-w-5xl space-y-6 px-4 py-6 sm:px-6 lg:py-8">
    <header className="flex flex-wrap items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#668066]">Farm portfolio</p><h1 className="mt-1 text-2xl font-bold text-[#1C2B1C]">Farm setup &amp; management</h1></div><button onClick={addFarm} className="inline-flex items-center gap-2 rounded-lg bg-[#2E7D32] px-4 py-2.5 text-sm font-bold text-white hover:bg-[#1B5E20]"><Plus className="h-4 w-4" /> Add farm</button></header>
    {!!portfolio.farms.length && <div className="flex flex-wrap items-center gap-3"><label htmlFor="farm-select" className="sr-only">Select farm</label><select id="farm-select" className={`${INPUT} max-w-sm font-semibold`} value={selectedId} onChange={(event) => { setActiveId(event.target.value); setMessage(""); }}>{portfolio.farms.map((item) => <option key={item.id} value={item.id}>{item.name}{item.district ? ` · ${item.district}` : ""}</option>)}</select><span className="text-sm text-[#718071]">{portfolio.farms.length} {portfolio.farms.length === 1 ? "farm" : "farms"}</span></div>}
    <p role="status" aria-live="polite" className="min-h-5 text-sm text-[#2E7D32]">{message}</p>
    {!farm ? <section className="rounded-xl border border-dashed border-[#B8D4B8] bg-white px-5 py-14 text-center"><Sprout className="mx-auto h-9 w-9 text-[#2E7D32]" /><h2 className="mt-3 font-bold text-[#1C2B1C]">Set up your first farm</h2><p className="mt-1 text-sm text-[#718071]">Add farm details, crop cycles, and livestock groups.</p><button onClick={addFarm} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#2E7D32] px-4 py-2.5 text-sm font-bold text-white"><Plus className="h-4 w-4" /> Add your first farm</button></section> : <>
      <section className="overflow-hidden rounded-xl border border-[#EAF3EA] bg-white shadow-xs"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EAF3EA] px-5 py-4 sm:px-6"><div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#F3F8F3] text-[#2E7D32]"><MapPin className="h-5 w-5" /></div><div><h2 className="font-bold text-[#1C2B1C]">Farm details</h2><p className="text-xs text-[#718071]">Location, land, water, and farm profile</p></div></div><div className="flex gap-2">{portfolio.farms.length > 1 && <button onClick={removeFarm} title="Remove farm" aria-label="Remove farm" className="rounded-lg p-2 text-[#718071] hover:bg-red-50 hover:text-[#C62828]"><Trash2 className="h-4 w-4" /></button>}<button onClick={() => { setFarmDraft(farm); setError(""); }} className="inline-flex items-center gap-2 rounded-lg border border-[#D8EAD8] px-3 py-2 text-sm font-semibold text-[#2E7D32]"><Edit2 className="h-4 w-4" /> Edit details</button></div></div>
        <div className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">{[["District", farm.district], ["Sub-county", farm.subCounty], ["Parish", farm.parish], ["Village", farm.village], ["Estimated size", farm.estimatedSize ? `${farm.estimatedSize} ${farm.sizeUnit}` : "Not set"], ["Land access", farm.landAccess || "Not specified"], ["Water source", farm.waterSource || "Not specified"], ["Soil type", farm.soilType || "Not known"], ["Irrigation", farm.irrigation], ["Farming system", farm.farmingSystem], ["GPS coordinates", farm.latitude && farm.longitude ? `${farm.latitude}, ${farm.longitude}` : "Not shared"], ["Practice status", farm.practiceStatus]].map(([label, value]) => <div key={label} className="border-b border-[#EAF3EA] px-5 py-3 sm:px-6"><p className="text-xs text-[#718071]">{label}</p><p className="mt-0.5 text-sm font-semibold text-[#1C2B1C]">{value}</p></div>)}</div>
        {farm.photos.length > 0 && <div className="flex gap-2 overflow-x-auto border-t border-[#EAF3EA] p-4">{farm.photos.map((photo, index) => <img key={`${farm.id}-${index}`} src={photo} alt={`${farm.name} photo ${index + 1}`} className="h-20 w-28 shrink-0 rounded-lg object-cover" />)}</div>}{farm.boundaryGeoJson && <p className="border-t border-[#EAF3EA] px-5 py-3 text-xs text-[#5A6B5A]">Mapped boundary saved as GeoJSON</p>}
      </section>
      <section><div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D8EAD8]"><div className="flex gap-5" role="tablist" aria-label="Farm production records"><button role="tab" aria-selected={tab === "crops"} onClick={() => setTab("crops")} className={`inline-flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-semibold ${tab === "crops" ? "border-[#2E7D32] text-[#2E7D32]" : "border-transparent text-[#718071]"}`}><Sprout className="h-4 w-4" /> Crop cycles ({crops.length})</button><button role="tab" aria-selected={tab === "livestock"} onClick={() => setTab("livestock")} className={`inline-flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-semibold ${tab === "livestock" ? "border-[#2E7D32] text-[#2E7D32]" : "border-transparent text-[#718071]"}`}><PawPrint className="h-4 w-4" /> Livestock ({livestock.length})</button></div><button onClick={() => tab === "crops" ? startCrop() : startLivestock()} className="mb-2 inline-flex items-center gap-2 rounded-lg bg-[#2E7D32] px-3 py-2 text-sm font-bold text-white"><Plus className="h-4 w-4" />{tab === "crops" ? "Add crop cycle" : "Add livestock group"}</button></div>
        {tab === "crops" ? crops.length ? <div className="mt-3 divide-y divide-[#EAF3EA] rounded-xl border border-[#EAF3EA] bg-white">{crops.map((cycle) => <article key={cycle.id} className="flex flex-wrap items-center gap-3 p-4 sm:px-5"><Sprout className="h-5 w-5 shrink-0 text-[#2E7D32]" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-[#1C2B1C]">{cycle.crop}{cycle.variety && ` · ${cycle.variety}`}</h3><span className="rounded-full bg-[#E7F4E8] px-2 py-0.5 text-[10px] font-bold text-[#2E7D32]">{cycle.currentStatus}</span></div><p className="mt-1 text-xs text-[#5A6B5A]">{cycle.areaPlanted} {farm.sizeUnit} · {cycle.growthStage}{cycle.plantingDate && ` · Planted ${cycle.plantingDate}`}{cycle.expectedHarvestDate && ` · Harvest ${cycle.expectedHarvestDate}`}</p></div><button onClick={() => startCrop(cycle)} aria-label="Edit crop cycle" className="rounded-lg p-2 text-[#5A6B5A]"><Edit2 className="h-4 w-4" /></button><button onClick={() => window.confirm(`Remove ${cycle.crop} crop cycle?`) && setPortfolio((current) => ({ ...current, cropCycles: current.cropCycles.filter((item) => item.id !== cycle.id) }))} aria-label="Remove crop cycle" className="rounded-lg p-2 text-[#718071] hover:text-[#C62828]"><Trash2 className="h-4 w-4" /></button></article>)}</div> : <EmptyState title="No crop cycles yet" detail="Track variety, planted area, dates, and growth stage." onAdd={() => startCrop()} /> : livestock.length ? <div className="mt-3 divide-y divide-[#EAF3EA] rounded-xl border border-[#EAF3EA] bg-white">{livestock.map((group) => <article key={group.id} className="flex flex-wrap items-center gap-3 p-4 sm:px-5"><PawPrint className="h-5 w-5 shrink-0 text-[#A87908]" /><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-[#1C2B1C]">{group.numberOfAnimals} {group.breed && `${group.breed} `}{group.livestockType}</h3><span className="rounded-full bg-[#E7F4E8] px-2 py-0.5 text-[10px] font-bold text-[#2E7D32]">{group.currentStatus}</span></div><p className="mt-1 text-xs text-[#5A6B5A]">{group.productionPurpose} · {group.housingSystem || "Housing not specified"}{group.healthInformation && ` · ${group.healthInformation}`}</p></div><button onClick={() => startLivestock(group)} aria-label="Edit livestock group" className="rounded-lg p-2 text-[#5A6B5A]"><Edit2 className="h-4 w-4" /></button><button onClick={() => window.confirm(`Remove ${group.livestockType} group?`) && setPortfolio((current) => ({ ...current, livestockGroups: current.livestockGroups.filter((item) => item.id !== group.id) }))} aria-label="Remove livestock group" className="rounded-lg p-2 text-[#718071] hover:text-[#C62828]"><Trash2 className="h-4 w-4" /></button></article>)}</div> : <EmptyState title="No livestock groups yet" detail="Track animal counts, purpose, housing, and health." onAdd={() => startLivestock()} />}
      </section>
    </>}
  </div>
  {farmDraft && <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" onMouseDown={(event) => event.target === event.currentTarget && setFarmDraft(null)}><section role="dialog" aria-modal="true" aria-labelledby="farm-title" className="max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-t-xl bg-white p-5 shadow-xl sm:rounded-xl sm:p-6"><div className="mb-5 flex justify-between"><div><h2 id="farm-title" className="text-lg font-bold text-[#1C2B1C]">Farm details</h2><p className="mt-1 text-sm text-[#718071]">GPS is only collected when you request it.</p></div><button onClick={() => setFarmDraft(null)} aria-label="Close" className="p-2"><X className="h-4 w-4" /></button></div><form onSubmit={saveFarm} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    <Field label="Farm name"><input className={INPUT} required value={farmDraft.name} onChange={(e) => setFarmDraft({ ...farmDraft, name: e.target.value })} /></Field><Field label="District"><input className={INPUT} required value={farmDraft.district} onChange={(e) => setFarmDraft({ ...farmDraft, district: e.target.value })} /></Field><Field label="Sub-county"><input className={INPUT} value={farmDraft.subCounty} onChange={(e) => setFarmDraft({ ...farmDraft, subCounty: e.target.value })} /></Field><Field label="Parish"><input className={INPUT} value={farmDraft.parish} onChange={(e) => setFarmDraft({ ...farmDraft, parish: e.target.value })} /></Field><Field label="Village"><input className={INPUT} value={farmDraft.village} onChange={(e) => setFarmDraft({ ...farmDraft, village: e.target.value })} /></Field><Field label="Estimated size"><div className="flex gap-2"><input className={INPUT} type="number" min="0" step="0.01" value={farmDraft.estimatedSize} onChange={(e) => setFarmDraft({ ...farmDraft, estimatedSize: e.target.value })} /><select className={`${INPUT} max-w-32`} value={farmDraft.sizeUnit} onChange={(e) => setFarmDraft({ ...farmDraft, sizeUnit: e.target.value as Farm["sizeUnit"] })}><option value="acres">Acres</option><option value="hectares">Hectares</option></select></div></Field>
    <Field label="Land ownership or access" optional><select className={INPUT} value={farmDraft.landAccess} onChange={(e) => setFarmDraft({ ...farmDraft, landAccess: e.target.value })}><option value="">Not specified</option>{["Owned", "Family land", "Leased", "Communal", "Borrowed", "Other"].map((x) => <option key={x}>{x}</option>)}</select></Field><Field label="Water source"><select className={INPUT} value={farmDraft.waterSource} onChange={(e) => setFarmDraft({ ...farmDraft, waterSource: e.target.value })}><option value="">Select water source</option>{["Rain-fed", "River or stream", "Lake", "Borehole or well", "Spring", "Tap or piped water", "Other"].map((x) => <option key={x}>{x}</option>)}</select></Field><Field label="Soil type" optional><select className={INPUT} value={farmDraft.soilType} onChange={(e) => setFarmDraft({ ...farmDraft, soilType: e.target.value })}><option value="">Unknown</option>{["Clay", "Loam", "Sandy", "Silt", "Volcanic", "Other"].map((x) => <option key={x}>{x}</option>)}</select></Field><Field label="Irrigation availability"><select className={INPUT} value={farmDraft.irrigation} onChange={(e) => setFarmDraft({ ...farmDraft, irrigation: e.target.value })}>{["Unknown", "Available", "Not available", "Seasonal"].map((x) => <option key={x}>{x}</option>)}</select></Field><Field label="Farming system"><select className={INPUT} value={farmDraft.farmingSystem} onChange={(e) => setFarmDraft({ ...farmDraft, farmingSystem: e.target.value })}>{["Mixed farming", "Crop farming", "Livestock farming", "Agroforestry", "Organic", "Other"].map((x) => <option key={x}>{x}</option>)}</select></Field>
    <Field label="Practice status"><select className={INPUT} value={farmDraft.practiceStatus} onChange={(e) => setFarmDraft({ ...farmDraft, practiceStatus: e.target.value })}>{["Active", "Transitioning", "Paused", "Inactive"].map((x) => <option key={x}>{x}</option>)}</select></Field>
    <div className="sm:col-span-2 lg:col-span-3"><Field label="GPS coordinates" optional><div className="grid grid-cols-2 gap-2"><input className={INPUT} aria-label="Latitude" placeholder="Latitude" value={farmDraft.latitude} onChange={(e) => setFarmDraft({ ...farmDraft, latitude: e.target.value })} /><input className={INPUT} aria-label="Longitude" placeholder="Longitude" value={farmDraft.longitude} onChange={(e) => setFarmDraft({ ...farmDraft, longitude: e.target.value })} /></div></Field><button type="button" onClick={captureGps} className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-[#2E7D32]"><MapPin className="h-3.5 w-3.5" /> Use my location</button></div>
    <div className="sm:col-span-2 lg:col-span-3"><Field label="Farm photos" optional><label className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-[#B8D4B8] px-4 py-3 text-sm font-semibold text-[#2E7D32]"><Upload className="h-4 w-4" /> Add photos (up to 5, max 1 MB each)<input type="file" accept="image/*" multiple className="sr-only" onChange={addPhotos} /></label>{farmDraft.photos.length > 0 && <div className="mt-2 flex gap-2">{farmDraft.photos.map((photo, index) => <div key={index} className="relative"><img src={photo} alt={`Farm photo ${index + 1}`} className="h-16 w-20 rounded-lg object-cover" /><button type="button" aria-label={`Remove photo ${index + 1}`} onClick={() => setFarmDraft({ ...farmDraft, photos: farmDraft.photos.filter((_, n) => n !== index) })} className="absolute -right-1 -top-1 rounded-full bg-white p-1 text-[#C62828] shadow"><X className="h-3 w-3" /></button></div>)}</div>}</Field></div>
    <div className="sm:col-span-2 lg:col-span-3"><Field label="Mapped boundary (GeoJSON)" optional><textarea className={`${INPUT} resize-y`} rows={3} value={farmDraft.boundaryGeoJson} onChange={(e) => setFarmDraft({ ...farmDraft, boundaryGeoJson: e.target.value })} placeholder="Paste a Polygon or MultiPolygon GeoJSON object" /></Field></div>{error && <p role="alert" className="text-sm text-[#C62828] sm:col-span-2 lg:col-span-3">{error}</p>}<div className="flex justify-end gap-2 border-t border-[#EAF3EA] pt-4 sm:col-span-2 lg:col-span-3"><button type="button" onClick={() => setFarmDraft(null)} className="rounded-lg px-4 py-2.5 text-sm text-[#5A6B5A]">Cancel</button><button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-[#2E7D32] px-4 py-2.5 text-sm font-bold text-white"><Check className="h-4 w-4" /> Save farm</button></div>
  </form></section></div>}
  {(cropDraft || stockDraft) && <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4" onMouseDown={(e) => e.target === e.currentTarget && (setCropDraft(null), setStockDraft(null))}><section role="dialog" aria-modal="true" aria-labelledby="record-title" className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-xl bg-white p-5 shadow-xl sm:rounded-xl sm:p-6"><div className="mb-5 flex justify-between"><div><h2 id="record-title" className="text-lg font-bold text-[#1C2B1C]">{cropDraft ? "Crop cycle" : "Livestock group"}</h2><p className="mt-1 text-sm text-[#718071]">Linked to {farm?.name}.</p></div><button onClick={() => { setCropDraft(null); setStockDraft(null); }} aria-label="Close"><X className="h-4 w-4" /></button></div>
    {cropDraft ? <form onSubmit={saveCrop} className="grid gap-4 sm:grid-cols-2"><Field label="Crop"><select className={INPUT} value={cropDraft.crop} onChange={(e) => updateCrop("crop", e.target.value)}>{CROPS.map((x) => <option key={x}>{x}</option>)}</select></Field><Field label="Variety" optional><input className={INPUT} value={cropDraft.variety} onChange={(e) => updateCrop("variety", e.target.value)} /></Field><Field label={`Area planted (${farm?.sizeUnit})`}><input className={INPUT} type="number" min="0.01" step="0.01" required value={cropDraft.areaPlanted} onChange={(e) => updateCrop("areaPlanted", e.target.value)} /></Field><Field label="Growth stage"><select className={INPUT} value={cropDraft.growthStage} onChange={(e) => updateCrop("growthStage", e.target.value)}>{STAGES.map((x) => <option key={x}>{x}</option>)}</select></Field><Field label="Planting date"><input className={INPUT} type="date" value={cropDraft.plantingDate} onChange={(e) => updateCrop("plantingDate", e.target.value)} /></Field><Field label="Expected harvest date"><input className={INPUT} type="date" value={cropDraft.expectedHarvestDate} onChange={(e) => updateCrop("expectedHarvestDate", e.target.value)} /></Field><Field label="Current status"><select className={INPUT} value={cropDraft.currentStatus} onChange={(e) => updateCrop("currentStatus", e.target.value)}>{STATUSES.map((x) => <option key={x}>{x}</option>)}</select></Field><Actions onCancel={() => setCropDraft(null)} label="Save crop cycle" /></form> : stockDraft && <form onSubmit={saveLivestock} className="grid gap-4 sm:grid-cols-2"><Field label="Livestock type"><select className={INPUT} value={stockDraft.livestockType} onChange={(e) => updateStock("livestockType", e.target.value)}>{["Cattle", "Goats", "Sheep", "Pigs", "Chickens", "Ducks", "Turkeys", "Rabbits", "Other"].map((x) => <option key={x}>{x}</option>)}</select></Field><Field label="Breed" optional><input className={INPUT} value={stockDraft.breed} onChange={(e) => updateStock("breed", e.target.value)} /></Field><Field label="Number of animals"><input className={INPUT} type="number" min="1" step="1" required value={stockDraft.numberOfAnimals} onChange={(e) => updateStock("numberOfAnimals", e.target.value)} /></Field><Field label="Production purpose"><select className={INPUT} value={stockDraft.productionPurpose} onChange={(e) => updateStock("productionPurpose", e.target.value)}>{["Mixed", "Meat", "Milk", "Eggs", "Breeding", "Draft", "Other"].map((x) => <option key={x}>{x}</option>)}</select></Field><Field label="Housing system"><select className={INPUT} value={stockDraft.housingSystem} onChange={(e) => updateStock("housingSystem", e.target.value)}><option value="">Not specified</option>{["Free range", "Open grazing", "Zero grazing", "Semi-intensive", "Deep litter", "Other"].map((x) => <option key={x}>{x}</option>)}</select></Field><Field label="Current status"><select className={INPUT} value={stockDraft.currentStatus} onChange={(e) => updateStock("currentStatus", e.target.value)}>{STATUSES.filter((x) => x !== "Fallow").map((x) => <option key={x}>{x}</option>)}</select></Field><div className="sm:col-span-2"><Field label="Vaccination or health information" optional><textarea className={`${INPUT} resize-y`} rows={3} value={stockDraft.healthInformation} onChange={(e) => updateStock("healthInformation", e.target.value)} placeholder="Vaccination dates, treatments, health notes" /></Field></div><Actions onCancel={() => setStockDraft(null)} label="Save livestock group" /></form>}
  </section></div>}
  </AppLayout>;
}

function EmptyState({ title, detail, onAdd }: { title: string; detail: string; onAdd: () => void }) {
  return <div className="py-12 text-center"><h3 className="font-bold text-[#1C2B1C]">{title}</h3><p className="mt-1 text-sm text-[#718071]">{detail}</p><button onClick={onAdd} className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#D8EAD8] px-4 py-2 text-sm font-semibold text-[#2E7D32]"><Plus className="h-4 w-4" /> Add record</button></div>;
}
function Actions({ onCancel, label }: { onCancel: () => void; label: string }) {
  return <div className="flex justify-end gap-2 border-t border-[#EAF3EA] pt-4 sm:col-span-2"><button type="button" onClick={onCancel} className="rounded-lg px-4 py-2.5 text-sm font-semibold text-[#5A6B5A]">Cancel</button><button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-[#2E7D32] px-4 py-2.5 text-sm font-bold text-white"><Check className="h-4 w-4" /> {label}</button></div>;
}
