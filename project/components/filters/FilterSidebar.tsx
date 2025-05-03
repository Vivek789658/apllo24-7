'use client';

import { useState, useEffect, useRef } from 'react';
import { X, MapPin, Check } from 'lucide-react';
import { FilterState } from '@/lib/types';
import { Button } from '@/components/ui/button';
import FilterSection from '@/components/filters/FilterSection';
import { cn } from '@/lib/utils';

interface FilterSidebarProps {
  filters: FilterState;
  onFilterChange: (filters: Partial<FilterState>) => void;
  isMobileOpen: boolean;
  onCloseMobileFilter: () => void;
}

export default function FilterSidebar({
  filters,
  onFilterChange,
  isMobileOpen,
  onCloseMobileFilter
}: FilterSidebarProps) {
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Count active filters
  useEffect(() => {
    let count = 0;
    Object.entries(filters).forEach(([key, value]) => {
      if (key === 'sortBy') return; // Skip sortBy in the count
      if (Array.isArray(value) && value.length > 0) {
        count += value.length;
      }
    });
    setActiveFiltersCount(count);
  }, [filters]);

  const genderOptions = [
    { id: 'male', label: 'Male' },
    { id: 'female', label: 'Female' }
  ];

  const consultModeOptions = [
    { id: 'hospital', label: 'Hospital Visit' },
    { id: 'online', label: 'Online Consult' }
  ];

  const experienceOptions = [
    { id: '0-5', label: '0-5 years' },
    { id: '6-10', label: '6-10 years' },
    { id: '11-16', label: '11-16 years' }
  ];

  const feesOptions = [
    { id: '100-500', label: '₹100-₹500' },
    { id: '500-1000', label: '₹500-₹1000' },
    { id: '1000+', label: 'Above ₹1000' }
  ];

  const languageOptions = [
    { id: 'english', label: 'English' },
    { id: 'hindi', label: 'Hindi' },
    { id: 'telugu', label: 'Telugu' },
    { id: 'tamil', label: 'Tamil' }
  ];

  const handleFilterSelect = (filterType: keyof FilterState, value: string) => {
    if (filterType === 'sortBy') {
      onFilterChange({ [filterType]: value });
      return;
    }

    // For array filters
    const currentValues = filters[filterType] as string[];
    if (currentValues.includes(value)) {
      onFilterChange({
        [filterType]: currentValues.filter(v => v !== value)
      });
    } else {
      onFilterChange({
        [filterType]: [...currentValues, value]
      });
    }
  };

  const clearAllFilters = () => {
    onFilterChange({
      gender: [],
      experience: [],
      fees: [],
      availability: [],
      languages: [],
      consultationMode: [],
      specialization: [],
      rating: [],
      sortBy: 'relevance'
    });
  };

  return (
    <>
      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-25 z-40 md:hidden"
          onClick={onCloseMobileFilter}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "w-full bg-white md:bg-transparent md:block transition-transform duration-300 ease-in-out",
          "md:relative fixed inset-0 z-50 md:z-auto border-r border-gray-200",
          isMobileOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        )}
      >
        <div className="p-4 md:p-0 h-full">
          <div className="flex items-center justify-between border-b pb-3 mb-4">
            <h3 className="font-semibold text-gray-900 text-lg">Filters</h3>

            <div className="flex items-center">
              {activeFiltersCount > 0 && (
                <button
                  className="text-sm text-blue-600 hover:underline"
                  onClick={clearAllFilters}
                >
                  Clear All
                </button>
              )}

              <Button
                variant="ghost"
                size="sm"
                className="md:hidden ml-2"
                onClick={onCloseMobileFilter}
              >
                <X size={18} />
              </Button>
            </div>
          </div>

          <div className="mb-4">
            <Button
              variant="outline"
              className="w-full flex items-center justify-center gap-2 border border-blue-600 text-blue-600 py-2 rounded-md"
            >
              <MapPin className="h-4 w-4" />
              Show Doctors Near Me
            </Button>
          </div>

          <div className="space-y-6">
            <FilterSection
              title="Mode of Consult"
              options={consultModeOptions}
              selected={filters.consultationMode}
              onChange={(value) => handleFilterSelect('consultationMode', value)}
            />

            <FilterSection
              title="Gender"
              options={genderOptions}
              selected={filters.gender}
              onChange={(value) => handleFilterSelect('gender', value)}
            />

            <FilterSection
              title="Experience (In Years)"
              options={experienceOptions}
              selected={filters.experience}
              onChange={(value) => handleFilterSelect('experience', value)}
            />

            <FilterSection
              title="Fees (In Rupees)"
              options={feesOptions}
              selected={filters.fees}
              onChange={(value) => handleFilterSelect('fees', value)}
            />

            <FilterSection
              title="Language"
              options={languageOptions}
              selected={filters.languages}
              onChange={(value) => handleFilterSelect('languages', value)}
            />
          </div>
        </div>
      </aside>
    </>
  );
}