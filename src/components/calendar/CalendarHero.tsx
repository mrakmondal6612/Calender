import { format, getYear } from "@/lib/calendar-utils";
import { MONTH_IMAGES } from "@/lib/calendar-utils";

interface CalendarHeroProps {
  currentMonth: Date;
  flipKey: number;
}

export function CalendarHero({ currentMonth, flipKey }: CalendarHeroProps) {
  const monthIndex = currentMonth.getMonth();
  const imageSrc = MONTH_IMAGES[monthIndex];

  return (
    <div className="relative overflow-hidden rounded-t-lg" key={flipKey}>
      <div className="animate-flip-in">
        <div className="relative aspect-[3/2] w-full overflow-hidden">
          <img
            src={imageSrc}
            alt={format(currentMonth, "MMMM yyyy")}
            className="h-full w-full object-cover"
            width={1024}
            height={680}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 right-5 text-right">
            <p className="text-sm font-light tracking-widest text-primary-foreground/80">
              {getYear(currentMonth)}
            </p>
            <h2 className="font-display text-3xl font-bold uppercase tracking-wider text-primary-foreground md:text-4xl">
              {format(currentMonth, "MMMM")}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
}
