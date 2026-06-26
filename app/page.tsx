import Hero from './components/Hero';
import ServiciosSection from './components/ServiciosSection';
import TestimoniosSection from './components/TestimoniosSection';
import CTAFinalSection from './components/CTAFinalSection';
import Footer from './components/Footer';
import FloatingWhatsApp from './components/FloatingWhatsApp';

export default function Home() {
  return (
    <main>
      <Hero />
      <ServiciosSection />
      <TestimoniosSection />
      <CTAFinalSection />
      <Footer />
      <FloatingWhatsApp />
    </main>
  );
}
