'use client';

import React from 'react';
import { Navigation } from '@/components/Navigation';

import { HeroSection } from '@/components/home/HeroSection';
import { IntroSection } from '@/components/home/IntroSection';
import { ServicesSection } from '@/components/home/ServicesSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { TestimonialsSection } from '@/components/home/TestimonialsSection';
import { LoadingScreen } from '@/components/LoadingScreen';
import { ConceptSection } from '@/components/home/ConceptSection';
import { Chatbot } from '@/components/Chatbot';

export default function HomePage() {
  const [isLoading, setIsLoading] = React.useState(true);

  return (
    <div className="font-sans antialiased text-slate-900 animate-[fadeIn_1s_ease-out] bg-[#fcfaf7]">
      {isLoading && <div className="fixed inset-0 z-[100]"><LoadingScreen onFinished={() => setIsLoading(false)} /></div>}
      <HeroSection />
      <IntroSection />
      <ServicesSection />
      <div className="relative z-50 -mt-[100dvh]">
        <NewsletterSection />
      </div>
      <TestimonialsSection />

      <Chatbot />
    </div>
  );
}