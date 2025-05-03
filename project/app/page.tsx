import { Suspense } from 'react';
import Header from '@/components/layout/Header';
import DoctorsPage from '@/components/pages/DoctorsPage';
import Footer from '@/components/layout/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Best General Physicians & Internists Online | Apollo 247 Clone',
  description: 'Consult with top general physicians & internal medicine specialists online. Get expert medical advice, prescriptions & care from experienced doctors.',
  openGraph: {
    title: 'Best General Physicians & Internists Online | Apollo 247 Clone',
    description: 'Consult with top general physicians & internal medicine specialists online. Get expert medical advice, prescriptions & care from experienced doctors.',
    type: 'website',
  },
};

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col">
      <Header />
      <Suspense fallback={<div className="flex items-center justify-center h-screen">Loading...</div>}>
        <DoctorsPage />
      </Suspense>
      <Footer />
    </main>
  );
}