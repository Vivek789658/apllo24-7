'use client';

// Exported as DoctorRegistrationForm component
// This file should be renamed to DoctorRegistrationForm.tsx for consistency

import { useState, useRef } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { createDoctorAccount } from '@/lib/doctors-service';
import { User } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const registerSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
    email: z.string().email({ message: 'Please enter a valid email address' }),
    password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    specialization: z.string().min(1, { message: 'Please select a specialization' }),
    experience: z.string().min(1, { message: 'Please enter your experience' }),
    phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
    bio: z.string().min(10, { message: 'Bio must be at least 10 characters' }),
    // Add new fields
    availability: z.string().min(1, { message: 'Please select availability' }),
    consultMode: z.array(z.string()).min(1, { message: 'Please select at least one consultation mode' }),
    fees: z.string().min(1, { message: 'Please enter your consultation fees' }),
    languages: z.array(z.string()).min(1, { message: 'Please select at least one language' }),
    // Make image optional in the schema, we'll handle validation in the submit handler
    image: z.any().optional(),
});

interface DoctorRegistrationFormProps {
    onSuccess: () => void;
}

export default function DoctorRegistrationForm({ onSuccess }: DoctorRegistrationFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // Register form
    const registerForm = useForm<z.infer<typeof registerSchema>>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: '',
            email: '',
            password: '',
            specialization: '',
            experience: '',
            phone: '',
            bio: '',
            availability: '',
            consultMode: [],
            fees: '',
            languages: [],
        },
    });

    const handleRegisterSubmit = async (values: z.infer<typeof registerSchema>) => {
        setIsSubmitting(true);
        console.log('Registration started with values:', { ...values, image: values.image ? 'File present' : 'No image' });

        try {
            // Manual validation for the image
            if (!values.image || !(values.image instanceof FileList) || values.image.length === 0) {
                console.log('Image validation failed: No image file detected');
                toast.error('Please upload a profile image');
                setIsSubmitting(false);
                return;
            }

            const imageFile = values.image[0];

            // Validate file size and type already done in handleImageChange
            console.log('Processing image file:', {
                name: imageFile.name,
                size: `${Math.round(imageFile.size / 1024)}KB`,
                type: imageFile.type
            });

            try {
                // Compress the image to a smaller size
                console.log('Compressing image...');
                const compressedImageUrl = await compressImage(imageFile);
                console.log('Image compressed successfully, new size:', compressedImageUrl.length);

                // Prepare doctor data with all fields including image
                const doctorData = {
                    name: values.name,
                    email: values.email,
                    password: values.password,
                    specialization: values.specialization,
                    experience: values.experience,
                    phone: values.phone,
                    bio: values.bio,
                    // New fields
                    availability: values.availability,
                    consultMode: values.consultMode,
                    fees: values.fees,
                    languages: values.languages,
                    image: compressedImageUrl
                };

                console.log('Submitting registration data');

                // Submit doctor registration
                await createDoctorAccount(doctorData);

                console.log('Registration successful');
                toast.success('Registration successful!');
                registerForm.reset();
                setPreviewUrl(null);
                onSuccess();
            } catch (error: any) {
                console.error('Registration error:', error);
                toast.error(error?.message || 'Registration failed. Please try again.');
            }
        } catch (error: any) {
            console.error('Error during registration:', error);
            toast.error(error?.message || 'An unexpected error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        console.log('Selected image:', { name: file.name, size: `${Math.round(file.size / 1024)}KB`, type: file.type });

        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
            toast.error(`Image is too large. Maximum size is 5MB.`);
            e.target.value = ''; // Reset the input
            return;
        }

        // Validate file type
        if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
            toast.error('Please select a valid image file (JPG, PNG, or WebP)');
            e.target.value = ''; // Reset the input
            return;
        }

        // Create a preview
        const reader = new FileReader();
        reader.onload = () => {
            setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Update the form
        registerForm.setValue('image', e.target.files);
    };

    // Helper function to compress image
    const compressImage = async (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    // Determine new dimensions (max 300px width/height)
                    let width = img.width;
                    let height = img.height;
                    const maxDimension = 300;

                    if (width > height && width > maxDimension) {
                        height = Math.round(height * (maxDimension / width));
                        width = maxDimension;
                    } else if (height > maxDimension) {
                        width = Math.round(width * (maxDimension / height));
                        height = maxDimension;
                    }

                    canvas.width = width;
                    canvas.height = height;

                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);

                    // Convert to JPG at 80% quality to reduce size further
                    const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.8);
                    console.log(`Image compressed from ${(event.target?.result as string).length} to ${compressedDataUrl.length} chars`);
                    resolve(compressedDataUrl);
                };
                img.onerror = () => {
                    reject(new Error('Failed to load image'));
                };
            };
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
        });
    };

    const specializations = [
        'General Medicine',
        'Internal Medicine',
        'Cardiology',
        'Dermatology',
        'Neurology',
        'Orthopedics',
        'Pediatrics',
        'Psychiatry',
        'Gynecology',
        'Ophthalmology',
        'Oncology',
        'Urology',
        'ENT',
        'Dental',
        'Radiology',
    ];

    return (
        <div className="w-full bg-white rounded-lg overflow-hidden shadow-lg">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-5 text-white">
                <h2 className="text-2xl font-bold mb-1 text-center">Doctor Registration</h2>
                <p className="text-center text-sm text-blue-100">Join our healthcare platform and connect with patients</p>
            </div>

            <div className="px-6 py-4 max-h-[70vh] overflow-y-auto">
                <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(handleRegisterSubmit)} className="space-y-4" id="doctor-registration-form">
                        {/* Profile Image Upload */}
                        <FormField
                            control={registerForm.control}
                            name="image"
                            render={({ field: { onChange, value, ...rest } }) => (
                                <FormItem className="flex flex-col items-center space-y-3 mb-4">
                                    <FormLabel className="text-center w-full font-medium text-gray-700">Profile Image</FormLabel>
                                    <FormControl>
                                        <div className="flex flex-col items-center space-y-2">
                                            <div className="relative h-24 w-24 rounded-full border-2 border-dashed border-blue-300 flex items-center justify-center overflow-hidden bg-blue-50">
                                                {previewUrl ? (
                                                    <img
                                                        src={previewUrl}
                                                        alt="Preview"
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <User size={36} className="text-blue-400" />
                                                )}
                                            </div>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                ref={fileInputRef}
                                                onChange={(e) => {
                                                    onChange(e.target.files);
                                                    handleImageChange(e);
                                                }}
                                                className="hidden"
                                            />
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                className="rounded-full border-blue-500 text-blue-600 hover:bg-blue-50 text-xs px-3 py-1"
                                                onClick={() => fileInputRef.current?.click()}
                                            >
                                                {previewUrl ? "Change Photo" : "Upload Photo"}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-3">
                            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                Personal Information
                            </h3>

                            <FormField
                                control={registerForm.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem className="mb-3">
                                        <FormLabel className="text-gray-700 text-sm">Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Dr. John Doe" {...field} className="focus:border-blue-500" />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                <FormField
                                    control={registerForm.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 text-sm">Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="doctor@example.com" {...field} className="focus:border-blue-500" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={registerForm.control}
                                    name="phone"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 text-sm">Phone</FormLabel>
                                            <FormControl>
                                                <Input placeholder="+91 9876543210" {...field} className="focus:border-blue-500" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-3">
                            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                Account Security
                            </h3>

                            <FormField
                                control={registerForm.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 text-sm">Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="••••••••" {...field} className="focus:border-blue-500" />
                                        </FormControl>
                                        <p className="text-xs text-gray-500 mt-1">Must be at least 6 characters</p>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 mb-3">
                            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                                </svg>
                                Professional Details
                            </h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                <FormField
                                    control={registerForm.control}
                                    name="specialization"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 text-sm">Specialization</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="focus:ring-blue-500">
                                                        <SelectValue placeholder="Select specialization" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    {specializations.map((spec) => (
                                                        <SelectItem key={spec} value={spec}>
                                                            {spec}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={registerForm.control}
                                    name="experience"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 text-sm">Experience (years)</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="5" {...field} className="focus:border-blue-500" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                <FormField
                                    control={registerForm.control}
                                    name="fees"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 text-sm">Consultation Fees (₹)</FormLabel>
                                            <FormControl>
                                                <Input type="number" placeholder="500" {...field} className="focus:border-blue-500" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={registerForm.control}
                                    name="availability"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 text-sm">Availability</FormLabel>
                                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                <FormControl>
                                                    <SelectTrigger className="focus:ring-blue-500">
                                                        <SelectValue placeholder="Select availability" />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value="weekdays">Weekdays</SelectItem>
                                                    <SelectItem value="weekends">Weekends</SelectItem>
                                                    <SelectItem value="everyday">Everyday</SelectItem>
                                                    <SelectItem value="custom">Custom Hours</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-3 mb-3">
                                <FormField
                                    control={registerForm.control}
                                    name="consultMode"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 text-sm">Consultation Mode</FormLabel>
                                            <div className="flex flex-wrap gap-3 mt-1">
                                                {['Online', 'In-clinic', 'Home Visit'].map((mode) => (
                                                    <div key={mode} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`mode-${mode}`}
                                                            onCheckedChange={(checked) => {
                                                                const currentModes = registerForm.getValues().consultMode || [];
                                                                if (checked) {
                                                                    registerForm.setValue('consultMode', [...currentModes, mode.toLowerCase()]);
                                                                } else {
                                                                    registerForm.setValue('consultMode',
                                                                        currentModes.filter(m => m !== mode.toLowerCase())
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                        <label
                                                            htmlFor={`mode-${mode}`}
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                        >
                                                            {mode}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-3 mb-3">
                                <FormField
                                    control={registerForm.control}
                                    name="languages"
                                    render={() => (
                                        <FormItem>
                                            <FormLabel className="text-gray-700 text-sm">Languages Spoken</FormLabel>
                                            <div className="flex flex-wrap gap-3 mt-1">
                                                {['English', 'Hindi', 'Tamil', 'Telugu', 'Malayalam', 'Kannada', 'Bengali', 'Marathi', 'Gujarati'].map((language) => (
                                                    <div key={language} className="flex items-center space-x-2">
                                                        <Checkbox
                                                            id={`lang-${language}`}
                                                            onCheckedChange={(checked) => {
                                                                const currentLangs = registerForm.getValues().languages || [];
                                                                if (checked) {
                                                                    registerForm.setValue('languages', [...currentLangs, language.toLowerCase()]);
                                                                } else {
                                                                    registerForm.setValue('languages',
                                                                        currentLangs.filter(l => l !== language.toLowerCase())
                                                                    );
                                                                }
                                                            }}
                                                        />
                                                        <label
                                                            htmlFor={`lang-${language}`}
                                                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                                        >
                                                            {language}
                                                        </label>
                                                    </div>
                                                ))}
                                            </div>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>

                            <FormField
                                control={registerForm.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-gray-700 text-sm">Professional Bio</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                placeholder="Tell patients about your experience, qualifications, and specialties..."
                                                className="resize-none focus:border-blue-500"
                                                rows={3}
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </form>
                </Form>
            </div>

            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                <Button
                    type="submit"
                    form="doctor-registration-form"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <span className="flex items-center justify-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Registering...
                        </span>
                    ) : "Register as Doctor"}
                </Button>
                <p className="text-center text-xs text-gray-500 mt-3">
                    By registering, you agree to our Terms of Service and Privacy Policy
                </p>
            </div>
        </div>
    );
} 