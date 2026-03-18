import { Metadata } from 'next';
import CategoryPortfolio from '@/components/sections/CategoryPortfolio';

export const metadata: Metadata = {
  title: 'Editorial',
  description: 'Editorial - Editorial photography and design work by Simo Motsa',
  openGraph: {
    title: 'Editorial',
    description: 'Editorial - Editorial photography and design work by Simo Motsa',
    type: 'website',
    url: 'https://simomotsa.com/site/editorial',
    siteName: 'Simo Motsa',
  },
  twitter: {
    card: 'summary',
    title: 'Editorial',
    description: 'Editorial - Editorial photography and design work by Simo Motsa',
  },
};

export default function EditorialPage() {
  return <CategoryPortfolio categoryName="Editorial" categoryTitle="EDITORIAL" />;
}
