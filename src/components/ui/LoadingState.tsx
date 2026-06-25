export function LoadingState() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="h-28 animate-pulse rounded-xl border border-banbif-border bg-white" />
      ))}
    </div>
  );
}
