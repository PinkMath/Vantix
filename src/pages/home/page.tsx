import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import AboutSection from './components/AboutSection';
import ToolsSection from './components/ToolsSection';
import GallerySection from './components/GallerySection';
import Footer from './components/Footer';

export default function HomePage() {
  return (
    <main className="min-h-screen" style={{ fontFamily: "'Inter', sans-serif" }}>
      <Navbar />
      <HeroSection />
      <AboutSection />
      <ToolsSection />
      <GallerySection />
      <Footer />
    </main>
  );
}
