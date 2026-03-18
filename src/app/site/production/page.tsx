import { Metadata } from 'next';
import CategoryPortfolio from '@/components/sections/CategoryPortfolio';

export const metadata: Metadata = {
  title: 'Production',
  description: 'Production - Production design and coordination work by Simo Motsa',
  openGraph: {
    title: 'Production',
    description: 'Production - Production design and coordination work by Simo Motsa',
    type: 'website',
    url: 'https://simomotsa.com/site/production',
    siteName: 'Simo Motsa',
  },
  twitter: {
    card: 'summary',
    title: 'Production',
    description: 'Production - Production design and coordination work by Simo Motsa',
  },
};

export default function ProductionPage() {
  return <CategoryPortfolio categoryName="Production" categoryTitle="PRODUCTION" />;
}
