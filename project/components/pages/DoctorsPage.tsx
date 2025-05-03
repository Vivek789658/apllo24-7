'use client';

import { useState, useEffect } from 'react';
import FilterSidebar from '@/components/filters/FilterSidebar';
import DoctorsList from '@/components/doctors/DoctorsList';
import DoctorsHeader from '@/components/doctors/DoctorsHeader';
import { Doctor, FilterState } from '@/lib/types';
import { filterDoctors } from '@/lib/filter-utils';
import { getAllDoctors, getCurrentDoctor } from '@/lib/doctors-service';
import { toast } from 'sonner';

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [filteredDoctors, setFilteredDoctors] = useState<Doctor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);
  const [filters, setFilters] = useState<FilterState>({
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

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const pageSize = 10;
  useEffect(() => {
    setTimeout(() => {

      const allDoctors = getAllDoctors();
      setDoctors(allDoctors);
      setIsLoading(false);


      const loggedInDoctor = getCurrentDoctor();
      if (loggedInDoctor) {
        setCurrentDoctor(loggedInDoctor);
        toast.success(`Welcome back, Dr. ${loggedInDoctor.name.split(' ')[1] || loggedInDoctor.name}`);
      }
    }, 800);
  }, []);


  useEffect(() => {
    if (doctors.length > 0) {
      const filtered = filterDoctors(doctors, filters);
      setFilteredDoctors(filtered);
      setTotalPages(Math.ceil(filtered.length / pageSize));
      setPage(1);
    }
  }, [doctors, filters]);

  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      ...newFilters,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const getCurrentPageDoctors = () => {
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredDoctors.slice(startIndex, endIndex);
  };


  useEffect(() => {

    const style = document.createElement('style');
    style.innerHTML = `
      .filter-sidebar-container {
        position: sticky;
        top: 130px;
        height: calc(100vh - 150px);
        overflow-y: auto;
        scrollbar-width: thin;
        scrollbar-color: rgba(0, 0, 0, 0.2) transparent;
      }
      
      .filter-sidebar-container::-webkit-scrollbar {
        width: 6px;
      }
      
      .filter-sidebar-container::-webkit-scrollbar-track {
        background: transparent;
      }
      
      .filter-sidebar-container::-webkit-scrollbar-thumb {
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 6px;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);


  const handleSortByChange = (sortBy: string) => {
    handleFilterChange({ sortBy });
  };

  return (
    <div className="container mx-auto px-4 pt-32 pb-12">
      <DoctorsHeader
        title="Consult General Physicians Online"
        subtitle="Get expert medical advice from top doctors"
        resultCount={filteredDoctors.length}
        onOpenMobileFilter={() => setIsMobileFilterOpen(true)}
      />

      <div className="flex flex-col md:flex-row gap-0">
        <div className="md:w-64 lg:w-72">
          <div className="filter-sidebar-container">
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
              isMobileOpen={isMobileFilterOpen}
              onCloseMobileFilter={() => setIsMobileFilterOpen(false)}
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col mt-4 md:mt-1">
          {currentDoctor && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800">Welcome, Dr. {currentDoctor.name.split(' ')[1] || currentDoctor.name}</h3>
              <p className="text-sm text-blue-700 mt-1">
                {currentDoctor.isVerified ?
                  'Your profile is verified and visible to patients.' :
                  'Your profile is pending verification. We will notify you once approved.'}
              </p>
            </div>
          )}

          <DoctorsList
            doctors={getCurrentPageDoctors()}
            isLoading={isLoading}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>
    </div>
  );
}