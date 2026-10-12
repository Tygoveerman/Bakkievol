import { Icon } from "./icon";

export function Stars({ className = "size-4" }: { className?: string }) {
  return (
    <span className="inline-flex text-accent-500" aria-hidden="true">
      {Array.from({ length: 5 }, (_, i) => (
        <Icon key={i} name="star" className={className} />
      ))}
    </span>
  );
}
