export function Back({ onClick, label = "back", stage = false }: { onClick: () => void; label?: string; stage?: boolean }) {
  return (
    <button
      type="button"
      className={stage ? "back-led stage" : "back-led"}
      aria-label={label}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
    >
      <i />
      {label}
    </button>
  );
}
