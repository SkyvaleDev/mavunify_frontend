import { useCallback, useEffect, useState } from "react";
import {
  Droplets, Wind, Thermometer, Search, Sun, Cloud, Gauge, Eye,
  Compass, Sunrise, Sunset, Leaf, MapPin, Loader2,
  Moon, CloudSun, CloudMoon, Cloudy, CloudFog, CloudDrizzle, CloudRain,
  CloudRainWind, CloudHail, CloudSnow, CloudLightning,
} from "lucide-react";
import AppLayout from "@/components/AppLayout";

const FORECAST_BASE = "https://api.open-meteo.com/v1/forecast";
const AIR_BASE = "https://air-quality-api.open-meteo.com/v1/air-quality";
const GEO_BASE = "https://geocoding-api.open-meteo.com/v1/search";
// Backup provider (no API key): wttr.in — used automatically if Open-Meteo fails
const WTTR_BASE = "https://wttr.in";
// Second backup provider: WeatherAPI.com — requires a free API key.
// Get one at https://www.weatherapi.com/my/ then set VITE_WEATHERAPI_KEY in .env.local
const WEATHERAPI_BASE = "https://api.weatherapi.com/v1";
const WEATHERAPI_KEY: string | undefined = import.meta.env.VITE_WEATHERAPI_KEY;

/* ──────────────────────────── helpers ──────────────────────────── */

// WMO weather interpretation codes: https://open-meteo.com/en/docs
function getWeatherInfo(code: number | undefined): { condition: string; icon: string } {
  const map: Record<number, { condition: string; icon: string }> = {
    0: { condition: "Clear sky", icon: "☀️" },
    1: { condition: "Mainly clear", icon: "🌤️" },
    2: { condition: "Partly cloudy", icon: "⛅" },
    3: { condition: "Overcast", icon: "☁️" },
    45: { condition: "Fog", icon: "🌫️" },
    48: { condition: "Rime fog", icon: "🌫️" },
    51: { condition: "Light drizzle", icon: "🌦️" },
    53: { condition: "Moderate drizzle", icon: "🌦️" },
    55: { condition: "Dense drizzle", icon: "🌦️" },
    56: { condition: "Freezing drizzle", icon: "🌧️" },
    57: { condition: "Dense freezing drizzle", icon: "🌧️" },
    61: { condition: "Slight rain", icon: "🌧️" },
    63: { condition: "Moderate rain", icon: "🌧️" },
    65: { condition: "Heavy rain", icon: "🌧️" },
    66: { condition: "Freezing rain", icon: "🌧️" },
    67: { condition: "Heavy freezing rain", icon: "🌧️" },
    71: { condition: "Slight snow", icon: "🌨️" },
    73: { condition: "Moderate snow", icon: "🌨️" },
    75: { condition: "Heavy snow", icon: "🌨️" },
    77: { condition: "Snow grains", icon: "🌨️" },
    80: { condition: "Light showers", icon: "🌦️" },
    81: { condition: "Moderate showers", icon: "🌧️" },
    82: { condition: "Violent showers", icon: "🌧️" },
    85: { condition: "Snow showers", icon: "🌨️" },
    86: { condition: "Heavy snow showers", icon: "🌨️" },
    95: { condition: "Thunderstorm", icon: "⛈️" },
    96: { condition: "Thunderstorm, hail", icon: "⛈️" },
    99: { condition: "Thunderstorm, heavy hail", icon: "⛈️" },
  };
  return map[code ?? -1] ?? { condition: "Unknown", icon: "🌡️" };
}

// wttr.in and WeatherAPI.com use WorldWeatherOnline condition codes —
// map them to the closest WMO code so existing icons/conditions work unchanged.
function wwoToWmo(wwo: number): number {
  const map: Record<number, number> = {
    // Shared WWO codes (wttr.in)
    113: 0, 116: 2, 119: 3, 122: 3, 143: 45, 176: 51, 179: 71, 182: 66,
    185: 66, 200: 95, 227: 71, 230: 71, 248: 45, 260: 48, 263: 51, 266: 51,
    281: 56, 284: 56, 293: 61, 296: 61, 299: 63, 302: 63, 305: 65, 308: 65,
    311: 66, 314: 66, 317: 66, 320: 66, 323: 71, 326: 73, 329: 75, 332: 75,
    335: 85, 338: 86, 350: 77, 353: 80, 356: 81, 359: 82, 362: 80, 365: 81,
    368: 80, 371: 81, 374: 80, 377: 81, 386: 95, 389: 95, 392: 95, 395: 96,
    398: 95, 401: 95, 404: 95, 407: 95, 410: 95, 413: 96, 416: 95, 419: 96,
    422: 95, 425: 96, 428: 96, 431: 96, 434: 96, 437: 96, 440: 96, 443: 96,
    446: 96, 449: 96, 452: 96,
    // WeatherAPI.com condition codes
    1000: 0, 1003: 2, 1006: 3, 1009: 3, 1030: 45, 1063: 61, 1066: 71,
    1069: 66, 1072: 56, 1087: 95, 1114: 71, 1117: 75, 1135: 45, 1147: 48,
    1150: 51, 1153: 51, 1168: 56, 1171: 56, 1180: 61, 1183: 61, 1186: 63,
    1189: 63, 1192: 65, 1195: 65, 1198: 66, 1201: 66, 1204: 66, 1207: 66,
    1210: 71, 1213: 73, 1216: 75, 1219: 75, 1222: 85, 1225: 86, 1232: 77,
    1240: 80, 1243: 81, 1246: 82, 1249: 80, 1252: 81, 1255: 85, 1258: 86,
    1261: 77, 1264: 77, 1273: 95, 1276: 95, 1279: 96, 1282: 96,
  };
  return map[wwo] ?? 3;
}

// WeatherAPI reports air quality as a US EPA index (1-6); approximate US AQI
function epaIndexToAqi(epa: number | null): number | null {
  if (epa == null) return null;
  const approx: Record<number, number> = { 1: 25, 2: 75, 3: 125, 4: 175, 5: 250, 6: 350 };
  return approx[epa] ?? null;
}

function num(v: unknown): number | null {
  const n = typeof v === "string" ? Number(v) : typeof v === "number" ? v : NaN;
  return Number.isFinite(n) ? n : null;
}

// wttr.in hourly "time" is like "0", "300", "1300" (HHMM, local)
function wttrHourLabel(t: string): string {
  const padded = t.padStart(4, "0");
  const h24 = Number(padded.slice(0, 2));
  return `${h24 % 12 || 12} ${h24 >= 12 ? "PM" : "AM"}`;
}

// wttr.in astronomy times look like "06:12 AM"
function wttrClock(t?: string): string {
  return t && t.trim() ? t.trim() : "—";
}

