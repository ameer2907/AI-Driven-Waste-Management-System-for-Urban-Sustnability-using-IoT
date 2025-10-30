import { useState } from "react";
import { Header } from "@/components/Header";
import { DashboardOverview } from "@/components/DashboardOverview";
import { BinMonitoring } from "@/components/BinMonitoring";
import { MapView } from "@/components/MapView";
import { ImageUpload } from "@/components/ImageUpload";
import { RouteOptimization } from "@/components/RouteOptimization";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const renderContent = () => {
    switch (activeTab) {
      case "overview":
        return <DashboardOverview />;
      case "monitoring":
        return <BinMonitoring />;
      case "map":
        return <MapView />;
      case "routes":
        return <RouteOptimization />;
      case "image-upload":
        return <ImageUpload />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-dark">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="container mx-auto px-4 py-6">
        {renderContent()}
      </main>
    </div>
  );
};

export default Index;