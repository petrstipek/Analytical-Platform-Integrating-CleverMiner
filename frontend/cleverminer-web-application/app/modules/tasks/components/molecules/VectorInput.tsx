import { useState, useEffect } from 'react';
import { Input } from '@/shared/components/ui/atoms/input';
import { Label } from '@/shared/components/ui/atoms/label';

interface VectorInputProps {
  value: number[] | null;
  onChange: (val: number[] | null) => void;
  label: string;
  desc?: string;
  categories?: string[];
}

export default function VectorInput({
  value,
  onChange,
  label,
  desc,
  categories,
}: VectorInputProps) {
  const [strVal, setStrVal] = useState('');
  const [perCat, setPerCat] = useState<number[]>([]);

  useEffect(() => {
    if (value && Array.isArray(value)) {
      setStrVal(value.join(', '));
      setPerCat(value);
    }
  }, []);

  useEffect(() => {
    if (categories) {
      setPerCat((prev) => {
        const next = categories.map((_, i) => prev[i] ?? 0);
        onChange(next);
        return next;
      });
    }
  }, [categories?.length]);

  const handlePerCatChange = (i: number, val: string) => {
    const num = parseFloat(val);
    const next = [...perCat];
    next[i] = isNaN(num) ? 0 : num;
    setPerCat(next);
    onChange(next);
  };

  const handleChange = (input: string) => {
    setStrVal(input);
    const parts = input
      .split(',')
      .map((s) => s.trim())
      .filter((s) => s !== '');
    if (parts.length === 0) {
      onChange(null);
      return;
    }
    const numbers = parts.map(Number);
    if (numbers.every((n) => !isNaN(n))) onChange(numbers);
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>

      {categories && categories.length > 0 ? (
        <div className="space-y-2">
          {categories.map((cat, i) => (
            <div key={cat} className="flex items-center gap-3">
              <span className="w-32 truncate text-xs text-gray-600" title={cat}>
                {cat}
              </span>
              <Input
                type="number"
                min={0}
                step={1}
                className="w-24"
                value={perCat[i] ?? 0}
                onChange={(e) => handlePerCatChange(i, e.target.value)}
              />
            </div>
          ))}
        </div>
      ) : (
        <Input
          placeholder="e.g. 5, 1, 0"
          value={strVal}
          onChange={(e) => handleChange(e.target.value)}
        />
      )}

      {desc && <p className="text-muted-foreground text-[0.8rem]">{desc}</p>}
    </div>
  );
}
