export interface Doctor {
  id: string;
  name: string;
  image: string;
  specialization: string;
  qualifications: string;
  experience: number;
  ratings: number;
  reviews: number;
  fees: number;
  availableToday: boolean;
  availableTomorrow: boolean;
  gender: 'male' | 'female';
  languages: string[];
  specialties?: string[];
  location?: string;
  hospital?: string;
  email?: string;
  phone?: string;
  bio?: string;
  isVerified?: boolean;
}

export interface FilterState {
  gender: string[];
  experience: string[];
  fees: string[];
  availability: string[];
  languages: string[];
  consultationMode: string[];
  specialization: string[];
  rating: string[];
  sortBy: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface DoctorRegistration {
  name: string;
  email: string;
  password: string;
  specialization: string;
  experience: string;
  phone: string;
  bio: string;
  availability: string;
  consultMode: string[];
  fees: string;
  languages: string[];
  image?: string | FileList;
}