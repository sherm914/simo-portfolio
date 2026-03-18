import { Metadata } from 'next';
import CategoryPortfolio from '@/components/sections/CategoryPortfolio';

export const metadata: Metadata = {
  title: 'VFX',
  description: 'VFX - Visual effects and digital animation work by Simo Motsa',
  openGraph: {
    title: 'VFX',
    description: 'VFX - Visual effects and digital animation work by Simo Motsa',
    type: 'website',
    url: 'https://simomotsa.com/site/vfx',
    siteName: 'Simo Motsa',
  },
  twitter: {
    card: 'summary',
    title: 'VFX',
    description: 'VFX - Visual effects and digital animation work by Simo Motsa',
  },
};

export default function VFXPage() {
  return <CategoryPortfolio categoryName="VFX" categoryTitle="VFX" />;
}
