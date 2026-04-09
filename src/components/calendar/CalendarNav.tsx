import { ChevronLeft, ChevronRight, CalendarDays, Plus, Search, Download, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "@/lib/calendar-utils";
import type { CalendarView } from "@/lib/calendar-utils";
import { ViewToggle } from "./ViewToggle";

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
}

export function CalendarNav({
  currentMonth, rangeStart, rangeEnd, view,
  onPrev, onNext, onToday, onClearRange, onViewChange, onOpenPicker, onAddEvent,
  onSearch, onExport, onSettings,
}: CalendarNavProps) {
  const hasRange = rangeStart && rangeEnd;
  const orderedStart = hasRange ? (rangeStart < rangeEnd ? rangeStart : rangeEnd) : rangeStart;
  const orderedEnd = hasRange ? (rangeStart < rangeEnd ? rangeEnd : rangeStart) : null;

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 py-2 md:px-5">
      <div className="flex items-center gap-1">
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onPrev}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm" className="h-8 gap-1 text-xs" onClick={onToday}>
          <CalendarDays className="h-3.5 w-3.5" />
          Today
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onNext}>
          <ChevronRight className="h-4 w-4" />
        </Button>

        <button onClick={onOpenPicker}
          className="ml-2 text-sm font-semibold text-foreground hover:text-primary transition-colors hidden sm:block">
          {format(currentMonth, "MMMM yyyy")}
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

        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onSearch} title="Search (Ctrl+K)">
          <Search className="h-3.5 w-3.5" />
        </Button>
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onExport} title="Export">
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
