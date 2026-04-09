import { CalendarDays, LayoutGrid, List, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { CalendarView } from "@/lib/calendar-utils";

interface ViewToggleProps {
  view: CalendarView;
  onViewChange: (view: CalendarView) => void;
}

const views: { id: CalendarView; label: string; icon: typeof CalendarDays; key: string }[] = [
  { id: "month", label: "Month", icon: LayoutGrid, key: "1" },
  { id: "week", label: "Week", icon: CalendarDays, key: "2" },
  { id: "day", label: "Day", icon: Clock, key: "3" },
  { id: "agenda", label: "Agenda", icon: List, key: "4" },
];

export function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center rounded-lg border border-border p-0.5 bg-muted/40">
      {views.map((v) => (
        <Button
          key={v.id}
          variant="ghost"
          size="sm"
          onClick={() => onViewChange(v.id)}
          className={cn(
            "h-8 w-8 sm:h-7 sm:w-auto sm:px-2 text-[10px] font-medium rounded-md",
            view === v.id
              ? "bg-card text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          title={`${v.label} (${v.key})`}
        >
          <v.icon className="h-4 w-4 sm:h-3 sm:w-3" />
          <span className="hidden sm:inline ml-1">{v.label}</span>
        </Button>
      ))}
    </div>
  );
}
