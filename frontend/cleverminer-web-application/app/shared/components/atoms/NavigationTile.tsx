import { type ReactNode, useState } from 'react';

type NavigationTileProps = {
  label: string;
  description?: string;
  icon?: ReactNode;
  accent?: string;
  iconBg?: string;
  onClick?: () => void;
  badge?: number;
};

export default function NavigationTile({
  label = 'Tile',
  description = '',
  icon = null,
  accent = '#2D6BE4',
  iconBg,
  onClick,
  badge,
}: NavigationTileProps) {
  const [pressed, setPressed] = useState(false);
  const resolvedBg = iconBg ?? accent + '18';
  return (
    <div
      className="group relative flex cursor-pointer flex-col gap-5 overflow-hidden rounded-2xl border border-stone-200 bg-white p-7 shadow-xl ring-1 ring-black/5 transition-all duration-200 hover:-translate-y-0.5 hover:border-transparent hover:shadow-lg"
      style={pressed ? { boxShadow: `0 0 0 2px ${accent}` } : undefined}
      onClick={() => {
        setPressed(true);
        setTimeout(() => setPressed(false), 300);
        onClick?.();
      }}
    >
      <div
        className="flex h-13 w-13 flex-shrink-0 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-105"
        style={{ background: resolvedBg, color: accent, width: 52, height: 52 }}
      >
        {icon}
        {badge != null && badge > 0 && (
          <span className="absolute -top-1 -right-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-white bg-red-500 px-1 text-[10px] font-medium text-white">
            {badge > 99 ? '99+' : badge}
          </span>
        )}
      </div>

      <div>
        <div className="mb-1 text-base font-medium text-stone-900">{label}</div>
        {description && (
          <div className="text-[13px] leading-relaxed font-light text-stone-400">{description}</div>
        )}
      </div>

      <div className="absolute right-5 bottom-5 translate-x-[-4px] opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke={accent}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </div>
    </div>
  );
}
