export default function SkeletonPages() {
  return (
    <>
      {Array.from({ length: 3 }).map((_, i) => (
        <div
          key={i}
          className="
            w-full max-w-3xl h-[600px]
            rounded-lg
            bg-slate-800/40
            animate-pulse
          "
        />
      ))}
    </>
  );
}
