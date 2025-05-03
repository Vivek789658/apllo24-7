'use client';

import { useState, useEffect } from 'react';
import { Search, Menu, X, ChevronDown, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Logo from '@/components/shared/Logo';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import DoctorRegistrationForm from '@/components/doctors/DoctorLoginForm';
import { getCurrentDoctor, logoutDoctor } from '@/lib/doctors-service';
import { Doctor } from '@/lib/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [currentDoctor, setCurrentDoctor] = useState<Doctor | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Check for logged in doctor on component mount
  useEffect(() => {
    const doctor = getCurrentDoctor();
    if (doctor) {
      setCurrentDoctor(doctor);
    }
  }, []);

  const handleLogout = () => {
    logoutDoctor();
    setCurrentDoctor(null);
    toast.success('Logged out successfully');
    // Reload the page to refresh the doctor list
    window.location.reload();
  };

  const navItems = [
    { name: 'Buy Medicines', active: false },
    { name: 'Find Doctors', active: true },
    { name: 'Lab Tests', active: false },
    { name: 'Circle Membership', active: false },
    { name: 'Health Records', active: false },
    { name: 'Diabetes Reversal', active: false },
    { name: 'Buy Insurance', isNew: true, active: false }
  ];

  return (
    <>
      <header
        className={cn(
          'fixed w-full z-50 transition-all duration-300 ease-in-out border-b border-gray-200',
          isScrolled ? 'bg-white shadow-sm' : 'bg-white'
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-6">
              <button
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <Logo />
              <div className="hidden md:flex items-center ml-2">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Select Location</span>
                  <div className="flex items-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-900">
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                    <span className="mx-1 text-sm font-medium text-gray-900">Select Address</span>
                    <ChevronDown size={14} className="text-gray-900" />
                  </div>
                </div>
              </div>
            </div>

            <div className="hidden md:flex items-center flex-1 mx-12">
              <div className="relative w-full max-w-3xl mx-auto">
                <input
                  type="text"
                  placeholder="Search Doctors, Specialities, Conditions etc."
                  className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                />
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
              </div>
            </div>

            <div className="flex items-center">
              {currentDoctor ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center space-x-2 hover:bg-blue-50 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={currentDoctor.image} alt={currentDoctor.name} />
                        <AvatarFallback>{currentDoctor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium hidden sm:inline-block">Dr. {currentDoctor.name.split(' ')[1] || currentDoctor.name}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      className="cursor-pointer flex items-center text-red-600"
                      onClick={handleLogout}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  className="rounded-full border-blue-600 text-blue-600 hover:bg-blue-50 px-5 py-1.5"
                  onClick={() => setIsLoginModalOpen(true)}
                >
                  <User size={18} className="mr-2" />
                  <span className="font-medium">Register as Doctor</span>
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Navigation bar */}
        <div className="border-t border-gray-200 hidden md:block bg-white">
          <div className="container mx-auto px-4">
            <nav className="flex items-center space-x-2 overflow-x-auto">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href="#"
                  className={cn(
                    'text-base font-medium py-3 px-4 hover:text-blue-600 transition-colors relative whitespace-nowrap',
                    item.active ? 'text-blue-600 font-semibold' : 'text-black'
                  )}
                >
                  {item.name}
                  {item.isNew && (
                    <span className="ml-1 text-[10px] bg-green-100 text-green-600 font-medium px-1.5 py-0.5 rounded">New</span>
                  )}
                  {item.active && (
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-t-sm"></span>
                  )}
                </a>
              ))}
            </nav>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="container mx-auto px-4 py-3">
              <div className="mb-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search Doctors, Specialities, Conditions etc."
                    className="pl-10 pr-4 py-2 w-full rounded-full border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                </div>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Doctor Registration Modal */}
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden max-h-[90vh]">
          <DialogHeader className="hidden">
            <DialogTitle>Doctor Registration</DialogTitle>
          </DialogHeader>
          <DoctorRegistrationForm onSuccess={() => {
            setIsLoginModalOpen(false);
            // Check for logged in doctor after registration
            const doctor = getCurrentDoctor();
            if (doctor) {
              setCurrentDoctor(doctor);
            }
            // Reload the page to refresh the doctor list
            window.location.reload();
          }} />
        </DialogContent>
      </Dialog>
    </>
  );
}