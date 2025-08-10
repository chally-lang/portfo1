import Blogs from "./components/Blogs";
import Hero from "./components/Hero";
import Newsletter from "./components/Newsletter";
import Projects from "./components/Projects";

export default function Home() {
  return (
    <main className="relative">
      {/* Global background gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-blue-50 via-white to-blue-100 -z-10" />
      
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-200/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-blue-100/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }} />
      </div>

      <Hero />
      <Projects />
      <Blogs />
      <Newsletter />
    </main>
  );
} 