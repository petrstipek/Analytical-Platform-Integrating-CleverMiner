import { useState, useEffect } from 'react';
import { Input } from '@/shared/components/ui/atoms/input';
import { Label } from '@/shared/components/ui/atoms/label';

interface VectorInputProps {
  value: number[] | null;
  onChange: (val: number[] | null) => void;
  label: string;
  desc?: string;
}

export default function VectorInput({ value, onChange, label, desc }: VectorInputProps) {
  const [strVal, setStrVal] = useState('');

  useEffect(() => {
    if (value && Array.isArray(value)) {
      setStrVal(value.join(', '));
    }
  }, [value]);

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
    const isValid = numbers.every((n) => !isNaN(n));

    if (isValid) {
      onChange(numbers);
    }
  };

  return (
    <div className="space-y-1.5">
      <Label className="text-sm font-medium">{label}</Label>
      <Input
        placeholder="e.g. 5, 1, 0"
        value={strVal}
        onChange={(e) => handleChange(e.target.value)}
      />
      {desc && <p className="text-muted-foreground text-[0.8rem]">{desc}</p>}
    </div>
  );
}
