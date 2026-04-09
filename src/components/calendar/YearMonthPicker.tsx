import { MONTH_NAMES, getYear } from "@/lib/calendar-utils";

interface YearMonthPickerProps {
  currentMonth: Date;
  onSelect: (month: number, year: number) => void;
  onClose: () => void;
}

export function YearMonthPicker({ currentMonth, onSelect, onClose }: YearMonthPickerProps) {
  const currentYear = getYear(currentMonth);
  const years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className="w-full max-w-sm rounded-xl bg-card p-5 shadow-2xl animate-fade-in-up mx-4 max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-display text-lg font-semibold text-foreground mb-4 text-center">
          Jump to Month
        </h3>

        {years.map((year) => (
          <div key={year} className="mb-3">
            <p className="text-xs font-semibold text-muted-foreground mb-1.5 px-1">{year}</p>
            <div className="grid grid-cols-4 gap-1">
              {MONTH_NAMES.map((name, monthIdx) => {
                const isCurrent =
                  monthIdx === currentMonth.getMonth() && year === currentYear;
                return (
                  <button
                    key={name}
                    onClick={() => { onSelect(monthIdx, year); onClose(); }}
                    className={`rounded-lg px-2 py-1.5 text-xs transition-colors ${
                      isCurrent
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    {name.slice(0, 3)}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
