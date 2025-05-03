import { Heart, Mail, Phone } from 'lucide-react';
import Link from 'next/link';
import Logo from '@/components/shared/Logo';

export default function Footer() {
  const footerLinks = [
    {
      title: 'Apollo 247',
      links: ['About Us', 'Contact Us', 'FAQs', 'Health Queries', 'Terms and Conditions', 'Returns Policy', 'Refund Policy']
    },
    {
      title: 'Services',
      links: ['Online Doctor Consultation', 'Apollo Pharmacy', 'Diagnostics', 'Health Records', 'Apollo Circle Membership']
    }
  ];

  return (
    <footer className="bg-gray-100 pt-12 pb-6 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div>
            <Logo />
            <p className="mt-4 text-gray-600 text-sm">
              Apollo 247 is a digital extension of Apollo Hospitals with best-in-class technology & trusted healthcare services to every Indian.
            </p>
            <div className="mt-4 flex space-x-3">
              <Phone size={18} className="text-blue-600" />
              <p className="text-sm text-gray-600">1800 000 000</p>
            </div>
            <div className="mt-2 flex space-x-3">
              <Mail size={18} className="text-blue-600" />
              <p className="text-sm text-gray-600">support@apollo247.com</p>
            </div>
          </div>

          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-gray-800 font-semibold mb-4">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link}>
                    <Link href="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 pt-6 mt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-xs text-gray-500 mb-4 md:mb-0">
              © 2025 Apollo Clone. All Rights Reserved.
            </p>
            <div className="flex items-center text-xs text-gray-500">
              <span>Made with</span>
              <Heart size={14} className="mx-1 text-red-500" />
              <span>by Bolt</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}