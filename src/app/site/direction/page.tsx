import { Metadata } from 'next';
import CategoryPortfolio from '@/components/sections/CategoryPortfolio';

export const metadata: Metadata = {
  title: 'Direction',
  description: 'Direction - Creative directing work and visual storytelling by Simo Motsa',
  openGraph: {
    title: 'Direction',
    description: 'Direction - Creative directing work and visual storytelling by Simo Motsa',
    type: 'website',
    url: 'https://simomotsa.com/site/direction',
    siteName: 'Simo Motsa',
  },
  twitter: {
    card: 'summary',
    title: 'Direction',
    description: 'Direction - Creative directing work and visual storytelling by Simo Motsa',
  },
};

export default function DirectionPage() {
  return <CategoryPortfolio categoryName="Directing" categoryTitle="DIRECTION" />;
}
