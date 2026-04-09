export function SpiralBinding() {
  const holes = Array.from({ length: 13 });
  return (
    <div className="relative z-10 flex items-center justify-center gap-4 bg-card py-1.5 md:gap-6">
      {holes.map((_, i) => (
        <div key={i} className="spiral-hole" />
      ))}
    </div>
  );
}
