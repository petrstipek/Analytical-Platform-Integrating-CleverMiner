export type BadgeStyle = {
  bg: string;
  text: string;
  ring?: string;
};

type StatusBadgeProps<T extends string | number> = {
  value: T;
  styles: Record<T, BadgeStyle>;
  labels?: Record<T, string>;
  minWidth?: string;
};

export function StatusBadge<T extends string | number>({
  value,
  styles,
  labels,
  minWidth = 'min-w-[60px]',
}: StatusBadgeProps<T>) {
  const s = styles[value];

  if (!s) return null;

  return (
    <span
      className={[
        'inline-flex items-center justify-center whitespace-nowrap',
        minWidth,
        'rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset',
        s.bg,
        s.text,
        s.ring ?? '',
      ].join(' ')}
    >
      {labels?.[value] ?? String(value)}
    </span>
  );
}
