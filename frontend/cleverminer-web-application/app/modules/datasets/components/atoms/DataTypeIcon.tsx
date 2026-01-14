import { Binary, HelpCircle, Type } from 'lucide-react';

export default function DataTypeIcon({ type }: { type?: string }) {
  if (!type) return <HelpCircle className="h-4 w-4 text-gray-400" />;
  if (type.includes('int') || type.includes('float'))
    return <Binary className="h-4 w-4 text-blue-500" />;
  return <Type className="h-4 w-4 text-orange-500" />;
}
