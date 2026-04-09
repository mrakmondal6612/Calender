import { ChevronLeft, ChevronRight, CalendarDays, Plus, Search, Download, Settings, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "@/lib/calendar-utils";
import type { CalendarView } from "@/lib/calendar-utils";
import { ViewToggle } from "./ViewToggle";
import { useState, useEffect } from "react";

interface CalendarNavProps {
  currentMonth: Date;
  rangeStart: Date | null;
  rangeEnd: Date | null;
  view: CalendarView;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
  onClearRange: () => void;
  onViewChange: (view: CalendarView) => void;
  onOpenPicker: () => void;
  onAddEvent: () => void;
  onSearch: () => void;
  onExport: () => void;
  onSettings: () => void;
  onClock?: () => void;
}

export function CalendarNav({
  currentMonth, rangeStart, rangeEnd, view,
  onPrev, onNext, onToday, onClearRange, onViewChange, onOpenPicker, onAddEvent,
  onSearch, onExport, onSettings, onClock,
}: CalendarNavProps) {
  const hasRange = rangeStart && rangeEnd;
  const orderedStart = hasRange ? (rangeStart < rangeEnd ? rangeStart : rangeEnd) : rangeStart;
  const orderedEnd = hasRange ? (rangeStart < rangeEnd ? rangeEnd : rangeStart) : null;
  
  // Digital clock state
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center justify-between gap-2 border-b border-border px-2 sm:px-3 py-2 md:px-5 bg-gradient-to-r from-background via-background to-primary/5">
      {/* Left: Navigation + Month/Year + Time (Mobile: all together, Desktop: nav only) */}
      <div className="flex items-center gap-1 w-full sm:w-auto justify-between sm:justify-start">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onPrev}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs flex" onClick={onToday}>
            <CalendarDays className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Today</span>
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Stylish Month/Year Header with Blue Design */}
        <button onClick={onOpenPicker}
          className="ml-1 sm:ml-2 relative overflow-hidden group flex-shrink-0">
          <div className="relative flex items-center gap-1.5 px-2 py-1 rounded-lg bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-transparent border border-blue-200/30 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
            {/* Blue geometric accent */}
            <div className="absolute -right-2 -top-2 w-6 h-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-r from-blue-400/20 to-transparent rounded-l-full" />
            
            <span className="relative text-base font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              {format(currentMonth, "yyyy")}
            </span>
            <span className="relative text-xs font-semibold text-foreground uppercase tracking-wider">
              {format(currentMonth, "MMMM")}
            </span>
          </div>
        </button>

        {/* Mobile Time - Next to Year/Month */}
        <button 
          onClick={onClock}
          className="sm:hidden flex items-center gap-1 px-2 py-1 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200/30">
          <Clock className="h-3.5 w-3.5 text-amber-500" />
          <span className="text-xs font-mono font-semibold text-amber-600 tabular-nums">
            {format(currentTime, "HH:mm")}
          </span>
        </button>
      </div>

      {/* Desktop: Digital Clock - Hidden on mobile */}
      <div className="hidden sm:flex items-center">
        <button 
          onClick={onClock}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200/30 hover:border-amber-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 group">
          <Clock className="h-4 w-4 text-amber-500 group-hover:animate-pulse" />
          <span className="text-sm font-mono font-semibold text-amber-600 tabular-nums">
            {format(currentTime, "HH:mm:ss")}
          </span>
        </button>
      </div>

      <div className="flex items-center gap-1 sm:gap-1.5 w-full sm:w-auto justify-end">
        {(rangeStart || hasRange) && (
          <div className="hidden sm:flex items-center gap-2 animate-fade-in-up">
            <span className="text-xs text-muted-foreground">
              {orderedStart && format(orderedStart, "MMM d")}
              {orderedEnd && ` – ${format(orderedEnd, "MMM d")}`}
            </span>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] text-muted-foreground" onClick={onClearRange}>
              Clear
            </Button>
          </div>
        )}

        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onSearch} title="Search (Ctrl+K)">
          <Search className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 hidden sm:flex" onClick={onExport} title="Export">
          <Download className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onSettings} title="Settings">
          <Settings className="h-3.5 w-3.5" />
        </Button>

        <Button variant="outline" size="sm" className="h-8 gap-1 text-xs" onClick={onAddEvent}>
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Event</span>
        </Button>

        <ViewToggle view={view} onViewChange={onViewChange} />
      </div>
    </div>
  );
}
