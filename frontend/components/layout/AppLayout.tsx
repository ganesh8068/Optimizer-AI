import React, { useState } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import TopNavbar from '@/components/layout/TopNavbar';
import { AuthUser } from '@/services/authService';
import { Footer } from '@/components/ui/modem-animated-footer';
import { Twitter, Linkedin, Github, Mail } from 'lucide-react';

interface AppLayoutProps {
  children: React.ReactNode;
  currentView: string;
  navigateTo: (view: any) => void;
  user: AuthUser | null;
  handleLogout: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  currentView,
  navigateTo,
  user,
  handleLogout,
  isDarkMode,
  toggleDarkMode
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const footerSocials = [
    { icon: <Twitter />, href: "#", label: "Twitter" },
    { icon: <Linkedin />, href: "#", label: "LinkedIn" },
    { icon: <Github />, href: "#", label: "GitHub" },
    { icon: <Mail />, href: "mailto:hello@optimizer.ai", label: "Email" },
  ];

  const footerNav = [
    { label: "Pricing", href: "#" },
    { label: "Methodology", href: "#" },
    { label: "Privacy", href: "#" },
    { label: "Terms", href: "#" },
  ];

  return (
    <div className={`flex h-screen overflow-hidden ${isDarkMode ? 'dark bg-[#0E1117]' : 'bg-[#FAFAFA]'}`}>
      
      {/* Sidebar */}
      <Sidebar 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
        currentView={currentView} 
        navigateTo={navigateTo} 
        isDarkMode={isDarkMode}
      />

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative transition-all duration-300">
        
        {/* Top Navbar */}
        <TopNavbar 
          user={user} 
          handleLogout={handleLogout} 
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />

        {/* Scrollable Page Content */}
        <main className="flex-1 overflow-y-auto custom-scrollbar relative z-0 flex flex-col">
          <div className="p-4 sm:p-6 lg:p-8 flex-grow">
            <div className="max-w-7xl mx-auto w-full pb-10">
              {children}
            </div>
          </div>
          <Footer
            socialLinks={footerSocials}
            navLinks={footerNav}
            brandName="Optimizer AI"
            className="shrink-0 border-t dark:border-[#2A2D3A] mt-0 bg-transparent"
          />
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
