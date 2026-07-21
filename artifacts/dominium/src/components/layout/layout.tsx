import { useEffect } from "react";
import { useLocation } from "wouter";
import { Navbar } from "./navbar";
import { Footer } from "./footer";

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background text-foreground selection:bg-primary/30 selection:text-white">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 flex flex-col relative">
        {/* Grungy noise texture overlay */}
        <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        {children}
      </main>
      <Footer />
    </div>
  );
}
