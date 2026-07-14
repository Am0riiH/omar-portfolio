export default function Eyebrow({ children, live = false }: { children: React.ReactNode; live?: boolean }) {
  return (
    <p className="eyebrow mb-4">
      {live && <span className="eyebrow-dot" />}
      {children}
    </p>
  );
}