// Accurate WMO-code icon with condition-based colour
function WeatherGlyph({
  code,
  isDay = true,
  className = "w-6 h-6",
  variant = "auto", // "auto" | "colored" | "light" | "dark" | "white"
}: {
  code: number;
  isDay?: boolean;
  className?: string;
  variant?: "auto" | "colored" | "light" | "dark" | "white";
}) {
  const Icon =
    code === 0 ? (isDay ? Sun : Moon)
    : code === 1 || code === 2 ? (isDay ? CloudSun : CloudMoon)
    : code === 3 ? Cloudy
    : code === 45 || code === 48 ? CloudFog
    : code === 51 || code === 53 || code === 55 || code === 56 || code === 57 ? CloudDrizzle
    : code === 61 || code === 63 || code === 80 || code === 81 ? CloudRain
    : code === 65 || code === 82 ? CloudRainWind
    : code === 66 || code === 67 ? CloudHail
    : code === 71 || code === 73 || code === 75 || code === 77 || code === 85 || code === 86 ? CloudSnow
    : code === 95 || code === 96 || code === 99 ? CloudLightning
    : Cloud;

  // Colored by weather type
  const coloredTone =
    code === 0 || code === 1 ? "text-[#F9A825]"        // sunny yellow
    : code === 2 ? "text-[#F9B233]"                    // partly cloudy warm
    : code === 3 || code === 45 || code === 48 ? "text-[#78909C]"  // cloudy/fog grey
    : code === 51 || code === 53 || code === 55 || code === 56 || code === 57
      || code === 61 || code === 63 || code === 65 || code === 66 || code === 67
      || code === 80 || code === 81 || code === 82 ? "text-[#1976D2]"  // rain blue
    : code === 71 || code === 73 || code === 75 || code === 77 || code === 85 || code === 86
      ? "text-[#64B5F6]"                               // snow light blue
    : code === 95 || code === 96 || code === 99 ? "text-[#7E57C2]"    // thunder purple
    : "text-[#5A6B5A]";

  const tone =
    variant === "white"
      ? "text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.4)]"
    : variant === "dark"
      ? "text-[#1F2937]"
    : variant === "light"
      ? "text-[#374151]"
    : variant === "colored"
      ? coloredTone
    : "auto" === variant
      ? coloredTone
      : coloredTone;

  const strokeWidth = variant === "white" ? 2.25 : 2;

  return <Icon className={`${tone} ${className}`} strokeWidth={strokeWidth} aria-hidden="true" />;
}

function windDir(deg: number | undefined): string {
  if (deg == null || Number.isNaN(deg)) return "—";
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  return dirs[Math.round(deg / 22.5) % 16];
}

// Open-Meteo returns local time strings like "2026-11-07T15:00"
function fmtClock(iso?: string): string {
  if (!iso) return "—";
  const m = iso.match(/T(\d{2}):(\d{2})/);
  if (!m) return "—";
  const h24 = Number(m[1]);
  const h12 = h24 % 12 || 12;
  return `${h12}:${m[2]} ${h24 >= 12 ? "PM" : "AM"}`;
}

function fmtHour(iso: string): string {
  const m = iso.match(/T(\d{2}):/);
  if (!m) return "—";
  const h24 = Number(m[1]);
  return `${h24 % 12 || 12} ${h24 >= 12 ? "PM" : "AM"}`;
}

function weekday(date: string): string {
  const d = new Date(`${date}T12:00:00`);
  return Number.isNaN(d.getTime()) ? date : d.toLocaleDateString(undefined, { weekday: "short" });
}

function aqiInfo(aqi: number | null): { label: string; color: string } {
  if (aqi == null) return { label: "No data", color: "#8A9B8A" };
  if (aqi <= 50) return { label: "Good", color: "#2E7D32" };
  if (aqi <= 100) return { label: "Moderate", color: "#F9A825" };
  if (aqi <= 150) return { label: "Unhealthy (sensitive)", color: "#EF6C00" };
  if (aqi <= 200) return { label: "Unhealthy", color: "#E53935" };
  if (aqi <= 300) return { label: "Very unhealthy", color: "#8E24AA" };
  return { label: "Hazardous", color: "#6D4C41" };
}

/* ──────────────────────────── types ──────────────────────────── */

type CurrentWeather = {
  temp: number | null;
  condition: string;
  icon: string;
  code: number;
  feelsLike: number | null;
  humidity: number | null;
  wind: number | null;
  gusts: number | null;
  windDir: string;
  windDeg: number | null;
  pressure: number | null;
  cloud: number | null;
  dew: number | null;
  uv: number | null;
  visibility: number | null;
  isDay: boolean;
};

type HourPoint = {
  time: string;
  label: string;
  temp: number;
  rain: number;
  icon: string;
  code: number;
  isDay: boolean;
};

type DayPoint = {
  date: string;
  day: string;
  icon: string;
  code: number;
  desc: string;
  high: number;
  low: number;
  rain: number;
  precip: number;
  uv: number;
  wind: number;
  gusts: number;
  windDir: string;
  sunrise: string;
  sunset: string;
};

type AirQuality = {
  usAqi: number | null;
  pm25: number | null;
  pm10: number | null;
  ozone: number | null;
  uv: number | null;
};

type Soil = {
  temp0: number | null;
  moisture0: number | null;
  et0: number | null;
};

const EMPTY_CURRENT: CurrentWeather = {
  temp: null, condition: "—", icon: "🌡️", code: 3, feelsLike: null, humidity: null,
  wind: null, gusts: null, windDir: "—", windDeg: null, pressure: null,
  cloud: null, dew: null, uv: null, visibility: null, isDay: true,
};

const EMPTY_AIR: AirQuality = { usAqi: null, pm25: null, pm10: null, ozone: null, uv: null };
const EMPTY_SOIL: Soil = { temp0: null, moisture0: null, et0: null };

const DEFAULT_COORDS = { lat: 1.082, lon: 34.175 };

const PRESET_LOCATIONS = [
  { name: "Mbale", region: "Eastern Uganda", lat: 0.53, lon: 34.33 },
  { name: "Kampala", region: "Central Uganda", lat: 0.31, lon: 32.58 },
  { name: "Jinja", region: "Eastern Uganda", lat: 0.45, lon: 33.2 },
  { name: "Gulu", region: "Northern Uganda", lat: 3.47, lon: 32.3 },
  { name: "Fort Portal", region: "Western Uganda", lat: 0.62, lon: 30.23 },
  { name: "Masaka", region: "Central Uganda", lat: -0.33, lon: 31.42 },
  { name: "Soroti", region: "Eastern Uganda", lat: 1.71, lon: 33.6 },
  { name: "Lira", region: "Northern Uganda", lat: 2.25, lon: 32.9 },
  { name: "Mbarara", region: "Western Uganda", lat: -0.6, lon: 30.65 },
  { name: "Kabale", region: "Southwestern Uganda", lat: -1.25, lon: 30.0 },
  { name: "Hoima", region: "Western Uganda", lat: 1.43, lon: 31.35 },
  { name: "Arua", region: "West Nile", lat: 3.02, lon: 30.91 },
  { name: "Entebbe", region: "Central Uganda", lat: 0.05, lon: 32.46 },
  { name: "Mukono", region: "Central Uganda", lat: 0.35, lon: 32.75 },
  { name: "Tororo", region: "Eastern Uganda", lat: 0.68, lon: 34.18 },
  { name: "Kasese", region: "Western Uganda", lat: 0.18, lon: 30.08 },
  { name: "Mityana", region: "Central Uganda", lat: 0.42, lon: 32.04 },
  { name: "Adjumani", region: "West Nile", lat: 3.38, lon: 31.57 },
];

// How many area tiles are shown at once; the list cycles through the rest
const TILES_PER_PAGE = 6;

type PresetSummary = {
  temp: number | null;
  icon: string;
  code: number;
  isDay: boolean;
  condition: string;
  wind: number | null;
};

/* ──────────────────────────── component ──────────────────────────── */

