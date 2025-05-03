import { Doctor } from '@/lib/types';
import DoctorCard from '@/components/doctors/DoctorCard';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DoctorsListProps {
  doctors: Doctor[];
  isLoading: boolean;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function DoctorsList({
  doctors,
  isLoading,
  page,
  totalPages,
  onPageChange
}: DoctorsListProps) {
  // Generate an array of page numbers to display
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisible = 5; // Maximum number of page buttons to show

    if (totalPages <= maxVisible) {
      // Show all pages if they fit
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);

      // Calculate range around current page
      let startPage = Math.max(2, page - 1);
      let endPage = Math.min(totalPages - 1, page + 1);

      // Adjust range if needed
      if (page <= 2) {
        endPage = Math.min(4, totalPages - 1);
      } else if (page >= totalPages - 1) {
        startPage = Math.max(2, totalPages - 3);
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push('...');
      }

      // Add page numbers in range
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push('...');
      }

      // Always include last page
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  if (isLoading) {
    return (
      <div className="w-full md:flex-1 flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (doctors.length === 0) {
    return (
      <div className="w-full md:flex-1 flex flex-col items-center justify-center h-64 text-center">
        <span className="text-4xl mb-4">🔍</span>
        <h3 className="text-xl font-semibold text-gray-800">No doctors found</h3>
        <p className="text-gray-600 mt-2">
          Try adjusting your filters to see more results
        </p>
      </div>
    );
  }

  return (
    <div className="w-full md:flex-1">
      <div className="space-y-6">
        {doctors.map((doctor) => (
          <DoctorCard key={doctor.id} doctor={doctor} />
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>

            {getPageNumbers().map((pageNum, index) => (
              pageNum === '...' ? (
                <span key={`ellipsis-${index}`} className="px-3 py-2">...</span>
              ) : (
                <Button
                  key={`page-${pageNum}`}
                  variant={page === pageNum ? "default" : "outline"}
                  size="icon"
                  className={cn(
                    "h-9 w-9",
                    page === pageNum ? "bg-blue-600" : ""
                  )}
                  onClick={() => typeof pageNum === 'number' && onPageChange(pageNum)}
                >
                  {pageNum}
                </Button>
              )
            ))}

            <Button
              variant="outline"
              size="icon"
              className="h-9 w-9"
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}