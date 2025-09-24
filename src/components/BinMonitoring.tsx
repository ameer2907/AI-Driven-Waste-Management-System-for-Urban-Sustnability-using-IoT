import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  MapPin, 
  Thermometer, 
  Droplets, 
  Battery, 
  Wifi, 
  AlertTriangle,
  CheckCircle2,
  Filter
} from "lucide-react";

export const BinMonitoring = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const bins = [
    {
      id: "A001",
      location: "Central Park - Main Entrance",
      fillLevel: 85,
      temperature: 24,
      humidity: 67,
      battery: 78,
      signal: 4,
      status: "warning",
      lastUpdate: "2 min ago",
      coordinates: { lat: 40.7829, lng: -73.9654 },
      predictedFull: "3h",
      type: "General Waste"
    },
    {
      id: "A002", 
      location: "Times Square - North",
      fillLevel: 95,
      temperature: 26,
      humidity: 71,
      battery: 92,
      signal: 5,
      status: "critical",
      lastUpdate: "1 min ago",
      coordinates: { lat: 40.7580, lng: -73.9855 },
      predictedFull: "30min",
      type: "Mixed Waste"
    },
    {
      id: "B003",
      location: "Brooklyn Bridge - Pedestrian",
      fillLevel: 45,
      temperature: 22,
      humidity: 65,
      battery: 65,
      signal: 3,
      status: "normal",
      lastUpdate: "5 min ago", 
      coordinates: { lat: 40.7061, lng: -73.9969 },
      predictedFull: "8h",
      type: "Recyclables"
    },
    {
      id: "C004",
      location: "Washington Square Park",
      fillLevel: 73,
      temperature: 25,
      humidity: 69,
      battery: 88,
      signal: 4,
      status: "normal",
      lastUpdate: "3 min ago",
      coordinates: { lat: 40.7308, lng: -73.9973 },
      predictedFull: "4h",
      type: "General Waste"
    },
    {
      id: "D005",
      location: "High Line - Chelsea Market",
      fillLevel: 92,
      temperature: 27,
      humidity: 72,
      battery: 43,
      signal: 2,
      status: "warning",
      lastUpdate: "8 min ago",
      coordinates: { lat: 40.7424, lng: -74.0065 },
      predictedFull: "1h",
      type: "Organic Waste"
    },
    {
      id: "E006",
      location: "Battery Park - South Ferry",
      fillLevel: 35,
      temperature: 21,
      humidity: 63,
      battery: 95,
      signal: 5,
      status: "normal",
      lastUpdate: "4 min ago",
      coordinates: { lat: 40.7033, lng: -74.0170 },
      predictedFull: "12h",
      type: "Recyclables"
    }
  ];

  const filteredBins = bins.filter(bin => {
    const matchesSearch = bin.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bin.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || bin.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "critical": return "border-destructive text-destructive bg-destructive/10";
      case "warning": return "border-warning text-warning bg-warning/10";
      case "normal": return "border-success text-success bg-success/10";
      default: return "border-muted text-muted-foreground bg-muted/10";
    }
  };

  const getSignalBars = (signal: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <div
        key={i}
        className={`w-1 h-3 rounded-sm ${
          i < signal ? 'bg-success' : 'bg-muted'
        }`}
      />
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Smart Bin Monitoring</h2>
          <p className="text-muted-foreground">Real-time IoT sensor data from deployed smart bins</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bins..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-64"
            />
          </div>
          <Button 
            variant={filterStatus === "all" ? "default" : "outline"}
            onClick={() => setFilterStatus("all")}
            size="sm"
          >
            All
          </Button>
          <Button 
            variant={filterStatus === "critical" ? "default" : "outline"}
            onClick={() => setFilterStatus("critical")}
            size="sm"
          >
            Critical
          </Button>
          <Button 
            variant={filterStatus === "warning" ? "default" : "outline"}
            onClick={() => setFilterStatus("warning")}
            size="sm"
          >
            Warning
          </Button>
        </div>
      </div>

      {/* Bin Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBins.map((bin) => (
          <Card key={bin.id} className="bg-gradient-card border-border/50 hover:shadow-card transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-mono">{bin.id}</CardTitle>
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <MapPin className="h-3 w-3" />
                    {bin.location}
                  </p>
                </div>
                <Badge variant="outline" className={getStatusColor(bin.status)}>
                  {bin.status === "critical" && <AlertTriangle className="h-3 w-3 mr-1" />}
                  {bin.status === "normal" && <CheckCircle2 className="h-3 w-3 mr-1" />}
                  {bin.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Fill Level */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Fill Level</span>
                  <span className="text-sm font-bold">{bin.fillLevel}%</span>
                </div>
                <Progress value={bin.fillLevel} className="h-3" />
                <p className="text-xs text-muted-foreground mt-1">
                  Predicted full in: {bin.predictedFull}
                </p>
              </div>

              {/* Sensor Data */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-iot-orange" />
                  <div>
                    <p className="text-xs text-muted-foreground">Temperature</p>
                    <p className="font-medium">{bin.temperature}°C</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-iot-blue" />
                  <div>
                    <p className="text-xs text-muted-foreground">Humidity</p>
                    <p className="font-medium">{bin.humidity}%</p>
                  </div>
                </div>
              </div>

              {/* System Status */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Battery className="h-4 w-4 text-success" />
                  <div>
                    <p className="text-xs text-muted-foreground">Battery</p>
                    <p className="font-medium">{bin.battery}%</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Wifi className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-xs text-muted-foreground">Signal</p>
                    <div className="flex gap-0.5 mt-1">
                      {getSignalBars(bin.signal)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Waste Type & Last Update */}
              <div className="flex justify-between items-center pt-2 border-t border-border/50">
                <Badge variant="secondary" className="text-xs">
                  {bin.type}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Updated {bin.lastUpdate}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBins.length === 0 && (
        <Card className="bg-gradient-card border-border/50">
          <CardContent className="text-center py-12">
            <Filter className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-lg font-medium">No bins found</p>
            <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};