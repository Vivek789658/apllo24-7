import { ThumbsUp, Info, MapPin, Globe, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { Doctor } from '@/lib/types';

interface DoctorCardProps {
  doctor: Doctor;
  isDoctorOfHour?: boolean;
}

export default function DoctorCard({ doctor, isDoctorOfHour = false }: DoctorCardProps) {
  const {
    name,
    image,
    specialization,
    qualifications,
    experience,
    ratings,
    reviews,
    fees,
    location,
    hospital,
    languages,
    specialties,
    availableToday,
    availableTomorrow
  } = doctor;

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden mb-6 max-w-[900px]">
      <div className="p-6">
        <div className="flex flex-col md:flex-row gap-5">
          {/* Doctor Image and Apollo Badge */}
          <div className="flex-shrink-0 relative">
            <div className="w-24 h-24">
              <Image
                src={image || "/placeholder-doctor.svg"}
                alt={`Dr. ${name}`}
                width={96}
                height={96}
                className="rounded-full object-cover"
              />
              <div className="absolute bottom-0 left-0">
                <div className="bg-white rounded-full w-11 h-11 flex items-center justify-center border border-blue-500">
                  <Image
                    src="/apollo-doctor-badge.svg"
                    alt="Apollo Doctor"
                    width={36}
                    height={36}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Doctor Details */}
          <div className="flex-1">
            {/* Doctor of the Hour Badge */}
            <div className="flex items-start justify-between">
              <div className="flex items-center">
                <h3 className="text-lg font-semibold text-gray-900">Dr. {name}</h3>
                <Info className="h-4 w-4 text-gray-400 ml-1" />
              </div>

              {isDoctorOfHour && (
                <div className="bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded">
                  DOCTOR OF THE HOUR
                </div>
              )}
            </div>

            <p className="text-gray-600 text-sm mt-0.5">{specialization}</p>
            <div className="flex items-center text-purple-600 mt-1">
              <span className="text-sm font-medium">{experience} YEARS</span>
              <span className="mx-1.5 text-gray-400">•</span>
              <span className="text-sm font-medium">{qualifications}</span>
            </div>

            {/* Location and Hospital */}
            {hospital && (
              <div className="mt-2 text-gray-600 flex items-center">
                <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                <p className="text-gray-500 text-sm">{hospital}</p>
              </div>
            )}

            {/* Languages */}
            {languages && languages.length > 0 && (
              <div className="mt-2 flex items-center">
                <Globe className="h-4 w-4 mr-1 text-gray-400" />
                <p className="text-gray-500 text-sm">
                  Speaks: {languages.join(', ')}
                </p>
              </div>
            )}

            {/* Specialties/Consultation Modes */}
            {specialties && specialties.length > 0 && (
              <div className="mt-2">
                <div className="flex flex-wrap gap-2">
                  {specialties.map((specialty, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-50 text-blue-700"
                    >
                      <Check className="h-3 w-3 mr-1" />
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Availability */}
            <div className="mt-2 flex gap-2">
              {availableToday && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-50 text-green-700">
                  Available Today
                </span>
              )}
              {availableTomorrow && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-emerald-50 text-emerald-700">
                  Available Tomorrow
                </span>
              )}
            </div>

            {/* Ratings */}
            <div className="mt-2 flex items-center">
              <div className="flex items-center bg-green-50 px-2 py-1 rounded">
                <span className="font-medium text-sm text-green-700">{ratings}</span>
                <span className="text-xs ml-1 text-green-600">Rating</span>
              </div>
              <span className="mx-2 text-gray-400">•</span>
              <span className="text-gray-500 text-sm">{reviews} Reviews</span>
            </div>

            {/* Fees and Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4">
              <div className="flex items-center gap-4 mb-3 sm:mb-0">
                <div>
                  <span className="text-xl font-bold text-gray-900">₹{fees}</span>
                  <div className="text-sm text-orange-600 font-medium">No Booking Fees</div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="border-teal-600 text-teal-600 hover:bg-teal-50 px-4 py-2 rounded font-medium text-sm"
                >
                  Consult Online
                </Button>

                <Button
                  className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded font-medium text-sm"
                >
                  Visit Doctor
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}