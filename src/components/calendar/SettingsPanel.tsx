import { X, Sun, Moon, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CalendarSettings, ThemeMode, TimeFormat, WeekStartDay, HolidayCountry } from "@/lib/calendar-types";
import { HOLIDAY_COUNTRIES } from "@/lib/calendar-types";
import { TIMEZONE_OPTIONS } from "@/lib/calendar-types";

interface SettingsPanelProps {
  settings: CalendarSettings;
  onUpdate: (partial: Partial<CalendarSettings>) => void;
  onClose: () => void;
}

export function SettingsPanel({ settings, onUpdate, onClose }: SettingsPanelProps) {
  const themeOptions: { id: ThemeMode; label: string; icon: typeof Sun }[] = [
    { id: "light", label: "Light", icon: Sun },
    { id: "dark", label: "Dark", icon: Moon },
    { id: "system", label: "System", icon: Monitor },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
      <div className="w-full max-w-md rounded-xl bg-card p-6 shadow-2xl animate-fade-in-up mx-4 max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display text-lg font-semibold text-foreground">Settings</h3>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        </div>

        <div className="space-y-5">
          {/* Theme */}
          <div>
            <label className="text-xs font-medium text-foreground">Theme</label>
            <div className="flex gap-1.5 mt-1.5">
              {themeOptions.map((t) => (
                <button key={t.id} onClick={() => onUpdate({ theme: t.id })}
                  className={cn("flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                    settings.theme === t.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground")}>
                  <t.icon className="h-3.5 w-3.5" /> {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Time Format */}
          <div>
            <label className="text-xs font-medium text-foreground">Time Format</label>
            <div className="flex gap-1.5 mt-1.5">
              {(["12h", "24h"] as TimeFormat[]).map((f) => (
                <button key={f} onClick={() => onUpdate({ timeFormat: f })}
                  className={cn("flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                    settings.timeFormat === f ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground")}>
                  {f === "12h" ? "12 Hour" : "24 Hour"}
                </button>
              ))}
            </div>
          </div>

          {/* Week Start */}
          <div>
            <label className="text-xs font-medium text-foreground">Week Starts On</label>
            <div className="flex gap-1.5 mt-1.5">
              {([{ v: 1 as WeekStartDay, l: "Monday" }, { v: 0 as WeekStartDay, l: "Sunday" }]).map((o) => (
                <button key={o.v} onClick={() => onUpdate({ weekStartDay: o.v })}
                  className={cn("flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                    settings.weekStartDay === o.v ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground")}>
                  {o.l}
                </button>
              ))}
            </div>
          </div>

          {/* Default event duration */}
          <div>
            <label className="text-xs font-medium text-foreground">Default Event Duration</label>
            <select value={settings.defaultEventDuration} onChange={(e) => onUpdate({ defaultEventDuration: Number(e.target.value) })}
              className="w-full mt-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={90}>1.5 hours</option>
              <option value={120}>2 hours</option>
            </select>
          </div>

          {/* Timezone */}
          <div>
            <label className="text-xs font-medium text-foreground">Timezone</label>
            <select value={settings.timezone} onChange={(e) => onUpdate({ timezone: e.target.value })}
              className="w-full mt-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              {TIMEZONE_OPTIONS.map((tz) => <option key={tz} value={tz}>{tz.replace(/_/g, " ")}</option>)}
            </select>
          </div>

          {/* Holidays */}
          <div>
            <label className="text-xs font-medium text-foreground">Holiday Set</label>
            <select value={settings.holidayCountry} onChange={(e) => onUpdate({ holidayCountry: e.target.value as HolidayCountry })}
              className="w-full mt-1.5 rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring">
              {HOLIDAY_COUNTRIES.map((c) => (
                <option key={c.id} value={c.id}>{c.flag} {c.label}</option>
              ))}
            </select>
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-medium text-foreground">Show Weekends</span>
              <input type="checkbox" checked={settings.showWeekends} onChange={(e) => onUpdate({ showWeekends: e.target.checked })}
                className="rounded border-border" />
            </label>
            <label className="flex items-center justify-between cursor-pointer">
              <span className="text-xs font-medium text-foreground">Show Holidays</span>
              <input type="checkbox" checked={settings.showHolidays} onChange={(e) => onUpdate({ showHolidays: e.target.checked })}
                className="rounded border-border" />
            </label>
          </div>
        </div>

        <div className="mt-5">
          <Button size="sm" className="w-full" onClick={onClose}>Done</Button>
        </div>
      </div>
    </div>
  );
}
