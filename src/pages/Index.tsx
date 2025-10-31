import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { DashboardOverview } from "@/components/DashboardOverview";
import { ImageUpload } from "@/components/ImageUpload";
import { HardwareModel3D } from "@/components/HardwareModel3D";
import { IntroAnimation } from "@/components/IntroAnimation";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showIntro, setShowIntro] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger fade-in animation on mount
    setIsLoaded(true);
  }, []);

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview />;
      case "ai-classification":
        return <ImageUpload />;
      case "hardware-model":
        return <HardwareModel3D />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <>
      {showIntro && <IntroAnimation onComplete={() => setShowIntro(false)} />}
      
      <div className="min-h-screen bg-gradient-dark">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className={`container mx-auto px-4 py-6 transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          <div className="animate-fade-in-up">
            {renderContent()}
          </div>
        </main>
        
        {/* Ambient background effects */}
        <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-iot-blue/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>
    </>
  );
};

export default Index;