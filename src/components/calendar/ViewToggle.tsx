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
    <div className="flex items-center rounded-lg border border-border p-0.5 bg-muted/40 hover:border-primary/30 transition-colors duration-200">
      {views.map((v) => (
        <Button
          key={v.id}
          variant="ghost"
          size="sm"
          onClick={() => onViewChange(v.id)}
          className={cn(
            "h-7 gap-1 px-2 text-[10px] font-medium rounded-md transition-all duration-200",
            view === v.id
              ? "bg-gradient-to-br from-card to-primary/5 text-foreground shadow-sm scale-105"
              : "text-muted-foreground hover:text-foreground hover:scale-105 hover:bg-muted/60"
          )}
          title={`${v.label} (${v.key})`}
        >
          <v.icon className={cn("h-3 w-3 transition-transform duration-200", view === v.id && "scale-110")} />
          <span className="hidden sm:inline">{v.label}</span>
        </Button>
      ))}
    </div>
  );
}
