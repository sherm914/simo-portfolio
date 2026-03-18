import { Metadata } from 'next';
import Contact from '@/components/sections/Contact';
import About from '@/components/sections/About';

export const metadata: Metadata = {
  title: 'Contact',
  description: 'Contact - Get in touch with Simo Motsa for inquiries and collaborations',
  openGraph: {
    title: 'Contact',
    description: 'Contact - Get in touch with Simo Motsa for inquiries and collaborations',
    type: 'website',
    url: 'https://simomotsa.com/site/contact',
    siteName: 'Simo Motsa',
  },
  twitter: {
    card: 'summary',
    title: 'Contact',
    description: 'Contact - Get in touch with Simo Motsa for inquiries and collaborations',
  },
};

export default function ContactPage() {
  return (
    <main>
      <About />
      <Contact />
    </main>
  );
}
