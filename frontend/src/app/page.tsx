import LandingHeader from '@/components/landing/LandingHeader';
import HeroSection from '@/components/landing/HeroSection';
import AboutProjectSection from '@/components/landing/AboutProjectSection';
import CourseCurriculum from '@/components/landing/CourseCurriculum';
import CallToActionSection from '@/components/landing/CallToActionSection';
import LandingFooter from '@/components/landing/LandingFooter';

export const metadata = {
  title: 'Coleta-Cacau Academy — Domine React Native construindo um app real',
  description: 'Aprenda React Native do zero construindo, na prática, um aplicativo de coleta de cacau para o agronegócio.',
};

export default function LandingPage() {
  return (
    <div className="landing-page">
      <LandingHeader />
      <main>
        <HeroSection />
        <AboutProjectSection />
        <CourseCurriculum />
        <CallToActionSection />
      </main>
      <LandingFooter />
    </div>
  );
}
