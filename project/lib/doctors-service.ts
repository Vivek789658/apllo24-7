'use client';

import { DoctorRegistration, LoginCredentials, Doctor } from './types';
import { mockDoctorsData } from './mock-data';


const DOCTORS_STORAGE_KEY = 'apollo_doctors';


const initializeDoctorsDB = () => {
    if (typeof window !== 'undefined') {
        const existingDoctors = localStorage.getItem(DOCTORS_STORAGE_KEY);
        if (!existingDoctors) {
            localStorage.setItem(DOCTORS_STORAGE_KEY, JSON.stringify(mockDoctorsData));
        }
    }
};


export const getAllDoctors = (): Doctor[] => {
    if (typeof window === 'undefined') {
        return mockDoctorsData;
    }

    initializeDoctorsDB();
    const doctorsJson = localStorage.getItem(DOCTORS_STORAGE_KEY);
    return doctorsJson ? JSON.parse(doctorsJson) : [];
};


const saveDoctors = (doctors: Doctor[]) => {
    if (typeof window !== 'undefined') {
        try {
            const doctorsJson = JSON.stringify(doctors);
            console.log(`Saving ${doctors.length} doctors to localStorage, data size: ${doctorsJson.length} chars`);


            if (doctorsJson.length > 5000000) {
                console.warn('Data being saved is very large and may exceed localStorage limits');
            }

            localStorage.setItem(DOCTORS_STORAGE_KEY, doctorsJson);
            console.log('Doctors data saved successfully');
        } catch (error) {
            console.error('Error saving doctors to localStorage:', error);


            if (error instanceof DOMException && error.name === 'QuotaExceededError') {
                console.log('QuotaExceededError detected, trying to save without large image data');


                const trimmedDoctors = doctors.map(doc => {

                    return {
                        ...doc,
                        image: doc.image.startsWith('data:')
                            ? 'https://randomuser.me/api/portraits/men/1.jpg'
                            : doc.image
                    };
                });

                try {
                    localStorage.setItem(DOCTORS_STORAGE_KEY, JSON.stringify(trimmedDoctors));
                    console.log('Saved doctors with trimmed image data');
                } catch (fallbackError) {
                    console.error('Failed to save even with trimmed data:', fallbackError);
                }
            }

            throw error;
        }
    }
};


export const createDoctorAccount = async (data: DoctorRegistration & { image?: string }): Promise<Doctor> => {
    console.log('Creating doctor account with data:', {
        ...data,
        image: data.image ? `${data.image.substring(0, 30)}... (${data.image.length} chars)` : 'No image'
    });

    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
        const doctors = getAllDoctors();
        console.log(`Retrieved ${doctors.length} existing doctors`);


        const existingDoctor = doctors.find(doc => doc.email === data.email);
        if (existingDoctor) {
            console.error('Doctor with this email already exists:', data.email);
            throw new Error('Doctor with this email already exists');
        }


        const newDoctor: Doctor = {
            id: `doc-${Date.now()}`,
            name: data.name,

            image: data.image || `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 50) + 1}.jpg`,
            specialization: data.specialization,
            qualifications: 'MBBS, MD',
            experience: parseInt(data.experience, 10),
            ratings: 0,
            reviews: 0,
            fees: data.fees ? parseInt(data.fees, 10) : Math.floor(Math.random() * 1000) + 500,
            availableToday: data.availability === 'everyday' || data.availability === 'weekdays',
            availableTomorrow: data.availability === 'everyday' || (data.availability === 'weekends' && new Date().getDay() === 5),
            gender: Math.random() > 0.5 ? 'male' : 'female',
            languages: data.languages || ['English', 'Hindi'],

            specialties: data.consultMode || [],
            email: data.email,
            phone: data.phone,
            bio: data.bio,
            isVerified: false,

        };

        console.log('Created new doctor object:', {
            id: newDoctor.id,
            name: newDoctor.name,
            email: newDoctor.email,
            imageSize: newDoctor.image.length
        });


        const updatedDoctors = [...doctors, newDoctor];
        try {
            saveDoctors(updatedDoctors);
            console.log('Doctor saved successfully');
        } catch (saveError) {
            console.error('Error saving doctor data:', saveError);
            throw new Error('Failed to save doctor data');
        }

        return newDoctor;
    } catch (error) {
        console.error('Error in createDoctorAccount:', error);
        throw error;
    }
};


export const loginDoctor = async (credentials: LoginCredentials): Promise<Doctor> => {

    await new Promise(resolve => setTimeout(resolve, 1000));

    const doctors = getAllDoctors();


    const doctor = doctors.find(doc => doc.email === credentials.email);

    if (!doctor) {
        throw new Error('Doctor not found');
    }


    if (typeof window !== 'undefined') {
        localStorage.setItem('current_doctor', JSON.stringify(doctor));
    }

    return doctor;
};


export const getCurrentDoctor = (): Doctor | null => {
    if (typeof window === 'undefined') {
        return null;
    }

    const doctorJson = localStorage.getItem('current_doctor');
    return doctorJson ? JSON.parse(doctorJson) : null;
};


export const logoutDoctor = (): void => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('current_doctor');
    }
};


export const updateDoctorProfile = async (doctorId: string, updates: Partial<Doctor>): Promise<Doctor> => {

    await new Promise(resolve => setTimeout(resolve, 1000));

    const doctors = getAllDoctors();
    const doctorIndex = doctors.findIndex(doc => doc.id === doctorId);

    if (doctorIndex === -1) {
        throw new Error('Doctor not found');
    }


    const updatedDoctor = { ...doctors[doctorIndex], ...updates };
    doctors[doctorIndex] = updatedDoctor;

    saveDoctors(doctors);


    const currentDoctor = getCurrentDoctor();
    if (currentDoctor && currentDoctor.id === doctorId) {
        localStorage.setItem('current_doctor', JSON.stringify(updatedDoctor));
    }

    return updatedDoctor;
}; 