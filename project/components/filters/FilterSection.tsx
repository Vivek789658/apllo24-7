import { Check } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { cn } from '@/lib/utils';

interface FilterOption {
  id: string;
  label: string;
}

interface FilterSectionProps {
  title: string;
  options: FilterOption[];
  selected: string[];
  onChange: (value: string) => void;
}

export default function FilterSection({
  title,
  options,
  selected,
  onChange
}: FilterSectionProps) {
  return (
    <div>
      <h4 className="font-medium text-gray-800 mb-3">{title}</h4>
      <div className="space-y-2">
        {options.map((option) => (
          <div key={option.id} className="flex items-center">
            <div
              className={cn(
                "w-5 h-5 border rounded flex items-center justify-center cursor-pointer",
                selected.includes(option.id)
                  ? "bg-blue-500 border-blue-500"
                  : "border-gray-300"
              )}
              onClick={() => onChange(option.id)}
            >
              {selected.includes(option.id) && (
                <Check className="h-3.5 w-3.5 text-white" />
              )}
            </div>
            <label
              onClick={() => onChange(option.id)}
              className={cn(
                "ml-2 text-sm cursor-pointer",
                selected.includes(option.id) ? "text-blue-700 font-medium" : "text-gray-700"
              )}
            >
              {option.label}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}