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
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2 md:px-5 bg-gradient-to-r from-background via-background to-primary/5">
      {/* Left: Navigation */}
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:scale-105 transition-transform" onClick={onPrev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs hover:scale-105 transition-transform" onClick={onToday}>
          <CalendarDays className="h-3.5 w-3.5" />
          Today
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:scale-105 transition-transform" onClick={onNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>

        {/* Stylish Month/Year Header with Blue Design */}
        <button onClick={onOpenPicker}
          className="ml-2 relative overflow-hidden group">
          <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-br from-blue-500/10 via-blue-600/5 to-transparent border border-blue-200/30 hover:border-blue-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
            {/* Blue geometric accent */}
            <div className="absolute -right-2 -top-2 w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full opacity-20 group-hover:opacity-30 transition-opacity" />
            <div className="absolute -right-1 top-1/2 -translate-y-1/2 w-12 h-12 bg-gradient-to-r from-blue-400/20 to-transparent rounded-l-full" />
            
            <span className="relative text-lg font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              {format(currentMonth, "yyyy")}
            </span>
            <span className="relative text-sm font-semibold text-foreground uppercase tracking-wider">
              {format(currentMonth, "MMMM")}
            </span>
          </div>
        </button>
      </div>

      {/* Center: Digital Clock */}
      <div className="hidden md:flex items-center">
        <button 
          onClick={onClock}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-200/30 hover:border-amber-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 group">
          <Clock className="h-4 w-4 text-amber-500 group-hover:animate-pulse" />
          <span className="text-sm font-mono font-semibold text-amber-600 tabular-nums">
            {format(currentTime, "HH:mm:ss")}
          </span>
        </button>
      </div>

      <div className="flex items-center gap-1.5">
        {(rangeStart || hasRange) && (
          <div className="flex items-center gap-2 animate-fade-in-up">
            <span className="text-xs text-muted-foreground">
              {orderedStart && format(orderedStart, "MMM d")}
              {orderedEnd && ` – ${format(orderedEnd, "MMM d")}`}
            </span>
            <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px] text-muted-foreground" onClick={onClearRange}>
              Clear
            </Button>
          </div>
        )}

        <Button variant="ghost" size="icon" className="h-8 w-8 hover:scale-110 hover:rotate-12 transition-all duration-200" onClick={onSearch} title="Search (Ctrl+K)">
          <Search className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:scale-110 hover:rotate-12 transition-all duration-200" onClick={onExport} title="Export">
          <Download className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8 hover:scale-110 hover:rotate-12 transition-all duration-200" onClick={onSettings} title="Settings">
          <Settings className="h-3.5 w-3.5 group-hover:animate-spin" />
        </Button>

        <Button variant="outline" size="sm" className="h-8 gap-1 text-xs hover:scale-105 hover:shadow-md transition-all duration-200 bg-gradient-to-r from-primary/5 to-primary/10" onClick={onAddEvent}>
          <Plus className="h-3.5 w-3.5 group-hover:animate-bounce" />
          <span className="hidden sm:inline">Event</span>
        </Button>

        <div className="hover:scale-105 transition-transform duration-200">
          <ViewToggle view={view} onViewChange={onViewChange} />
        </div>
      </div>
    </div>
  );
}
