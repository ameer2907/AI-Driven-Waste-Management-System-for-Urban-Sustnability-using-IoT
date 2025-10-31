import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Cpu, BarChart3, Map, Activity, Wifi, Navigation } from "lucide-react";

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header = ({ activeTab, setActiveTab }: HeaderProps) => {
  const tabs = [
    { id: "overview", label: "Dashboard Overview", icon: BarChart3 },
    { id: "ai-classification", label: "AI Waste Classifier", icon: Cpu },
    { id: "hardware-model", label: "3D Hardware Model", icon: Wifi },
    { id: "monitoring", label: "Smart Bin Monitoring", icon: Activity },
    { id: "map", label: "Live Map View", icon: Map },
    { id: "routes", label: "Route Optimization", icon: Navigation },
  ];

  return (
    <header className="bg-card/80 backdrop-blur-lg border-b border-border/50 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-primary p-3 rounded-xl shadow-glow">
              <Wifi className="h-8 w-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent">
                AI Driven Predictive Waste Management System
              </h1>
              <p className="text-muted-foreground">For Urban Sustainability using IoT</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-success/10 text-success border-success/30">
              <div className="w-2 h-2 bg-success rounded-full mr-2 animate-pulse-glow" />
              System Online
            </Badge>
            <Badge variant="outline" className="bg-iot-blue/10 text-iot-blue border-iot-blue/30">
              127 Bins Connected
            </Badge>
          </div>
        </div>
        
        <nav className="flex gap-2 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? "bg-primary text-primary-foreground shadow-glow" 
                    : "hover:bg-secondary/80"
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </Button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};