export default function Weather() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationLabel, setLocationLabel] = useState("Mbale, Uganda");

  const [activePreset, setActivePreset] = useState<string | null>("Mbale");
  const [tileOffset, setTileOffset] = useState(0);

  const [current, setCurrent] = useState<CurrentWeather>(EMPTY_CURRENT);
  const [hourly, setHourly] = useState<HourPoint[]>([]);
  const [daily, setDaily] = useState<DayPoint[]>([]);
  const [air, setAir] = useState<AirQuality>(EMPTY_AIR);
  const [soil, setSoil] = useState<Soil>(EMPTY_SOIL);

  const [locationInput, setLocationInput] = useState("");
  const [searching, setSearching] = useState(false);
  const [presetWeather, setPresetWeather] = useState<Record<string, PresetSummary>>({});

  // Backup (wttr.in) current-conditions summary for a single area
  const fetchWttrSummary = useCallback(async (lat: number, lon: number): Promise<PresetSummary | null> => {
    try {
      const res = await fetch(`${WTTR_BASE}/${lat},${lon}?format=j1`);
      if (!res.ok) return null;
      const data = await res.json();
      const c = data?.current_condition?.[0];
      if (!c) return null;
      const code = wwoToWmo(num(c.weatherCode) ?? 0);
      const info = getWeatherInfo(code);
      const hour = new Date().getHours();
      return {
        temp: num(c.temp_C),
        icon: info.icon,
        code,
        isDay: hour >= 6 && hour < 18,
        condition: c.weatherDesc?.[0]?.value?.trim() || info.condition,
        wind: num(c.windspeedKmph),
      };
    } catch {
      return null;
    }
  }, []);

  // Backup (WeatherAPI.com) current-conditions summary for a single area.
  // Only runs when VITE_WEATHERAPI_KEY is set.
  const fetchWeatherApiSummary = useCallback(
    async (lat: number, lon: number): Promise<PresetSummary | null> => {
      if (!WEATHERAPI_KEY) return null;
      try {
        const url = `${WEATHERAPI_BASE}/current.json?key=${WEATHERAPI_KEY}&q=${lat},${lon}&aqi=no`;
        const res = await fetch(url);
        if (!res.ok) return null;
        const data = await res.json();
        const c = data?.current;
        if (!c) return null;
        const code = wwoToWmo(c.condition?.code ?? 0);
        const info = getWeatherInfo(code);
        return {
          temp: num(c.temp_c),
          icon: info.icon,
          code,
          isDay: c.is_day === 1,
          condition: c.condition?.text?.trim() || info.condition,
          wind: num(c.wind_kph),
        };
      } catch {
        return null;
      }
    },
    []
  );

  // Lightweight current-conditions summaries for each saved area tile
  const loadPresetSummaries = useCallback(async () => {
    try {
      const params = new URLSearchParams({
        latitude: PRESET_LOCATIONS.map((l) => l.lat).join(","),
        longitude: PRESET_LOCATIONS.map((l) => l.lon).join(","),
        current: "temperature_2m,weather_code,wind_speed_10m,is_day",
        timezone: "auto",
      });
      const res = await fetch(`${FORECAST_BASE}?${params.toString()}`);
      if (!res.ok) throw new Error(`Weather service returned ${res.status}`);
      const data = await res.json();
      const rows = Array.isArray(data) ? data : [data];
      const next: Record<string, PresetSummary> = {};
      rows.forEach((row, i) => {
        const loc = PRESET_LOCATIONS[i];
        if (!loc) return;
        const info = getWeatherInfo(row?.current?.weather_code);
        next[loc.name] = {
          temp: row?.current?.temperature_2m ?? null,
          icon: info.icon,
          code: row?.current?.weather_code ?? 3,
          isDay: row?.current?.is_day !== 0,
          condition: info.condition,
          wind: row?.current?.wind_speed_10m ?? null,
        };
      });
      setPresetWeather(next);
    } catch {
      // Open-Meteo unavailable — try WeatherAPI.com (if keyed), then wttr.in
      const fetchSummary = WEATHERAPI_KEY ? fetchWeatherApiSummary : fetchWttrSummary;
      const entries = await Promise.all(
        PRESET_LOCATIONS.map(async (loc) => [loc.name, await fetchSummary(loc.lat, loc.lon)] as const)
      );
      const next: Record<string, PresetSummary> = {};
      entries.forEach(([name, summary]) => {
        if (summary) next[name] = summary;
      });
      if (Object.keys(next).length > 0) {
        setPresetWeather(next);
        return;
      }
      if (WEATHERAPI_KEY) {
        const fallback = await Promise.all(
          PRESET_LOCATIONS.map(async (loc) => [loc.name, await fetchWttrSummary(loc.lat, loc.lon)] as const)
        );
        const alt: Record<string, PresetSummary> = {};
        fallback.forEach(([name, summary]) => {
          if (summary) alt[name] = summary;
        });
        if (Object.keys(alt).length > 0) setPresetWeather(alt);
      }
    }
  }, [fetchWeatherApiSummary, fetchWttrSummary]);

  // Backup provider: load the full forecast from wttr.in into the same state
  // shapes used by Open-Meteo. Returns true on success.
  const applyWttrFallback = useCallback(
    async (lat: number, lon: number, preset: string | null): Promise<boolean> => {
      try {
        const res = await fetch(`${WTTR_BASE}/${lat},${lon}?format=j1`);
        if (!res.ok) return false;
        const data = await res.json();
        const c = data?.current_condition?.[0];
        const days = data?.weather ?? [];
        if (!c || days.length === 0) return false;

        const code = wwoToWmo(num(c.weatherCode) ?? 0);
        const info = getWeatherInfo(code);
        const hour = new Date().getHours();
        const isDay = hour >= 6 && hour < 18;

        setCurrent({
          temp: num(c.temp_C) != null ? Math.round(num(c.temp_C)!) : null,
          condition: c.weatherDesc?.[0]?.value?.trim() || info.condition,
          icon: info.icon,
          code,
          feelsLike: num(c.FeelsLikeC) != null ? Math.round(num(c.FeelsLikeC)!) : null,
          humidity: num(c.humidity) != null ? Math.round(num(c.humidity)!) : null,
          wind: num(c.windspeedKmph) != null ? Math.round(num(c.windspeedKmph)!) : null,
          gusts: num(days[0]?.hourly?.[0]?.WindGustKmph) != null
            ? Math.round(num(days[0].hourly[0].WindGustKmph)!)
            : null,
          windDir: c.winddir16Point || windDir(num(c.winddirDegree) ?? undefined),
          windDeg: num(c.winddirDegree),
          pressure: num(c.pressure) != null ? Math.round(num(c.pressure)!) : null,
          cloud: num(c.cloudcover) != null ? Math.round(num(c.cloudcover)!) : null,
          dew: num(days[0]?.hourly?.[0]?.DewPointC) != null
            ? Math.round(num(days[0].hourly[0].DewPointC)!)
            : null,
          uv: num(c.uvIndex),
          visibility: num(c.visibility) != null ? Math.round(num(c.visibility)! * 10) / 10 : null,
          isDay,
        });

        if (preset) {
          setPresetWeather((prev) => ({
            ...prev,
            [preset]: {
              temp: num(c.temp_C),
              icon: info.icon,
              code,
              isDay,
              condition: c.weatherDesc?.[0]?.value?.trim() || info.condition,
              wind: num(c.windspeedKmph),
            },
          }));
        }

        // Next ~24h from the flattened hourly series, starting nearest to now
        const flat: Array<{ h: Record<string, unknown>; date: string }> = [];
        days.forEach((d: { date?: string; hourly?: Array<Record<string, unknown>> }) => {
          (d.hourly ?? []).forEach((h) => flat.push({ h, date: d.date ?? "" }));
        });
        const nowStart = new Date();
        nowStart.setMinutes(0, 0, 0);
        let startIdx = flat.findIndex(({ h, date }) => {
          const t = String(h.time ?? "0").padStart(4, "0");
          const d = new Date(`${date}T${t.slice(0, 2)}:${t.slice(2)}:00`);
          return d.getTime() >= nowStart.getTime();
        });
        if (startIdx < 0) startIdx = 0;
        setHourly(
          flat.slice(startIdx, startIdx + 24).map(({ h }, i) => {
            const hCode = wwoToWmo(num(h.weatherCode) ?? 0);
            return {
              time: `${i}`,
              label: i === 0 ? "Now" : wttrHourLabel(String(h.time ?? "0")),
              temp: Math.round(num(h.tempC) ?? 0),
              rain: Math.round(num(h.chanceofrain) ?? 0),
              icon: getWeatherInfo(hCode).icon,
              code: hCode,
              isDay: (() => {
                const t = String(h.time ?? "0").padStart(4, "0");
                const hh = Number(t.slice(0, 2));
                return hh >= 6 && hh < 18;
              })(),
            };
          })
        );

        setDaily(
          days.map((d: Record<string, unknown>, i: number) => {
            const hourlyArr = (d.hourly ?? []) as Array<Record<string, unknown>>;
            const midday = hourlyArr[Math.min(4, hourlyArr.length - 1)] ?? {};
            const dCode = wwoToWmo(num(midday.weatherCode) ?? 0);
            const dInfo = getWeatherInfo(dCode);
            const precip = hourlyArr.reduce((sum, h) => sum + (num(h.precipMM) ?? 0), 0);
            const rain = Math.max(0, ...hourlyArr.map((h) => num(h.chanceofrain) ?? 0));
            const windMax = Math.max(0, ...hourlyArr.map((h) => num(h.windspeedKmph) ?? 0));
            const gusts = Math.max(0, ...hourlyArr.map((h) => num(h.WindGustKmph) ?? 0));
            const windiest = hourlyArr.reduce(
              (best, h) => ((num(h.windspeedKmph) ?? 0) > (num(best?.windspeedKmph) ?? 0) ? h : best),
              hourlyArr[0] ?? {}
            );
            const astroArr = (d.astronomy ?? []) as Array<Record<string, unknown>>;
            const astro = astroArr[0] ?? {};
            const middayDesc = ((midday.weatherDesc ?? []) as Array<{ value?: string }>)[0]?.value?.trim();
            const date = String(d.date ?? "");
            return {
              date,
              day: i === 0 ? "Today" : i === 1 ? "Tomorrow" : weekday(date),
              icon: dInfo.icon,
              code: dCode,
              desc: middayDesc || dInfo.condition,
              high: Math.round(num(d.maxtempC) ?? 0),
              low: Math.round(num(d.mintempC) ?? 0),
              rain,
              precip: Math.round(precip * 10) / 10,
              uv: num(d.uvIndex) ?? 0,
              wind: Math.round(windMax),
              gusts: Math.round(gusts),
              windDir: (windiest.winddir16Point as string) || windDir(num(windiest.winddirDegree) ?? undefined),
              sunrise: wttrClock(astro.sunrise as string | undefined),
              sunset: wttrClock(astro.sunset as string | undefined),
            };
          })
        );

        // wttr.in has no air-quality or soil data
        setAir(EMPTY_AIR);
        setSoil(EMPTY_SOIL);
        return true;
      } catch {
        return false;
      }
    },
    []
  );

  // Second backup provider: full forecast from WeatherAPI.com (needs API key).
  // Returns true on success.
  const applyWeatherApiFallback = useCallback(
    async (lat: number, lon: number, preset: string | null): Promise<boolean> => {
      if (!WEATHERAPI_KEY) return false;
      try {
        const url = `${WEATHERAPI_BASE}/forecast.json?key=${WEATHERAPI_KEY}&q=${lat},${lon}&days=7&aqi=yes&alerts=no`;
        const res = await fetch(url);
        if (!res.ok) return false;
        const data = await res.json();
        const c = data?.current;
        const forecastDays = data?.forecast?.forecastday ?? [];
        if (!c || forecastDays.length === 0) return false;

        const code = wwoToWmo(c.condition?.code ?? 0);
        const info = getWeatherInfo(code);
        const isDay = c.is_day === 1;

        setCurrent({
          temp: num(c.temp_c) != null ? Math.round(num(c.temp_c)!) : null,
          condition: c.condition?.text?.trim() || info.condition,
          icon: info.icon,
          code,
          feelsLike: num(c.feelslike_c) != null ? Math.round(num(c.feelslike_c)!) : null,
          humidity: num(c.humidity) != null ? Math.round(num(c.humidity)!) : null,
          wind: num(c.wind_kph) != null ? Math.round(num(c.wind_kph)!) : null,
          gusts: num(c.gust_kph) != null ? Math.round(num(c.gust_kph)!) : null,
          windDir: c.wind_dir || windDir(num(c.wind_degree) ?? undefined),
          windDeg: num(c.wind_degree),
          pressure: num(c.pressure_mb) != null ? Math.round(num(c.pressure_mb)!) : null,
          cloud: num(c.cloud) != null ? Math.round(num(c.cloud)!) : null,
          dew: num(c.dewpoint_c) != null ? Math.round(num(c.dewpoint_c)!) : null,
          uv: num(c.uv),
          visibility: num(c.vis_km) != null ? Math.round(num(c.vis_km)! * 10) / 10 : null,
          isDay,
        });

        if (preset) {
          setPresetWeather((prev) => ({
            ...prev,
            [preset]: {
              temp: num(c.temp_c),
              icon: info.icon,
              code,
              isDay,
              condition: c.condition?.text?.trim() || info.condition,
              wind: num(c.wind_kph),
            },
          }));
        }

        // Hourly: from the first forecast day, starting at the current hour
        const firstHours = (forecastDays[0]?.hour ?? []) as Array<Record<string, unknown>>;
        const nowHour = new Date().getHours();
        let startIdx = firstHours.findIndex((h) => {
          const t = String(h.time ?? "");
          const hh = Number(t.slice(11, 13));
          return hh >= nowHour;
        });
        if (startIdx < 0) startIdx = 0;
        const flatHours: Array<{ h: Record<string, unknown>; date: string }> = [];
        forecastDays.forEach((fd: Record<string, unknown>) => {
          ((fd.hour ?? []) as Array<Record<string, unknown>>).forEach((h) =>
            flatHours.push({ h, date: String(fd.date ?? "") })
          );
        });
        setHourly(
          flatHours.slice(startIdx, startIdx + 24).map(({ h }, i) => {
            const hCode = wwoToWmo((h.condition as { code?: number } | undefined)?.code ?? 0);
            const t = String(h.time ?? "");
            const hh = Number(t.slice(11, 13)) || 0;
            return {
              time: `${i}`,
              label: i === 0 ? "Now" : `${hh % 12 || 12} ${hh >= 12 ? "PM" : "AM"}`,
              temp: Math.round(num(h.temp_c) ?? 0),
              rain: Math.round(num(h.chance_of_rain) ?? 0),
              icon: getWeatherInfo(hCode).icon,
              code: hCode,
              isDay: h.is_day === 1,
            };
          })
        );

        setDaily(
          forecastDays.map((fd: Record<string, unknown>, i: number) => {
            const day = (fd.day ?? {}) as Record<string, unknown>;
            const astro = (fd.astro ?? {}) as Record<string, unknown>;
            const hours = (fd.hour ?? []) as Array<Record<string, unknown>>;
            const midday = hours[Math.min(12, hours.length - 1)] ?? {};
            const dCode = wwoToWmo((midday.condition as { code?: number } | undefined)?.code ?? 0);
            const dInfo = getWeatherInfo(dCode);
            const rain = Math.max(0, ...hours.map((h) => num(h.chance_of_rain) ?? 0));
            const gusts = Math.max(0, ...hours.map((h) => num(h.gust_kph) ?? 0));
            const windiest = hours.reduce(
              (best: Record<string, unknown>, h) =>
                (num(h.wind_kph) ?? 0) > (num(best.wind_kph) ?? 0) ? h : best,
              hours[0] ?? {}
            );
            const date = String(fd.date ?? "");
            return {
              date,
              day: i === 0 ? "Today" : i === 1 ? "Tomorrow" : weekday(date),
              icon: dInfo.icon,
              code: dCode,
              desc:
                (midday.condition as { text?: string } | undefined)?.text?.trim() || dInfo.condition,
              high: Math.round(num(day.maxtemp_c) ?? 0),
              low: Math.round(num(day.mintemp_c) ?? 0),
              rain,
              precip: Math.round((num(day.totalprecip_mm) ?? 0) * 10) / 10,
              uv: num(day.uv) ?? 0,
              wind: Math.round(num(day.maxwind_kph) ?? 0),
              gusts: Math.round(gusts),
              windDir:
                (windiest.wind_dir as string) || windDir(num(windiest.wind_degree) ?? undefined),
              sunrise: wttrClock(astro.sunrise as string | undefined),
              sunset: wttrClock(astro.sunset as string | undefined),
            };
          })
        );

        // Air quality from WeatherAPI (EPA index → approximate US AQI)
        const aq = c.air_quality as Record<string, unknown> | undefined;
        if (aq) {
          setAir({
            usAqi: epaIndexToAqi(num(aq["us-epa-index"])),
            pm25: num(aq.pm2_5) != null ? Math.round(num(aq.pm2_5)! * 10) / 10 : null,
            pm10: num(aq.pm10) != null ? Math.round(num(aq.pm10)! * 10) / 10 : null,
            ozone: num(aq.o3) != null ? Math.round(num(aq.o3)! * 10) / 10 : null,
            uv: num(c.uv),
          });
        } else {
          setAir(EMPTY_AIR);
        }
        // WeatherAPI has no soil data
        setSoil(EMPTY_SOIL);
        return true;
      } catch {
        return false;
      }
    },
    []
  );

  const loadWeather = useCallback(
    async (lat: number, lon: number, label: string, preset: string | null = null) => {
      setLoading(true);
      setError(null);
      setLocationLabel(label);
      setActivePreset(preset);

      try {
        const forecastParams = new URLSearchParams({
          latitude: String(lat),
          longitude: String(lon),
          current: [
            "temperature_2m", "relative_humidity_2m", "apparent_temperature", "is_day",
            "precipitation", "weather_code", "cloud_cover", "pressure_msl",
            "wind_speed_10m", "wind_direction_10m", "wind_gusts_10m",
          ].join(","),
          hourly: [
            "temperature_2m", "relative_humidity_2m", "dew_point_2m",
            "precipitation_probability", "precipitation", "weather_code",
            "cloud_cover", "visibility", "uv_index", "is_day",
            "soil_temperature_0cm", "soil_moisture_0_to_1cm",
            "et0_fao_evapotranspiration",
          ].join(","),
          daily: [
            "weather_code", "temperature_2m_max", "temperature_2m_min",
            "sunrise", "sunset", "uv_index_max", "precipitation_sum",
            "precipitation_probability_max", "wind_speed_10m_max",
            "wind_gusts_10m_max", "wind_direction_10m_dominant",
          ].join(","),
          timezone: "auto",
          forecast_days: "7",
          wind_speed_unit: "kmh",
          precipitation_unit: "mm",
        });

        const airParams = new URLSearchParams({
          latitude: String(lat),
          longitude: String(lon),
          current: "us_aqi,pm2_5,pm10,ozone,uv_index",
          timezone: "auto",
        });

        const [forecastRes, airRes] = await Promise.all([
          fetch(`${FORECAST_BASE}?${forecastParams.toString()}`),
          fetch(`${AIR_BASE}?${airParams.toString()}`).catch(() => null),
        ]);

        if (!forecastRes.ok) {
          throw new Error(`Weather service returned ${forecastRes.status}. Please try again.`);
        }

        const f = await forecastRes.json();
        const hourlyData = f.hourly ?? {};
        const hourlyTimes: string[] = hourlyData.time ?? [];

        // Find the current hour inside the hourly series
        const currentTime: string | undefined = f.current?.time;
        const hourKey = currentTime ? `${currentTime.slice(0, 13)}:00` : "";
        let nowIdx = hourlyTimes.indexOf(hourKey);
        if (nowIdx < 0) nowIdx = 0;

        const c = f.current ?? {};
        const info = getWeatherInfo(c.weather_code);

        setCurrent({
          temp: c.temperature_2m != null ? Math.round(c.temperature_2m) : null,
          condition: info.condition,
          icon: info.icon,
          code: c.weather_code ?? 3,
          feelsLike: c.apparent_temperature != null ? Math.round(c.apparent_temperature) : null,
          humidity: c.relative_humidity_2m != null ? Math.round(c.relative_humidity_2m) : null,
          wind: c.wind_speed_10m != null ? Math.round(c.wind_speed_10m) : null,
          gusts: c.wind_gusts_10m != null ? Math.round(c.wind_gusts_10m) : null,
          windDir: windDir(c.wind_direction_10m),
          windDeg: c.wind_direction_10m ?? null,
          pressure: c.pressure_msl != null ? Math.round(c.pressure_msl) : null,
          cloud: c.cloud_cover != null ? Math.round(c.cloud_cover) : null,
          dew: hourlyData.dew_point_2m?.[nowIdx] != null ? Math.round(hourlyData.dew_point_2m[nowIdx]) : null,
          uv: hourlyData.uv_index?.[nowIdx] != null ? Math.round(hourlyData.uv_index[nowIdx] * 10) / 10 : null,
          visibility: hourlyData.visibility?.[nowIdx] != null ? Math.round(hourlyData.visibility[nowIdx] / 100) / 10 : null,
          isDay: c.is_day !== 0,
        });

        // Keep the selected area tile exactly in sync with the main weather
        if (preset) {
          setPresetWeather((prev) => ({
            ...prev,
            [preset]: {
              temp: c.temperature_2m ?? null,
              icon: info.icon,
              code: c.weather_code ?? 3,
              isDay: c.is_day !== 0,
              condition: info.condition,
              wind: c.wind_speed_10m ?? null,
            },
          }));
        }

        setSoil({
          temp0: hourlyData.soil_temperature_0cm?.[nowIdx] != null
            ? Math.round(hourlyData.soil_temperature_0cm[nowIdx] * 10) / 10
            : null,
          moisture0: hourlyData.soil_moisture_0_to_1cm?.[nowIdx] != null
            ? Math.round(hourlyData.soil_moisture_0_to_1cm[nowIdx] * 1000) / 1000
            : null,
          et0: hourlyData.et0_fao_evapotranspiration?.[nowIdx] != null
            ? Math.round(hourlyData.et0_fao_evapotranspiration[nowIdx] * 100) / 100
            : null,
        });

        const next24 = hourlyTimes.slice(nowIdx, nowIdx + 24).map((time, i) => ({
          time,
          label: i === 0 ? "Now" : fmtHour(time),
          temp: Math.round(hourlyData.temperature_2m?.[nowIdx + i] ?? 0),
          rain: Math.round(hourlyData.precipitation_probability?.[nowIdx + i] ?? 0),
          icon: getWeatherInfo(hourlyData.weather_code?.[nowIdx + i]).icon,
          code: hourlyData.weather_code?.[nowIdx + i] ?? 3,
          isDay: hourlyData.is_day?.[nowIdx + i] !== 0,
        }));
        setHourly(next24);

        const d = f.daily ?? {};
        const days: DayPoint[] = (d.time ?? []).map((date: string, i: number) => {
          const dayInfo = getWeatherInfo(d.weather_code?.[i]);
          return {
            date,
            day: i === 0 ? "Today" : i === 1 ? "Tomorrow" : weekday(date),
            icon: dayInfo.icon,
            code: d.weather_code?.[i] ?? 3,
            desc: dayInfo.condition,
            high: Math.round(d.temperature_2m_max?.[i] ?? 0),
            low: Math.round(d.temperature_2m_min?.[i] ?? 0),
            rain: Math.round(d.precipitation_probability_max?.[i] ?? 0),
            precip: Math.round((d.precipitation_sum?.[i] ?? 0) * 10) / 10,
            uv: Math.round((d.uv_index_max?.[i] ?? 0) * 10) / 10,
            wind: Math.round(d.wind_speed_10m_max?.[i] ?? 0),
            gusts: Math.round(d.wind_gusts_10m_max?.[i] ?? 0),
            windDir: windDir(d.wind_direction_10m_dominant?.[i]),
            sunrise: fmtClock(d.sunrise?.[i]),
            sunset: fmtClock(d.sunset?.[i]),
          };
        });
        setDaily(days);

        if (airRes && airRes.ok) {
          const a = await airRes.json();
          const ac = a.current ?? {};
          setAir({
            usAqi: ac.us_aqi != null ? Math.round(ac.us_aqi) : null,
            pm25: ac.pm2_5 != null ? Math.round(ac.pm2_5 * 10) / 10 : null,
            pm10: ac.pm10 != null ? Math.round(ac.pm10 * 10) / 10 : null,
            ozone: ac.ozone != null ? Math.round(ac.ozone * 10) / 10 : null,
            uv: ac.uv_index != null ? Math.round(ac.uv_index * 10) / 10 : null,
          });
        } else {
          setAir(EMPTY_AIR);
        }
      } catch (err) {
        console.error("Open-Meteo fetch failed, trying backups:", err);
        // Fallback chain: WeatherAPI.com (if keyed) → wttr.in (no key)
        let recovered = false;
        if (WEATHERAPI_KEY) recovered = await applyWeatherApiFallback(lat, lon, preset);
        if (!recovered) recovered = await applyWttrFallback(lat, lon, preset);
        if (!recovered) {
          setError(err instanceof Error ? err.message : "Couldn't load weather. Check your connection and try again.");
          setHourly([]);
          setDaily([]);
          setAir(EMPTY_AIR);
          setSoil(EMPTY_SOIL);
          setCurrent(EMPTY_CURRENT);
        }
      } finally {
        setLoading(false);
        // Refresh every tile so icons/conditions stay current
        void loadPresetSummaries();
      }
    },
    [loadPresetSummaries, applyWttrFallback, applyWeatherApiFallback]
  );

  // Initial load: device location, fall back to Mbale
  useEffect(() => {
    if (!navigator.geolocation) {
      loadWeather(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon, "Mbale, Uganda", "Mbale");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => loadWeather(pos.coords.latitude, pos.coords.longitude, "My location", null),
      () => loadWeather(DEFAULT_COORDS.lat, DEFAULT_COORDS.lon, "Mbale, Uganda", "Mbale"),
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 600000 }
    );
  }, [loadWeather]);

  // Load tile summaries on mount and refresh every 10 minutes
  useEffect(() => {
    void loadPresetSummaries();
    const id = window.setInterval(() => void loadPresetSummaries(), 600000);
    return () => window.clearInterval(id);
  }, [loadPresetSummaries]);

  // Rotate which districts are shown in the tiles every 15 seconds.
  // The selected area and its weather details are NOT changed — only the tile list cycles.
  useEffect(() => {
    const id = window.setInterval(() => {
      if (document.hidden) return;
      setTileOffset((o) => (o + TILES_PER_PAGE) % PRESET_LOCATIONS.length);
    }, 15000);
    return () => window.clearInterval(id);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = locationInput.trim();
    if (!query) return;

    // Direct "lat, lon" input
    const coordMatch = query.match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
    if (coordMatch) {
      setLocationInput("");
      await loadWeather(Number(coordMatch[1]), Number(coordMatch[2]), "Custom area", null);
      return;
    }

    setSearching(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        name: query,
        count: "1",
        language: "en",
        format: "json",
      });
      const res = await fetch(`${GEO_BASE}?${params.toString()}`);
      if (!res.ok) throw new Error("Location search failed. Please try again.");
      const data = await res.json();
      const hit = data.results?.[0];
      if (!hit) {
        setError(`No area found for "${query}". Try another nearby town.`);
        return;
      }
      const label = [hit.name, hit.admin1].filter(Boolean).join(", ");
      setLocationInput("");
      await loadWeather(hit.latitude, hit.longitude, label, null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Location search failed.");
    } finally {
      setSearching(false);
    }
  };

  const today = daily[0];
  const todayRain = today?.rain ?? 0;
  const rainRisk = todayRain >= 50;
  const aqi = aqiInfo(air.usAqi);

  const Detail = ({ icon: Icon, label, value }: { icon: typeof Sun; label: string; value: string }) => (
    <div className="bg-[#FAFAF7] rounded-xl px-3 py-2.5 border border-[#EAF3EA]">
      <div className="flex items-center gap-1.5 mb-1">
        <Icon className="w-3.5 h-3.5 text-[#5A6B5A]" />
        <p className="text-[11px] text-[#8A9B8A]">{label}</p>
      </div>
      <p className="text-sm font-semibold text-[#1C2B1C]">{value}</p>
    </div>
  );

  const v = (n: number | null, unit: string) => (loading ? "—" : n != null ? `${n}${unit}` : "—");

  // The 6 districts currently shown in the tiles (cycles every 15 seconds)
  const visibleLocations = PRESET_LOCATIONS.slice(tileOffset, tileOffset + TILES_PER_PAGE);

  return (
    <AppLayout>
      <div className="w-full px-4 sm:px-6 lg:pl-5 lg:pr-8 py-6">
        <div className="lg:grid lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-6 lg:items-start">

          {/* ───── LEFT: search + area tiles ───── */}
          <aside className="mb-5 lg:mb-0 lg:sticky lg:top-6">
            <form onSubmit={handleSearch} className="relative mb-3">
              {searching ? (
                <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6B5A] animate-spin" />
              ) : (
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5A6B5A]" />
              )}
              <input
                type="text"
                placeholder="Search area"
                value={locationInput}
                onChange={(e) => setLocationInput(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#F3F8F3] rounded-xl border border-[#D8EAD8] text-sm text-[#1C2B1C] placeholder:text-[#8A9B8A] outline-none focus:ring-2 focus:ring-[#2E7D32]/30"
              />
            </form>

            <div className="flex gap-2 overflow-x-auto pb-1 lg:flex-col lg:overflow-visible lg:pb-0">
              {visibleLocations.map((loc) => {
                const active = activePreset === loc.name;
                const summary = presetWeather[loc.name];
                return (
                  <button
                    key={loc.name}
                    onClick={() => loadWeather(loc.lat, loc.lon, `${loc.name}, Uganda`, loc.name)}
                    className={`group flex-shrink-0 min-w-[200px] lg:min-w-0 lg:w-full text-left rounded-2xl border-2 px-4 py-4 transition-all ${
                      active
                        ? "bg-[#2E7D32] border-[#2E7D32] text-white shadow-md"
                        : "bg-white border-[#E5E7EB] text-[#1C2B1C] hover:bg-[#FAFAF7] hover:border-[#D1D5DB] hover:shadow-sm"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[15px] font-bold truncate">{loc.name}</p>
                        <p className={`text-xs mt-0.5 truncate ${active ? "text-white/75" : "text-[#6B7280]"}`}>
                          {loc.region}
                        </p>
                      </div>
                      <p className={`text-xl font-bold flex-shrink-0 ${active ? "text-white" : "text-[#1F2937]"}`}>
                        {summary?.temp != null ? `${Math.round(summary.temp)}°` : "–"}
                      </p>
                    </div>

                    <div
                      className={`mt-3 flex items-center justify-between gap-2 text-[11px] ${
                        active ? "text-white/80" : "text-[#6B7280]"
                      }`}
                    >
                      <span className="flex items-center gap-1.5 min-w-0">
                        <span className="flex-shrink-0">
                          {summary ? (
                            <WeatherGlyph
                              code={summary.code}
                              isDay={summary.isDay}
                              variant={active ? "white" : "colored"}
                              className="w-7 h-7"
                            />
                          ) : (
                            <Cloud className="w-7 h-7 text-[#9CA3AF]" />
                          )}
                        </span>
                        <span className="truncate">{summary?.condition ?? "Loading…"}</span>
                      </span>
                      <span className="flex items-center gap-1 flex-shrink-0">
                        <Wind className="w-3 h-3" />
                        {summary?.wind != null ? `${Math.round(summary.wind)} km/h` : "—"}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          {/* ───── RIGHT: weather data ───── */}
          <div className="min-w-0">
            <div>
              <h1 className="text-2xl font-bold text-[#1C2B1C]">Weather</h1>
              <p className="text-sm text-[#5A6B5A] flex items-center gap-1 truncate">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                {locationLabel}
              </p>
            </div>

            {error && (
              <div className="flex gap-3 mt-4 p-4 rounded-2xl border bg-[#FFF8E1] border-[#FFE082]">
                <span className="text-xl">⚠️</span>
                <div>
                  <p className="font-semibold text-sm text-[#8D6E00]">Couldn't load weather</p>
                  <p className="text-sm text-[#5A6B5A] mt-0.5">{error}</p>
                </div>
              </div>
            )}

            <div className="mt-5 grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
            {/* Current conditions */}
            <div className="xl:col-span-2 bg-gradient-to-br from-[#1976D2] to-[#0D47A1] rounded-2xl p-6 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12" />
              <div className="relative flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="text-white/70 text-sm mb-1">Right now in {locationLabel.split(",")[0]}</p>
                  {loading ? (
                    <p className="text-white/80 flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" /> Loading live weather…
                    </p>
                  ) : (
                    <div className="flex items-end gap-3">
                      <span className="text-7xl font-thin leading-none">
                        {current.temp != null ? `${current.temp}°` : "—"}
                      </span>
                      <div className="mb-1.5">
                        <p className="font-semibold">{current.condition}</p>
                        <p className="text-white/70 text-sm">
                          Feels like {current.feelsLike != null ? `${current.feelsLike}°C` : "—"}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <span className="flex-shrink-0">
                  {loading ? (
                    <span className="text-5xl">⏳</span>
                  ) : (
                    <WeatherGlyph
                      code={current.code}
                      isDay={current.isDay}
                      variant="white"
                      className="w-16 h-16 sm:w-20 sm:h-20"
                    />
                  )}
                </span>
              </div>

              <div className="relative mt-4 grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                {[
                  { icon: Droplets, label: "Rain chance", value: loading ? "—" : `${todayRain}%` },
                  { icon: Wind, label: "Wind", value: v(current.wind, " km/h") },
                  { icon: Thermometer, label: "Humidity", value: v(current.humidity, "%") },
                  { icon: Gauge, label: "Pressure", value: v(current.pressure, " hPa") },
                  { icon: Cloud, label: "Cloud cover", value: v(current.cloud, "%") },
                  { icon: Sun, label: "UV index", value: loading ? "—" : current.uv != null ? `${current.uv}` : "—" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="bg-white/15 rounded-xl px-2 py-2.5 text-center">
                    <Icon className="w-4 h-4 mx-auto mb-1 text-white/80" />
                    <p className="text-[10px] sm:text-xs text-white/70">{label}</p>
                    <p className="font-bold text-xs sm:text-sm">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Alerts */}
            {!loading && today && (
              rainRisk ? (
                <div className="xl:col-span-2 flex gap-3 p-4 rounded-2xl border bg-[#1976D208] border-[#1976D225]">
                  <span className="text-2xl flex-shrink-0">🌧️</span>
                  <div>
                    <p className="font-bold text-sm text-[#1976D2]">Rain alert</p>
                    <p className="text-sm text-[#5A6B5A] mt-0.5">
                      Up to {todayRain}% chance of rain today ({today.precip} mm expected). Consider delaying
                      spraying and protecting harvested produce.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="xl:col-span-2 flex gap-3 p-4 rounded-2xl border bg-[#F3F8F3] border-[#D8EAD8]">
                  <span className="text-2xl flex-shrink-0">✅</span>
                  <div>
                    <p className="font-bold text-sm text-[#2E7D32]">Conditions look stable</p>
                    <p className="text-sm text-[#5A6B5A] mt-0.5">
                      Low rain chance today ({todayRain}%). Good window for fieldwork if temperatures are
                      comfortable.
                    </p>
                  </div>
                </div>
              )
            )}

            {/* Hourly */}
            <div className="xl:col-span-2 bg-white rounded-2xl p-5 border border-[#EAF3EA] shadow-xs">
              <h2 className="font-bold text-[#1C2B1C] mb-4">Hourly · Next 24 Hours</h2>
              {loading ? (
                <p className="text-sm text-[#5A6B5A]">Loading hourly data…</p>
              ) : hourly.length === 0 ? (
                <p className="text-sm text-[#5A6B5A]">No hourly data available.</p>
              ) : (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {hourly.map((h) => (
                    <div
                      key={h.time}
                      className={`flex-shrink-0 w-[74px] rounded-xl p-2.5 text-center border ${
                        h.label === "Now"
                          ? "bg-[#F3F8F3] border-[#D8EAD8]"
                          : "bg-[#FAFAF7] border-[#EAF3EA]"
                      }`}
                    >
                      <p className="text-[11px] font-semibold text-[#5A6B5A]">{h.label}</p>
                      <div className="my-1 flex justify-center">
                        <WeatherGlyph code={h.code} isDay={h.isDay} variant="colored" className="w-7 h-7" />
                      </div>
                      <p className="text-sm font-bold text-[#1C2B1C]">{h.temp}°</p>
                      <p className="text-[11px] text-[#1976D2] flex items-center justify-center gap-0.5 mt-0.5">
                        <Droplets className="w-3 h-3" />
                        {h.rain}%
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 7-day */}
            <div className="xl:col-span-2 bg-white rounded-2xl p-5 border border-[#EAF3EA] shadow-xs">
              <h2 className="font-bold text-[#1C2B1C] mb-4">{daily.length > 0 ? `${daily.length}-Day` : "7-Day"} Forecast</h2>
              {loading ? (
                <p className="text-sm text-[#5A6B5A]">Loading forecast…</p>
              ) : daily.length === 0 ? (
                <p className="text-sm text-[#5A6B5A]">No forecast data available.</p>
              ) : (
                <div className="space-y-2">
                  {daily.map((d) => (
                    <div
                      key={d.date}
                      className={`p-3 rounded-xl ${
                        d.day === "Today" ? "bg-[#F3F8F3] border border-[#D8EAD8]" : "hover:bg-[#FAFAF7]"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <p className="text-sm font-semibold text-[#1C2B1C] w-20 flex-shrink-0">{d.day}</p>
                        <span className="flex-shrink-0">
                          <WeatherGlyph code={d.code} variant="colored" className="w-7 h-7" />
                        </span>
                        <p className="text-xs text-[#5A6B5A] flex-1 min-w-0 truncate">{d.desc}</p>
                        <div className="flex items-center gap-1.5 text-xs text-[#1976D2] flex-shrink-0">
                          <Droplets className="w-3 h-3" /> {d.rain}%
                        </div>
                        <div className="flex gap-1.5 text-xs flex-shrink-0 w-16 justify-end">
                          <span className="font-bold text-[#1C2B1C]">{d.high}°</span>
                          <span className="text-[#8A9B8A]">{d.low}°</span>
                        </div>
                      </div>
                      <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-0.5 text-[11px] text-[#8A9B8A] sm:pl-[92px]">
                        <span>Precip {d.precip} mm</span>
                        <span>UV {d.uv}</span>
                        <span>Wind {d.wind} km/h {d.windDir}</span>
                        <span>Gusts {d.gusts} km/h</span>
                        <span>☀ {d.sunrise}</span>
                        <span>🌙 {d.sunset}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <p className="text-[11px] text-[#8A9B8A] mt-3">
                Forecasts are model-based and may change.
              </p>
            </div>

            {/* Current details */}
            <div className="xl:col-span-2 bg-white rounded-2xl p-5 border border-[#EAF3EA] shadow-xs">
              <h2 className="font-bold text-[#1C2B1C] mb-4">Current Details</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-5 gap-3">
                <Detail icon={Thermometer} label="Feels like" value={v(current.feelsLike, "°C")} />
                <Detail icon={Thermometer} label="Dew point" value={v(current.dew, "°C")} />
                <Detail icon={Droplets} label="Humidity" value={v(current.humidity, "%")} />
                <Detail icon={Gauge} label="Pressure (MSL)" value={v(current.pressure, " hPa")} />
                <Detail icon={Cloud} label="Cloud cover" value={v(current.cloud, "%")} />
                <Detail icon={Eye} label="Visibility" value={v(current.visibility, " km")} />
                <Detail icon={Wind} label="Wind speed" value={v(current.wind, " km/h")} />
                <Detail icon={Wind} label="Wind gusts" value={v(current.gusts, " km/h")} />
                <Detail
                  icon={Compass}
                  label="Wind direction"
                  value={
                    loading
                      ? "—"
                      : current.windDeg != null
                        ? `${current.windDir} (${Math.round(current.windDeg)}°)`
                        : "—"
                  }
                />
              </div>
            </div>

            {/* Sun & UV */}
            <div className="bg-white rounded-2xl p-5 border border-[#EAF3EA] shadow-xs">
              <h2 className="font-bold text-[#1C2B1C] mb-4">Sun & UV · Today</h2>
              {loading || !today ? (
                <p className="text-sm text-[#5A6B5A]">Loading…</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Detail icon={Sunrise} label="Sunrise" value={today.sunrise} />
                  <Detail icon={Sunset} label="Sunset" value={today.sunset} />
                  <Detail icon={Sun} label="UV max" value={`${today.uv}`} />
                  <Detail icon={Droplets} label="Precipitation" value={`${today.precip} mm`} />
                </div>
              )}
            </div>

            {/* Farming */}
            <div className="bg-white rounded-2xl p-5 border border-[#EAF3EA] shadow-xs">
              <h2 className="font-bold text-[#1C2B1C] mb-1">Farming Conditions</h2>
              <p className="text-xs text-[#8A9B8A] mb-4">
                Soil and evapotranspiration estimates for the current hour.
              </p>
              {loading ? (
                <p className="text-sm text-[#5A6B5A]">Loading…</p>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <Detail icon={Thermometer} label="Soil temp (0 cm)" value={v(soil.temp0, "°C")} />
                  <Detail icon={Droplets} label="Soil moisture (0–1 cm)" value={v(soil.moisture0, " m³/m³")} />
                  <Detail icon={Leaf} label="ET₀ (FAO)" value={v(soil.et0, " mm")} />
                </div>
              )}
            </div>

            {/* Air quality */}
            <div className="xl:col-span-2 bg-white rounded-2xl p-5 border border-[#EAF3EA] shadow-xs">
              <h2 className="font-bold text-[#1C2B1C] mb-4">Air Quality</h2>
              {loading ? (
                <p className="text-sm text-[#5A6B5A]">Loading air quality…</p>
              ) : air.usAqi == null && air.pm25 == null ? (
                <p className="text-sm text-[#5A6B5A]">Air quality data is not available for this area.</p>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-[#FAFAF7] border border-[#EAF3EA]">
                    <span className="text-2xl">🌬️</span>
                    <div>
                      <p className="text-sm font-semibold text-[#1C2B1C]">
                        US AQI {air.usAqi ?? "—"} ·{" "}
                        <span style={{ color: aqi.color }}>{aqi.label}</span>
                      </p>
                      <p className="text-xs text-[#8A9B8A]">Current air quality index</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <Detail icon={Eye} label="PM2.5" value={air.pm25 != null ? `${air.pm25} µg/m³` : "—"} />
                    <Detail icon={Eye} label="PM10" value={air.pm10 != null ? `${air.pm10} µg/m³` : "—"} />
                    <Detail icon={Cloud} label="Ozone" value={air.ozone != null ? `${air.ozone} µg/m³` : "—"} />
                    <Detail icon={Sun} label="UV (air)" value={air.uv != null ? `${air.uv}` : "—"} />
                  </div>
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="xl:col-span-2">
              <h2 className="font-bold text-[#1C2B1C] mb-3">Recommendations for Your Farm</h2>
              {loading ? (
                <p className="text-sm text-[#5A6B5A]">Generating recommendations…</p>
              ) : !today ? (
                <p className="text-sm text-[#5A6B5A]">Load a forecast to see farm recommendations.</p>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
                  <div className="bg-white rounded-2xl p-4 border border-[#EAF3EA] shadow-xs flex gap-3">
                    <span className="text-2xl flex-shrink-0">🌱</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-sm text-[#1C2B1C]">Planting window</p>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-[#F3F8F3] text-[#2E7D32] rounded-full border border-[#D8EAD8]">
                          Planting
                        </span>
                      </div>
                      <p className="text-sm text-[#5A6B5A] leading-relaxed">
                        {todayRain < 40
                          ? `Today looks suitable for fieldwork (${todayRain}% rain, ${today.precip} mm). Check soil moisture before transplanting.`
                          : `Rain is likely today (${todayRain}%, ${today.precip} mm). Consider waiting for a drier day to avoid waterlogging.`}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-[#EAF3EA] shadow-xs flex gap-3">
                    <span className="text-2xl flex-shrink-0">🚫</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-sm text-[#1C2B1C]">Spraying advice</p>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-[#F3F8F3] text-[#2E7D32] rounded-full border border-[#D8EAD8]">
                          Inputs
                        </span>
                      </div>
                      <p className="text-sm text-[#5A6B5A] leading-relaxed">
                        {rainRisk || today.wind > 25
                          ? `Avoid spraying${rainRisk ? ` — ${todayRain}% rain chance` : ""}${
                              rainRisk && today.wind > 25 ? " and" : " —"
                            }${today.wind > 25 ? ` wind up to ${today.wind} km/h` : ""}.`
                          : `Conditions are calmer today (${todayRain}% rain, wind up to ${today.wind} km/h). Follow label guidance if spraying.`}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl p-4 border border-[#EAF3EA] shadow-xs flex gap-3">
                    <span className="text-2xl flex-shrink-0">☀️</span>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-bold text-sm text-[#1C2B1C]">Heat & UV</p>
                        <span className="text-[10px] font-bold px-2 py-0.5 bg-[#F3F8F3] text-[#2E7D32] rounded-full border border-[#D8EAD8]">
                          Care
                        </span>
                      </div>
                      <p className="text-sm text-[#5A6B5A] leading-relaxed">
                        {today.uv >= 6
                          ? `UV max is ${today.uv} today — plan fieldwork for early morning or late afternoon and protect workers.`
                          : `UV max is ${today.uv} today. Monitor heat and water needs for sensitive crops.`}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
