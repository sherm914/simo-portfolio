import Header from '@/components/common/Header';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Simo Motsa',
    default: 'Simo Motsa - Portfolio',
  },
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-black text-white">
      <Header />
      {children}
    </div>
  );
}
