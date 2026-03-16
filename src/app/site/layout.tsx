import Header from '@/components/common/Header';

export const metadata = {
  title: 'Simo Motsa - Portfolio',
};

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-black text-white">
      <Header />
      {children}
    </div>
  );
}
