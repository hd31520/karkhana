import MainNavbar from '@/components/public/MainNavbar';
import Footer from '@/components/public/Footer';

export default function MainSiteLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <MainNavbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}