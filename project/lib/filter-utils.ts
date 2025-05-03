import { Doctor, FilterState } from '@/lib/types';

export function filterDoctors(doctors: Doctor[], filters: FilterState): Doctor[] {

  let filteredDoctors = [...doctors];


  if (filters.gender.length > 0) {
    filteredDoctors = filteredDoctors.filter(doctor =>
      filters.gender.includes(doctor.gender)
    );
  }


  if (filters.experience.length > 0) {
    filteredDoctors = filteredDoctors.filter(doctor => {
      return filters.experience.some(range => {
        if (range === '0-5') return doctor.experience >= 0 && doctor.experience <= 5;
        if (range === '5-10' || range === '6-10') return doctor.experience > 5 && doctor.experience <= 10;
        if (range === '10-15' || range === '11-16') return doctor.experience > 10 && doctor.experience <= 16;
        if (range === '15+') return doctor.experience > 15;
        return false;
      });
    });
  }


  if (filters.fees.length > 0) {
    filteredDoctors = filteredDoctors.filter(doctor => {
      return filters.fees.some(range => {
        if (range === '0-500' || range === '100-500') return doctor.fees >= 0 && doctor.fees <= 500;
        if (range === '500-1000') return doctor.fees > 500 && doctor.fees <= 1000;
        if (range === '1000-1500' || range === '1000+') return doctor.fees > 1000;
        return false;
      });
    });
  }


  if (filters.availability.length > 0) {
    filteredDoctors = filteredDoctors.filter(doctor => {
      return filters.availability.some(availability => {
        if (availability === 'today') return doctor.availableToday;
        if (availability === 'tomorrow') return doctor.availableTomorrow;
        // Handle hospital and online options (these were mapped incorrectly from consultation mode)
        if (availability === 'hospital' || availability === 'online') {
          return doctor.specialties && doctor.specialties.some(
            specialty => specialty.toLowerCase() === availability.toLowerCase()
          );
        }
        if (availability === 'weekdays') return true; // Assume weekdays if not specified
        if (availability === 'weekends') return true; // Assume weekends if not specified
        if (availability === 'thisWeek') return true; // Assume all doctors are available this week
        return false;
      });
    });
  }


  if (filters.languages.length > 0) {
    filteredDoctors = filteredDoctors.filter(doctor =>
      filters.languages.some(language =>
        doctor.languages.some(docLang =>
          docLang.toLowerCase() === language.toLowerCase()
        )
      )
    );
  }


  if (filters.consultationMode && filters.consultationMode.length > 0) {
    filteredDoctors = filteredDoctors.filter(doctor =>
      doctor.specialties && Array.isArray(doctor.specialties) && doctor.specialties.length > 0 &&
      filters.consultationMode.some(mode =>
        doctor.specialties!.some(specialty =>
          specialty.toLowerCase().includes(mode.toLowerCase())
        )
      )
    );
  }


  if (filters.specialization && filters.specialization.length > 0) {
    filteredDoctors = filteredDoctors.filter(doctor =>
      filters.specialization.some(spec =>
        doctor.specialization.toLowerCase().includes(spec.toLowerCase())
      )
    );
  }


  if (filters.rating && filters.rating.length > 0) {
    filteredDoctors = filteredDoctors.filter(doctor => {
      return filters.rating.some(range => {
        const rating = parseFloat(range);
        return doctor.ratings >= rating;
      });
    });
  }

  switch (filters.sortBy) {
    case 'experience':
      filteredDoctors.sort((a, b) => b.experience - a.experience);
      break;
    case 'fees':
      filteredDoctors.sort((a, b) => a.fees - b.fees);
      break;
    case 'rating':
      filteredDoctors.sort((a, b) => b.ratings - a.ratings);
      break;
    case 'relevance':
    default:

      filteredDoctors.sort((a, b) => {

        if (a.availableToday && !b.availableToday) return -1;
        if (!a.availableToday && b.availableToday) return 1;


        if (a.ratings !== b.ratings) return b.ratings - a.ratings;

        return b.experience - a.experience;
      });
      break;
  }

  return filteredDoctors;
}